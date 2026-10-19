<?php
declare(strict_types=1);

final class CustomerController
{
    private const BASE = "SELECT c.id, c.name, c.email, c.phone, c.city, c.status, c.created_at,
            COUNT(o.id) AS total_orders,
            COALESCE(SUM(CASE WHEN o.payment_status = 'paid' THEN o.total END), 0) AS total_spent
        FROM customers c
        LEFT JOIN orders o ON o.customer_id = c.id";

    // GET /customers (admin)
    public static function index(): void
    {
        Auth::requireAdmin();
        $rows = Database::connection()->query(self::BASE . ' GROUP BY c.id ORDER BY c.id ASC')->fetchAll();
        Response::ok(array_map([self::class, 'format'], $rows));
    }

    // GET /customers/{id} (admin)
    public static function show(array $params): void
    {
        Auth::requireAdmin();
        Response::ok(self::format(self::findOrFail((int) $params['id'])));
    }

    // PUT /customers/{id}/status (admin)
    public static function updateStatus(array $params): void
    {
        Auth::requireAdmin();
        $status = (string) (Request::json()['status'] ?? '');
        if (!in_array($status, ['active', 'suspended'], true)) {
            throw new HttpException(422, 'Validation failed.', ['status' => 'Must be active or suspended.']);
        }
        $row = self::findOrFail((int) $params['id']);
        Database::connection()
            ->prepare('UPDATE customers SET status = :s WHERE id = :id')
            ->execute(['s' => $status, 'id' => $row['id']]);
        Response::ok(self::format(self::findOrFail((int) $row['id'])));
    }

    private static function findOrFail(int $id): array
    {
        $stmt = Database::connection()->prepare(self::BASE . ' WHERE c.id = :id GROUP BY c.id');
        $stmt->execute(['id' => $id]);
        $row = $stmt->fetch();
        if (!$row) {
            throw new HttpException(404, 'Customer not found.');
        }
        return $row;
    }

    private static function format(array $r): array
    {
        return [
            'id' => (int) $r['id'],
            'name' => $r['name'],
            'email' => $r['email'],
            'phone' => $r['phone'] ?? '',
            'city' => $r['city'] ?? '',
            'status' => $r['status'],
            'joinedAt' => date('c', strtotime($r['created_at'])),
            'totalOrders' => (int) $r['total_orders'],
            'totalSpent' => (int) $r['total_spent'],
        ];
    }
}