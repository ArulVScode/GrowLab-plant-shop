<?php
declare(strict_types=1);

final class OrderController
{
    private const MANAGEABLE_STATUSES = ['PROCESSING', 'READY_TO_SHIP', 'SHIPPED', 'IN_TRANSIT', 'DELIVERED', 'CANCELLED'];

    // Rank used to derive the public tracking timeline from order_status_history.
    // SHIPPED and IN_TRANSIT collapse onto the same "transit" timeline step,
    // matching the frontend's original hand-authored timeline shape.
    private const STATUS_RANK = [
        'PENDING_PAYMENT' => 0, 'PROCESSING' => 1, 'READY_TO_SHIP' => 2,
        'SHIPPED' => 3, 'IN_TRANSIT' => 3, 'DELIVERED' => 4,
    ];
    private const STEP_RANK = ['paid' => 0, 'processing' => 1, 'ready' => 2, 'transit' => 3, 'delivered' => 4];
    private const STEP_LABELS = [
        'paid' => 'Pembayaran dikonfirmasi',
        'processing' => 'Sedang diproses',
        'ready' => 'Siap dikirim',
        'transit' => 'Dalam perjalanan',
        'delivered' => 'Pesanan diterima',
    ];

    public static function index(): void
    {
        Auth::requireAdmin();
        $pdo = Database::connection();

        $page = max(1, (int) Request::query('page', '1'));
        $pageSize = min(50, max(1, (int) Request::query('pageSize', '10')));
        $search = trim((string) Request::query('q', ''));
        $status = (string) Request::query('status', 'all');
        $payment = (string) Request::query('payment', 'all');
        $sort = (string) Request::query('sort', 'newest');

        $where = [];
        $params = [];
        if ($search !== '') {
            $where[] = '(o.order_number LIKE :search_no OR o.shipping_name LIKE :search_name)';
            $params['search_no'] = "%{$search}%";
            $params['search_name'] = "%{$search}%";
        }
        if (in_array($status, self::MANAGEABLE_STATUSES, true) || $status === 'PENDING_PAYMENT') {
            $where[] = 'o.status = :status';
            $params['status'] = $status;
        }
        if (in_array($payment, ['paid', 'pending', 'refunded'], true)) {
            $where[] = 'o.payment_status = :payment';
            $params['payment'] = $payment;
        }
        $whereSql = $where ? 'WHERE ' . implode(' AND ', $where) : '';

        $orderBy = match ($sort) {
            'oldest' => 'o.created_at ASC',
            'total-asc' => 'o.total ASC',
            'total-desc' => 'o.total DESC',
            default => 'o.created_at DESC',
        };

        $countStmt = $pdo->prepare("SELECT COUNT(*) FROM orders o {$whereSql}");
        $countStmt->execute($params);
        $total = (int) $countStmt->fetchColumn();

        $stmt = $pdo->prepare(
            "SELECT o.* FROM orders o {$whereSql} ORDER BY {$orderBy} LIMIT :limit OFFSET :offset"
        );
        foreach ($params as $k => $v) {
            $stmt->bindValue($k, $v);
        }
        $stmt->bindValue('limit', $pageSize, PDO::PARAM_INT);
        $stmt->bindValue('offset', ($page - 1) * $pageSize, PDO::PARAM_INT);
        $stmt->execute();
        $rows = $stmt->fetchAll();

        Response::json([
            'data' => array_map([self::class, 'formatSummary'], $rows),
            'meta' => [
                'page' => $page, 'pageSize' => $pageSize, 'total' => $total,
                'totalPages' => max(1, (int) ceil($total / $pageSize)),
            ],
        ]);
    }

    // Public on purpose — tracking by order number needs no login, same as
    // a courier's tracking page. Anyone who knows the order number can view it.
    public static function show(array $params): void
    {
        Response::ok(self::format(self::findOrFail($params['orderNumber'])));
    }

    // Customer "Pesanan Saya" — only the logged-in customer's own orders.
    public static function myOrders(): void
    {
        $customer = Auth::requireCustomer();
        $stmt = Database::connection()->prepare(
            'SELECT * FROM orders WHERE customer_id = :cid ORDER BY created_at DESC'
        );
        $stmt->execute(['cid' => $customer['id']]);
        $orders = array_map(fn($o) => self::attachRelations($o, $customer), $stmt->fetchAll());
        Response::ok(array_map([self::class, 'format'], $orders));
    }

    // Checkout. Requires a logged-in customer — browsing and adding to cart
    // stay guest-friendly on the frontend, but placing an order does not.
    public static function store(): void
    {
        $customer = Auth::requireCustomer();
        $in = Request::json();

        $items = $in['items'] ?? [];
        if (!is_array($items) || empty($items)) {
            throw new HttpException(422, 'Validation failed.', ['items' => 'Cart is empty.']);
        }

        $address = $in['shippingAddress'] ?? [];
        foreach (['name', 'phone', 'address', 'city', 'postalCode'] as $f) {
            if (trim((string) ($address[$f] ?? '')) === '') {
                throw new HttpException(422, 'Validation failed.', ['shippingAddress' => "Field \"{$f}\" is required."]);
            }
        }

        $courier = trim((string) ($in['courier'] ?? ''));
        $paymentMethod = trim((string) ($in['paymentMethod'] ?? ''));
        if ($courier === '' || $paymentMethod === '') {
            throw new HttpException(422, 'Validation failed.', ['courier' => 'Shipping and payment method are required.']);
        }
        $shippingCost = max(0, (int) ($in['shippingCost'] ?? 0));
        $discount = max(0, (int) ($in['discount'] ?? 0));

        $pdo = Database::connection();
        $pdo->beginTransaction();
        try {
            // Prices are never trusted from the client — each line is
            // re-priced from the current product row, and stock is locked
            // with FOR UPDATE so two simultaneous checkouts can't both
            // succeed on the last unit.
            $lineItems = [];
            $subtotal = 0;
            foreach ($items as $item) {
                $productId = (int) ($item['productId'] ?? 0);
                $qty = max(1, (int) ($item['qty'] ?? 1));

                $stmt = $pdo->prepare('SELECT * FROM products WHERE id = :id FOR UPDATE');
                $stmt->execute(['id' => $productId]);
                $product = $stmt->fetch();
                if (!$product) {
                    throw new HttpException(422, 'Validation failed.', ['items' => "Product #{$productId} not found."]);
                }
                if ($product['stock'] < $qty) {
                    throw new HttpException(409, "Insufficient stock for \"{$product['name']}\". Only {$product['stock']} left.");
                }

                $lineItems[] = [
                    'product_id' => $productId,
                    'name' => $product['name'],
                    'image' => self::mainImage((int) $productId),
                    'qty' => $qty,
                    'price' => (int) $product['price'],
                ];
                $subtotal += (int) $product['price'] * $qty;

                $pdo->prepare('UPDATE products SET stock = stock - :qty1, sold = sold + :qty2 WHERE id = :id')
                    ->execute(['qty1' => $qty, 'qty2' => $qty, 'id' => $productId]);
            }

            $total = max(0, $subtotal + $shippingCost - $discount);
            $orderNumber = self::generateOrderNumber();
            $departure = date('Y-m-d', strtotime('+1 day'));
            $arrivalStart = date('Y-m-d', strtotime('+3 days'));
            $arrivalEnd = date('Y-m-d', strtotime('+5 days'));

            $paymentStatus = 'pending';

            $stmt = $pdo->prepare(
                'INSERT INTO orders
                    (order_number, customer_id, subtotal, shipping_cost, discount, total, payment_method,
                     payment_status, status, courier, tracking_number, estimated_departure,
                     estimated_arrival_start, estimated_arrival_end,
                     shipping_name, shipping_phone, shipping_address, shipping_city, shipping_postal_code)
                 VALUES
                    (:order_number, :customer_id, :subtotal, :shipping_cost, :discount, :total, :payment_method,
                     :payment_status, \'PROCESSING\', :courier, :tracking_number, :departure, :arrival_start, :arrival_end,
                     :s_name, :s_phone, :s_address, :s_city, :s_postal)'
            );
            $stmt->execute([
                'order_number' => $orderNumber, 'customer_id' => $customer['id'], 'subtotal' => $subtotal,
                'shipping_cost' => $shippingCost, 'discount' => $discount, 'total' => $total,
                'payment_method' => $paymentMethod, 'payment_status' => $paymentStatus, 'courier' => $courier,
                'tracking_number' => 'TRK' . random_int(1000000, 9999999),
                'departure' => $departure, 'arrival_start' => $arrivalStart, 'arrival_end' => $arrivalEnd,
                's_name' => $address['name'], 's_phone' => $address['phone'], 's_address' => $address['address'],
                's_city' => $address['city'], 's_postal' => $address['postalCode'],
            ]);
            $orderId = (int) $pdo->lastInsertId();

            $itemStmt = $pdo->prepare(
                'INSERT INTO order_items (order_id, product_id, product_name, product_image, qty, price)
                 VALUES (:oid, :pid, :name, :image, :qty, :price)'
            );
            foreach ($lineItems as $li) {
                $itemStmt->execute([
                    'oid' => $orderId, 'pid' => $li['product_id'], 'name' => $li['name'],
                    'image' => $li['image'], 'qty' => $li['qty'], 'price' => $li['price'],
                ]);
            }

            $pdo->prepare('INSERT INTO order_status_history (order_id, status) VALUES (:oid, \'PENDING_PAYMENT\')')
                ->execute(['oid' => $orderId]);
            $pdo->prepare('INSERT INTO order_status_history (order_id, status) VALUES (:oid, \'PROCESSING\')')
                ->execute(['oid' => $orderId]);

            $pdo->commit();
        } catch (Throwable $e) {
            $pdo->rollBack();
            throw $e;
        }

        Response::ok(self::format(self::findOrFail($orderNumber)), 201);
    }

    public static function updateStatus(array $params): void
    {
        Auth::requireAdmin();
        $order = self::findRawOrFail($params['orderNumber']);
        $status = (string) (Request::json()['status'] ?? '');
        if (!in_array($status, self::MANAGEABLE_STATUSES, true)) {
            throw new HttpException(422, 'Validation failed.', [
                'status' => 'Status must be one of: ' . implode(', ', self::MANAGEABLE_STATUSES),
            ]);
        }

        // Payment status follows fulfillment status in two realistic cases:
        // a COD order is only actually paid once it's delivered, and
        // cancelling an order that was already paid implies a refund.
        $paymentStatus = $order['payment_status'];
        if ($status === 'DELIVERED' && $paymentStatus === 'pending') {
            $paymentStatus = 'paid';
        } elseif ($status === 'CANCELLED' && $paymentStatus === 'paid') {
            $paymentStatus = 'refunded';
        }

        $pdo = Database::connection();
        $pdo->prepare('UPDATE orders SET status = :status, payment_status = :payment_status WHERE id = :id')
            ->execute(['status' => $status, 'payment_status' => $paymentStatus, 'id' => $order['id']]);
        $pdo->prepare('INSERT INTO order_status_history (order_id, status) VALUES (:oid, :status)')
            ->execute(['oid' => $order['id'], 'status' => $status]);

        Response::ok(self::format(self::findOrFail($params['orderNumber'])));
    }

    // Manual override for cases automation can't cover — e.g. admin verifies
    // a bank transfer by hand, or corrects a mistaken status.
    public static function updatePaymentStatus(array $params): void
    {
        Auth::requireAdmin();
        $order = self::findRawOrFail($params['orderNumber']);
        $paymentStatus = (string) (Request::json()['paymentStatus'] ?? '');
        if (!in_array($paymentStatus, ['pending', 'paid', 'refunded'], true)) {
            throw new HttpException(422, 'Validation failed.', [
                'paymentStatus' => 'Must be one of: pending, paid, refunded.',
            ]);
        }

        Database::connection()
            ->prepare('UPDATE orders SET payment_status = :s WHERE id = :id')
            ->execute(['s' => $paymentStatus, 'id' => $order['id']]);

        Response::ok(self::format(self::findOrFail($params['orderNumber'])));
    }

    public static function updateTracking(array $params): void
    {
        Auth::requireAdmin();
        $order = self::findRawOrFail($params['orderNumber']);
        $in = Request::json();
        $courier = trim((string) ($in['courier'] ?? ''));
        $trackingNumber = trim((string) ($in['trackingNumber'] ?? ''));
        if ($courier === '' || $trackingNumber === '') {
            throw new HttpException(422, 'Validation failed.', ['courier' => 'Courier and tracking number are required.']);
        }

        Database::connection()
            ->prepare('UPDATE orders SET courier = :courier, tracking_number = :tn WHERE id = :id')
            ->execute(['courier' => $courier, 'tn' => $trackingNumber, 'id' => $order['id']]);

        Response::ok(self::format(self::findOrFail($params['orderNumber'])));
    }

    // ---------------------------------------------------------------

    private static function mainImage(int $productId): ?string
    {
        $stmt = Database::connection()->prepare(
            'SELECT image_url FROM product_images WHERE product_id = :id ORDER BY is_main DESC, sort_order LIMIT 1'
        );
        $stmt->execute(['id' => $productId]);
        $url = $stmt->fetchColumn();
        return $url !== false ? $url : null;
    }

    private static function generateOrderNumber(): string
    {
        $datePart = date('Ymd');
        $stmt = Database::connection()->prepare("SELECT COUNT(*) FROM orders WHERE order_number LIKE :p");
        $stmt->execute(['p' => "GL-{$datePart}-%"]);
        $seq = (int) $stmt->fetchColumn() + 1;
        return sprintf('GL-%s-%03d', $datePart, $seq);
    }

    private static function findRawOrFail(string $orderNumber): array
    {
        $stmt = Database::connection()->prepare('SELECT * FROM orders WHERE order_number = :n');
        $stmt->execute(['n' => $orderNumber]);
        $row = $stmt->fetch();
        if (!$row) {
            throw new HttpException(404, 'Order not found.');
        }
        return $row;
    }

    private static function findOrFail(string $orderNumber): array
    {
        return self::attachRelations(self::findRawOrFail($orderNumber));
    }

    // Attaches order_items, status history, and customer info onto a raw
    // orders row. $knownCustomer lets callers that already have the customer
    // row (e.g. myOrders(), which only ever deals with one customer) skip
    // the extra per-row lookup.
    private static function attachRelations(array $order, ?array $knownCustomer = null): array
    {
        $pdo = Database::connection();

        $items = $pdo->prepare('SELECT * FROM order_items WHERE order_id = :id');
        $items->execute(['id' => $order['id']]);
        $order['_items'] = $items->fetchAll();

        $history = $pdo->prepare('SELECT * FROM order_status_history WHERE order_id = :id ORDER BY changed_at ASC, id ASC');
        $history->execute(['id' => $order['id']]);
        $order['_history'] = $history->fetchAll();

        if ($knownCustomer !== null) {
            $order['_customer'] = $knownCustomer;
        } else {
            $customer = $pdo->prepare('SELECT name, email, phone FROM customers WHERE id = :id');
            $customer->execute(['id' => $order['customer_id']]);
            $order['_customer'] = $customer->fetch() ?: null;
        }

        return $order;
    }

    // Builds the fixed 6-step tracking timeline (created/paid/processing/
    // ready/transit/delivered, or created/cancelled) from the status
    // history's real timestamps.
    private static function buildTimeline(array $order): array
    {
        $historyByStatus = [];
        foreach ($order['_history'] as $h) {
            $historyByStatus[$h['status']] ??= $h['changed_at'];
        }

        $createdLabel = self::timeLabel($order['created_at']);

        if ($order['status'] === 'CANCELLED') {
            $cancelledAt = $historyByStatus['CANCELLED'] ?? $order['updated_at'];
            return [
                ['key' => 'created', 'label' => 'Pesanan dibuat', 'time' => $createdLabel, 'done' => true],
                ['key' => 'cancelled', 'label' => 'Pesanan dibatalkan', 'time' => self::timeLabel($cancelledAt), 'done' => true, 'active' => true],
            ];
        }

        $currentRank = self::STATUS_RANK[$order['status']] ?? 0;
        $steps = [['key' => 'created', 'label' => 'Pesanan dibuat', 'time' => $createdLabel, 'done' => true]];

        foreach (self::STEP_RANK as $key => $rank) {
            $done = $currentRank >= $rank;
            $time = '';
            if ($key === 'paid') {
                // "paid" = first history row whose status moved past PENDING_PAYMENT.
                foreach (self::STATUS_RANK as $statusKey => $statusRank) {
                    if ($statusRank >= 1 && isset($historyByStatus[$statusKey])) {
                        $time = self::timeLabel($historyByStatus[$statusKey]);
                        break;
                    }
                }
            } elseif ($key === 'transit') {
                $time = self::timeLabel($historyByStatus['SHIPPED'] ?? $historyByStatus['IN_TRANSIT'] ?? '');
            } else {
                $map = ['processing' => 'PROCESSING', 'ready' => 'READY_TO_SHIP', 'delivered' => 'DELIVERED'];
                $time = isset($map[$key], $historyByStatus[$map[$key]]) ? self::timeLabel($historyByStatus[$map[$key]]) : '';
            }
            if (!$done) {
                $time = $key === 'ready' ? 'Menunggu proses keberangkatan' : ($key === 'processing' ? 'Pesanan sedang disiapkan oleh penjual' : '');
            }

            $steps[] = [
                'key' => $key,
                'label' => self::STEP_LABELS[$key],
                'time' => $time,
                'done' => $done,
                'active' => $done && $rank === $currentRank,
            ];
        }

        return $steps;
    }

    private static function timeLabel(?string $datetime): string
    {
        if (!$datetime) {
            return '';
        }
        $ts = strtotime($datetime);
        return $ts ? date('j F, H:i', $ts) : '';
    }

    private static function formatSummary(array $r): array
    {
        $stmt = Database::connection()->prepare('SELECT name, email, phone FROM customers WHERE id = :id');
        $stmt->execute(['id' => $r['customer_id']]);
        $customer = $stmt->fetch() ?: ['name' => $r['shipping_name'], 'email' => '', 'phone' => $r['shipping_phone']];

        return [
            'orderNumber' => $r['order_number'],
            'customerName' => $customer['name'],
            'customerEmail' => $customer['email'],
            'customerPhone' => $customer['phone'],
            'total' => (int) $r['total'],
            'status' => $r['status'],
            'paymentStatus' => $r['payment_status'],
            'itemCount' => (int) Database::connection()
                ->query('SELECT COUNT(*) FROM order_items WHERE order_id = ' . (int) $r['id'])
                ->fetchColumn(),
            'createdAt' => date('c', strtotime($r['created_at'])),
        ];
    }

    private static function format(array $r): array
    {
        return [
            'orderNumber' => $r['order_number'],
            'customerName' => $r['_customer']['name'] ?? $r['shipping_name'],
            'customerEmail' => $r['_customer']['email'] ?? '',
            'customerPhone' => $r['_customer']['phone'] ?? $r['shipping_phone'],
            'createdAt' => date('c', strtotime($r['created_at'])),
            'updatedAt' => date('c', strtotime($r['updated_at'])),
            'items' => array_map(fn($i) => [
                'productId' => $i['product_id'] !== null ? (int) $i['product_id'] : null,
                'name' => $i['product_name'],
                'image' => $i['product_image'],
                'qty' => (int) $i['qty'],
                'price' => (int) $i['price'],
            ], $r['_items']),
            'subtotal' => (int) $r['subtotal'],
            'shippingCost' => (int) $r['shipping_cost'],
            'discount' => (int) $r['discount'],
            'total' => (int) $r['total'],
            'paymentMethod' => $r['payment_method'],
            'paymentStatus' => $r['payment_status'],
            'status' => $r['status'],
            'courier' => $r['courier'],
            'trackingNumber' => $r['tracking_number'],
            'estimatedDeparture' => $r['estimated_departure'],
            'estimatedArrival' => $r['estimated_arrival_start'] && $r['estimated_arrival_end']
                ? self::dateLabel($r['estimated_arrival_start']) . ' – ' . self::dateLabel($r['estimated_arrival_end'])
                : null,
            'shippingAddress' => [
                'name' => $r['shipping_name'],
                'phone' => $r['shipping_phone'],
                'address' => $r['shipping_address'],
                'city' => $r['shipping_city'],
                'postalCode' => $r['shipping_postal_code'],
            ],
            'timeline' => self::buildTimeline($r),
        ];
    }

    private static function dateLabel(string $date): string
    {
        $ts = strtotime($date);
        return $ts ? date('j F Y', $ts) : $date;
    }
}