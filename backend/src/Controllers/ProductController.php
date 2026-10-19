<?php
declare(strict_types=1);

final class ProductController
{
    private const UNITS = ['pcs', 'kg', 'liter', 'ml', 'pack', 'bottle', 'sack'];

    public static function index(): void
    {
        $pdo = Database::connection();

        $page = max(1, (int) Request::query('page', '1'));
        $pageSize = min(50, max(1, (int) Request::query('pageSize', '10')));
        $search = trim((string) Request::query('q', ''));
        $category = trim((string) Request::query('category', ''));
        $status = (string) Request::query('status', 'all');
        $stock = (string) Request::query('stock', 'all');
        $sort = (string) Request::query('sort', 'newest');

        $where = [];
        $params = [];

        if ($search !== '') {
            // MySQL's real (non-emulated) prepared statements don't allow the
            // same named placeholder to appear twice in one query, so each
            // LIKE gets its own bound parameter even though the value is identical.
            $where[] = '(p.name LIKE :search_name OR p.sku LIKE :search_sku)';
            $params['search_name'] = "%{$search}%";
            $params['search_sku'] = "%{$search}%";
        }
        if ($category !== '' && $category !== 'all') {
            $where[] = 'c.name = :category';
            $params['category'] = $category;
        }
        if (in_array($status, ['active', 'inactive'], true)) {
            $where[] = 'p.status = :status';
            $params['status'] = $status;
        }
        if ($stock === 'out_of_stock') {
            $where[] = 'p.stock = 0';
        } elseif ($stock === 'low_stock') {
            $where[] = 'p.stock > 0 AND p.stock <= p.minimum_stock';
        } elseif ($stock === 'in_stock') {
            $where[] = 'p.stock > p.minimum_stock';
        }

        $whereSql = $where ? 'WHERE ' . implode(' AND ', $where) : '';

        $orderBy = match ($sort) {
            'oldest' => 'p.created_at ASC',
            'name-asc' => 'p.name ASC',
            'name-desc' => 'p.name DESC',
            'price-asc' => 'p.price ASC',
            'price-desc' => 'p.price DESC',
            'stock-asc' => 'p.stock ASC',
            'stock-desc' => 'p.stock DESC',
            default => 'p.created_at DESC',
        };

        $countStmt = $pdo->prepare(
            "SELECT COUNT(*) FROM products p JOIN categories c ON c.id = p.category_id {$whereSql}"
        );
        $countStmt->execute($params);
        $total = (int) $countStmt->fetchColumn();

        $stmt = $pdo->prepare(
            "SELECT p.*, c.name AS category_name
             FROM products p
             JOIN categories c ON c.id = p.category_id
             {$whereSql}
             ORDER BY {$orderBy}
             LIMIT :limit OFFSET :offset"
        );
        foreach ($params as $key => $value) {
            $stmt->bindValue($key, $value);
        }
        $stmt->bindValue('limit', $pageSize, PDO::PARAM_INT);
        $stmt->bindValue('offset', ($page - 1) * $pageSize, PDO::PARAM_INT);
        $stmt->execute();
        $rows = $stmt->fetchAll();

        Response::json([
            'data' => array_map([self::class, 'format'], self::attachRelations($rows)),
            'meta' => [
                'page' => $page,
                'pageSize' => $pageSize,
                'total' => $total,
                'totalPages' => max(1, (int) ceil($total / $pageSize)),
            ],
        ]);
    }

    public static function show(array $params): void
    {
        Response::ok(self::format(self::findOrFail((int) $params['id'])));
    }

    public static function store(): void
    {
        Auth::requireAdmin();
        $data = self::validated(Request::json(), null);

        $pdo = Database::connection();
        $pdo->beginTransaction();
        try {
            $stmt = $pdo->prepare(
                'INSERT INTO products
                    (name, slug, sku, category_id, brand, price, original_price, discount, stock,
                     minimum_stock, unit, status, short_description, description, usage_instructions, composition)
                 VALUES
                    (:name, :slug, :sku, :category_id, :brand, :price, :original_price, :discount, :stock,
                     :minimum_stock, :unit, :status, :short_description, :description, :usage_instructions, :composition)'
            );
            $stmt->execute([
                'name' => $data['name'], 'slug' => $data['slug'], 'sku' => $data['sku'],
                'category_id' => $data['category_id'], 'brand' => $data['brand'],
                'price' => $data['price'], 'original_price' => $data['original_price'], 'discount' => $data['discount'],
                'stock' => $data['stock'], 'minimum_stock' => $data['minimum_stock'], 'unit' => $data['unit'],
                'status' => $data['status'], 'short_description' => $data['short_description'],
                'description' => $data['description'], 'usage_instructions' => $data['usage'], 'composition' => $data['composition'],
            ]);
            $id = (int) $pdo->lastInsertId();

            self::saveImages($id, $data['images']);
            self::saveBenefits($id, $data['benefits']);

            $pdo->commit();
        } catch (Throwable $e) {
            $pdo->rollBack();
            throw $e;
        }

        Response::ok(self::format(self::findOrFail($id)), 201);
    }

    public static function update(array $params): void
    {
        Auth::requireAdmin();
        $id = (int) $params['id'];
        self::findOrFail($id);
        $data = self::validated(Request::json(), $id);

        $pdo = Database::connection();
        $pdo->beginTransaction();
        try {
            $stmt = $pdo->prepare(
                'UPDATE products SET
                    name = :name, slug = :slug, sku = :sku, category_id = :category_id, brand = :brand,
                    price = :price, original_price = :original_price, discount = :discount, stock = :stock,
                    minimum_stock = :minimum_stock, unit = :unit, status = :status,
                    short_description = :short_description, description = :description,
                    usage_instructions = :usage_instructions, composition = :composition
                 WHERE id = :id'
            );
            $stmt->execute([
                'name' => $data['name'], 'slug' => $data['slug'], 'sku' => $data['sku'],
                'category_id' => $data['category_id'], 'brand' => $data['brand'],
                'price' => $data['price'], 'original_price' => $data['original_price'], 'discount' => $data['discount'],
                'stock' => $data['stock'], 'minimum_stock' => $data['minimum_stock'], 'unit' => $data['unit'],
                'status' => $data['status'], 'short_description' => $data['short_description'],
                'description' => $data['description'], 'usage_instructions' => $data['usage'], 'composition' => $data['composition'],
                'id' => $id,
            ]);

            // Full replace keeps this in lock-step with how the admin ProductForm
            // always submits the complete gallery/benefits list, not a diff.
            $pdo->prepare('DELETE FROM product_images WHERE product_id = :id')->execute(['id' => $id]);
            $pdo->prepare('DELETE FROM product_benefits WHERE product_id = :id')->execute(['id' => $id]);
            self::saveImages($id, $data['images']);
            self::saveBenefits($id, $data['benefits']);

            $pdo->commit();
        } catch (Throwable $e) {
            $pdo->rollBack();
            throw $e;
        }

        Response::ok(self::format(self::findOrFail($id)));
    }

    public static function destroy(array $params): void
    {
        Auth::requireAdmin();
        $id = (int) $params['id'];
        self::findOrFail($id);
        // order_items.product_id is ON DELETE SET NULL, so past orders keep
        // their snapshotted name/price/image and are never affected by this.
        Database::connection()->prepare('DELETE FROM products WHERE id = :id')->execute(['id' => $id]);
        Response::ok(['id' => $id]);
    }

    public static function bulkUpdateStatus(): void
    {
        Auth::requireAdmin();
        $in = Request::json();
        $ids = self::validIds($in['ids'] ?? []);
        $status = (string) ($in['status'] ?? '');
        if (!in_array($status, ['active', 'inactive'], true)) {
            throw new HttpException(422, 'Validation failed.', ['status' => 'Status must be "active" or "inactive".']);
        }

        $pdo = Database::connection();
        $placeholders = implode(',', array_fill(0, count($ids), '?'));
        $stmt = $pdo->prepare("UPDATE products SET status = ? WHERE id IN ({$placeholders})");
        $stmt->execute([$status, ...$ids]);

        Response::ok(['updated' => $ids, 'status' => $status]);
    }

    public static function bulkDelete(): void
    {
        Auth::requireAdmin();
        $ids = self::validIds(Request::json()['ids'] ?? []);

        $pdo = Database::connection();
        $placeholders = implode(',', array_fill(0, count($ids), '?'));
        $pdo->prepare("DELETE FROM products WHERE id IN ({$placeholders})")->execute($ids);

        Response::ok(['deleted' => $ids]);
    }

    // ---------------------------------------------------------------

    private static function validIds(mixed $ids): array
    {
        if (!is_array($ids) || empty($ids)) {
            throw new HttpException(422, 'Validation failed.', ['ids' => 'At least one product id is required.']);
        }
        return array_map('intval', $ids);
    }

    private static function findOrFail(int $id): array
    {
        $stmt = Database::connection()->prepare(
            'SELECT p.*, c.name AS category_name FROM products p JOIN categories c ON c.id = p.category_id WHERE p.id = :id'
        );
        $stmt->execute(['id' => $id]);
        $row = $stmt->fetch();
        if (!$row) {
            throw new HttpException(404, 'Product not found.');
        }
        return self::attachRelations([$row])[0];
    }

    // Batch-fetches images/benefits for a whole page of products in 2 queries
    // total instead of 2-per-row, then groups them back onto each product.
    private static function attachRelations(array $rows): array
    {
        if (!$rows) {
            return [];
        }
        $ids = array_column($rows, 'id');
        $placeholders = implode(',', array_fill(0, count($ids), '?'));
        $pdo = Database::connection();

        $images = $pdo->prepare(
            "SELECT * FROM product_images WHERE product_id IN ({$placeholders}) ORDER BY product_id, is_main DESC, sort_order"
        );
        $images->execute($ids);
        $imagesByProduct = [];
        foreach ($images->fetchAll() as $img) {
            $imagesByProduct[$img['product_id']][] = $img;
        }

        $benefits = $pdo->prepare(
            "SELECT * FROM product_benefits WHERE product_id IN ({$placeholders}) ORDER BY product_id, sort_order"
        );
        $benefits->execute($ids);
        $benefitsByProduct = [];
        foreach ($benefits->fetchAll() as $b) {
            $benefitsByProduct[$b['product_id']][] = $b['benefit_text'];
        }

        foreach ($rows as &$row) {
            $row['_images'] = $imagesByProduct[$row['id']] ?? [];
            $row['_benefits'] = $benefitsByProduct[$row['id']] ?? [];
        }
        return $rows;
    }

    private static function saveImages(int $productId, array $images): void
    {
        if (!$images) {
            return;
        }
        $stmt = Database::connection()->prepare(
            'INSERT INTO product_images (product_id, image_url, is_main, sort_order) VALUES (:pid, :url, :main, :sort)'
        );
        foreach (array_values($images) as $i => $url) {
            $stmt->execute(['pid' => $productId, 'url' => $url, 'main' => $i === 0 ? 1 : 0, 'sort' => $i]);
        }
    }

    private static function saveBenefits(int $productId, array $benefits): void
    {
        if (!$benefits) {
            return;
        }
        $stmt = Database::connection()->prepare(
            'INSERT INTO product_benefits (product_id, benefit_text, sort_order) VALUES (:pid, :text, :sort)'
        );
        foreach (array_values($benefits) as $i => $text) {
            if (trim((string) $text) === '') {
                continue;
            }
            $stmt->execute(['pid' => $productId, 'text' => $text, 'sort' => $i]);
        }
    }

    private static function assertSkuFree(string $sku, ?int $exceptId): void
    {
        $stmt = Database::connection()->prepare('SELECT id FROM products WHERE sku = :sku AND id <> :id');
        $stmt->execute(['sku' => $sku, 'id' => $exceptId ?? 0]);
        if ($stmt->fetch()) {
            throw new HttpException(409, 'Validation failed.', ['sku' => 'SKU already exists.']);
        }
    }

    private static function resolveCategoryId(string $categoryName): int
    {
        $stmt = Database::connection()->prepare('SELECT id FROM categories WHERE name = :name');
        $stmt->execute(['name' => $categoryName]);
        $id = $stmt->fetchColumn();
        if ($id === false) {
            throw new HttpException(422, 'Validation failed.', ['category' => 'Selected category does not exist.']);
        }
        return (int) $id;
    }

    private static function slugify(string $text): string
    {
        $text = strtolower(trim($text));
        $text = preg_replace('/[^a-z0-9]+/', '-', $text) ?? '';
        return trim($text, '-');
    }

    // Same rules the React ProductForm enforces (name/sku/category/price/
    // stock/minimumStock/description required, price/stock/minimumStock >= 0),
    // re-checked server-side because the browser can never be trusted.
    private static function validated(array $in, ?int $exceptId): array
    {
        $errors = [];

        $name = trim((string) ($in['name'] ?? ''));
        if ($name === '') {
            $errors['name'] = 'Product name is required.';
        }

        $sku = trim((string) ($in['sku'] ?? ''));
        if ($sku === '') {
            $errors['sku'] = 'SKU is required.';
        }

        $categoryName = trim((string) ($in['category'] ?? ''));
        if ($categoryName === '') {
            $errors['category'] = 'Category is required.';
        }

        $price = $in['price'] ?? '';
        if ($price === '' || !is_numeric($price) || (float) $price < 0) {
            $errors['price'] = 'Price must be greater than or equal to 0.';
        }

        $stock = $in['stock'] ?? '';
        if ($stock === '' || !is_numeric($stock) || (float) $stock < 0) {
            $errors['stock'] = 'Stock must be greater than or equal to 0.';
        }

        $minimumStock = $in['minimumStock'] ?? '';
        if ($minimumStock === '' || !is_numeric($minimumStock) || (float) $minimumStock < 0) {
            $errors['minimumStock'] = 'Minimum stock must be greater than or equal to 0.';
        }

        $description = trim((string) ($in['description'] ?? ''));
        if ($description === '') {
            $errors['description'] = 'Description is required.';
        }

        $status = (string) ($in['status'] ?? 'active');
        if (!in_array($status, ['active', 'inactive'], true)) {
            $errors['status'] = 'Status must be "active" or "inactive".';
        }

        $unit = (string) ($in['unit'] ?? 'pcs');
        if (!in_array($unit, self::UNITS, true)) {
            $errors['unit'] = 'Invalid unit.';
        }

        if ($errors) {
            throw new HttpException(422, 'Validation failed.', $errors);
        }

        // Cross-checks that need a DB round trip only run once the basic
        // shape is already valid, same order the frontend validates in.
        self::assertSkuFree($sku, $exceptId);
        $categoryId = self::resolveCategoryId($categoryName);

        $slug = trim((string) ($in['slug'] ?? '')) ?: self::slugify($name);

        return [
            'name' => $name,
            'slug' => $slug,
            'sku' => $sku,
            'category_id' => $categoryId,
            'brand' => trim((string) ($in['brand'] ?? '')),
            'price' => (int) $price,
            'original_price' => isset($in['originalPrice']) && $in['originalPrice'] !== ''
                ? (int) $in['originalPrice'] : (int) $price,
            'discount' => isset($in['discount']) && $in['discount'] !== '' ? (int) $in['discount'] : 0,
            'stock' => (int) $stock,
            'minimum_stock' => (int) $minimumStock,
            'unit' => $unit,
            'status' => $status,
            'short_description' => trim((string) ($in['shortDescription'] ?? '')),
            'description' => $description,
            'usage' => trim((string) ($in['usage'] ?? '')),
            'composition' => trim((string) ($in['composition'] ?? '')),
            'images' => is_array($in['images'] ?? null) ? array_values(array_filter($in['images'])) : [],
            'benefits' => is_array($in['benefits'] ?? null) ? array_values($in['benefits']) : [],
        ];
    }

    // DB rows (+ _images/_benefits) -> the exact shape productService.js already uses.
    private static function format(array $r): array
    {
        $images = array_column($r['_images'], 'image_url');
        $main = $images[0] ?? null;

        return [
            'id' => (int) $r['id'],
            'name' => $r['name'],
            'slug' => $r['slug'],
            'sku' => $r['sku'],
            'category' => $r['category_name'],
            'brand' => $r['brand'] ?? '',
            'price' => (int) $r['price'],
            'originalPrice' => (int) $r['original_price'],
            'discount' => (int) $r['discount'],
            'stock' => (int) $r['stock'],
            'minimumStock' => (int) $r['minimum_stock'],
            'unit' => $r['unit'],
            'rating' => (float) $r['rating'],
            'sold' => (int) $r['sold'],
            'status' => $r['status'],
            'image' => $main,
            'images' => $images,
            'shortDescription' => $r['short_description'] ?? '',
            'description' => $r['description'] ?? '',
            'benefits' => $r['_benefits'],
            'usage' => $r['usage_instructions'] ?? '',
            'composition' => $r['composition'] ?? '',
            'createdAt' => date('c', strtotime($r['created_at'])),
            'updatedAt' => date('c', strtotime($r['updated_at'])),
        ];
    }
}