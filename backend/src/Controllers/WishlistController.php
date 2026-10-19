<?php
declare(strict_types=1);

final class WishlistController
{
    public static function index(): void
    {
        $customer = Auth::requireCustomer();
        $stmt = Database::connection()->prepare(
            'SELECT p.*, c.name AS category_name
             FROM wishlists w
             JOIN products p ON p.id = w.product_id
             JOIN categories c ON c.id = p.category_id
             WHERE w.customer_id = :cid
             ORDER BY w.created_at DESC'
        );
        $stmt->execute(['cid' => $customer['id']]);
        Response::ok(array_map([self::class, 'formatProduct'], self::attachImages($stmt->fetchAll())));
    }

    public static function store(): void
    {
        $customer = Auth::requireCustomer();
        $productId = (int) (Request::json()['productId'] ?? 0);

        $exists = Database::connection()->prepare('SELECT id FROM products WHERE id = :id');
        $exists->execute(['id' => $productId]);
        if (!$exists->fetch()) {
            throw new HttpException(404, 'Product not found.');
        }

        // INSERT IGNORE keeps this idempotent — clicking the heart twice
        // (double click, retried request) is not an error.
        Database::connection()
            ->prepare('INSERT IGNORE INTO wishlists (customer_id, product_id) VALUES (:cid, :pid)')
            ->execute(['cid' => $customer['id'], 'pid' => $productId]);

        Response::ok(['productId' => $productId], 201);
    }

    public static function destroy(array $params): void
    {
        $customer = Auth::requireCustomer();
        $productId = (int) $params['productId'];
        Database::connection()
            ->prepare('DELETE FROM wishlists WHERE customer_id = :cid AND product_id = :pid')
            ->execute(['cid' => $customer['id'], 'pid' => $productId]);
        Response::ok(['productId' => $productId]);
    }

    // ---------------------------------------------------------------

    private static function attachImages(array $rows): array
    {
        if (!$rows) {
            return [];
        }
        $ids = array_column($rows, 'id');
        $placeholders = implode(',', array_fill(0, count($ids), '?'));
        $stmt = Database::connection()->prepare(
            "SELECT * FROM product_images WHERE product_id IN ({$placeholders}) ORDER BY product_id, is_main DESC, sort_order"
        );
        $stmt->execute($ids);
        $byProduct = [];
        foreach ($stmt->fetchAll() as $img) {
            $byProduct[$img['product_id']][] = $img['image_url'];
        }
        foreach ($rows as &$row) {
            $row['_images'] = $byProduct[$row['id']] ?? [];
        }
        return $rows;
    }

    // Same public-facing shape ProductCard.jsx already knows how to render.
    private static function formatProduct(array $r): array
    {
        return [
            'id' => (int) $r['id'],
            'name' => $r['name'],
            'slug' => $r['slug'],
            'category' => $r['category_name'],
            'price' => (int) $r['price'],
            'originalPrice' => (int) $r['original_price'],
            'discount' => (int) $r['discount'],
            'rating' => (float) $r['rating'],
            'sold' => (int) $r['sold'],
            'stock' => (int) $r['stock'],
            'availability' => $r['stock'] > 0 ? 'in_stock' : 'out_of_stock',
            'image' => $r['_images'][0] ?? null,
            'images' => $r['_images'],
            'badge' => null,
        ];
    }
}