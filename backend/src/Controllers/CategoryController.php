<?php
declare(strict_types=1);

final class CategoryController
{
    private const SELECT = 'SELECT c.*, (SELECT COUNT(*) FROM products p WHERE p.category_id = c.id) AS product_count
                            FROM categories c';

    public static function index(): void
    {
        $rows = Database::connection()
            ->query(self::SELECT . ' ORDER BY c.created_at DESC, c.id DESC')
            ->fetchAll();
        Response::ok(array_map([self::class, 'format'], $rows));
    }

    public static function show(array $params): void
    {
        Response::ok(self::format(self::findOrFail((int) $params['id'])));
    }

    public static function store(): void
    {
        Auth::requireAdmin();
        $data = self::validated(Request::json());
        $pdo = Database::connection();

        self::assertSlugFree($data['slug']);

        $stmt = $pdo->prepare(
            'INSERT INTO categories (name, slug, description, status) VALUES (:name, :slug, :description, :status)'
        );
        $stmt->execute($data);

        Response::ok(self::format(self::findOrFail((int) $pdo->lastInsertId())), 201);
    }

    public static function update(array $params): void
    {
        Auth::requireAdmin();
        $id = (int) $params['id'];
        self::findOrFail($id);
        $data = self::validated(Request::json());

        self::assertSlugFree($data['slug'], $id);

        $stmt = Database::connection()->prepare(
            'UPDATE categories SET name = :name, slug = :slug, description = :description, status = :status WHERE id = :id'
        );
        $stmt->execute($data + ['id' => $id]);

        Response::ok(self::format(self::findOrFail($id)));
    }

    public static function destroy(array $params): void
    {
        Auth::requireAdmin();
        $id = (int) $params['id'];
        $category = self::findOrFail($id);

        // Products reference categories with ON DELETE RESTRICT, so a category that
        // still has products cannot be removed. Say so clearly instead of a raw SQL error.
        if ((int) $category['product_count'] > 0) {
            throw new HttpException(
                409,
                "Category still has {$category['product_count']} product(s). Move or delete them first."
            );
        }

        Database::connection()->prepare('DELETE FROM categories WHERE id = :id')->execute(['id' => $id]);
        Response::ok(['id' => $id]);
    }

    // ---------------------------------------------------------------

    private static function findOrFail(int $id): array
    {
        $stmt = Database::connection()->prepare(self::SELECT . ' WHERE c.id = :id');
        $stmt->execute(['id' => $id]);
        $row = $stmt->fetch();
        if (!$row) {
            throw new HttpException(404, 'Category not found.');
        }
        return $row;
    }

    private static function assertSlugFree(string $slug, ?int $exceptId = null): void
    {
        $stmt = Database::connection()->prepare('SELECT id FROM categories WHERE slug = :slug AND id <> :id');
        $stmt->execute(['slug' => $slug, 'id' => $exceptId ?? 0]);
        if ($stmt->fetch()) {
            throw new HttpException(409, 'Validation failed.', ['slug' => 'Slug already exists.']);
        }
    }

    // Same rules the React CategoryForm enforces, re-checked here because
    // the server can never trust the browser.
    private static function validated(array $in): array
    {
        $errors = [];
        $name = trim((string) ($in['name'] ?? ''));
        if ($name === '') {
            $errors['name'] = 'Category name is required.';
        } elseif (mb_strlen($name) > 100) {
            $errors['name'] = 'Category name must be at most 100 characters.';
        }

        $slug = trim((string) ($in['slug'] ?? ''));
        if ($slug === '' && $name !== '') {
            $slug = self::slugify($name);
        }
        if ($slug === '') {
            $errors['slug'] = 'Slug is required.';
        } elseif (!preg_match('/^[a-z0-9]+(?:-[a-z0-9]+)*$/', $slug)) {
            $errors['slug'] = 'Slug may only contain lowercase letters, numbers, and hyphens.';
        }

        $status = (string) ($in['status'] ?? 'active');
        if (!in_array($status, ['active', 'inactive'], true)) {
            $errors['status'] = 'Status must be "active" or "inactive".';
        }

        if ($errors) {
            throw new HttpException(422, 'Validation failed.', $errors);
        }

        return [
            'name' => $name,
            'slug' => $slug,
            'description' => trim((string) ($in['description'] ?? '')),
            'status' => $status,
        ];
    }

    private static function slugify(string $text): string
    {
        $text = strtolower(trim($text));
        $text = preg_replace('/[^a-z0-9]+/', '-', $text) ?? '';
        return trim($text, '-');
    }

    // DB row (snake_case) -> the exact shape the React categoryService already uses.
    private static function format(array $r): array
    {
        return [
            'id' => (int) $r['id'],
            'name' => $r['name'],
            'slug' => $r['slug'],
            'description' => $r['description'] ?? '',
            'status' => $r['status'],
            'productCount' => (int) $r['product_count'],
            'createdAt' => date('c', strtotime($r['created_at'])),
            'updatedAt' => date('c', strtotime($r['updated_at'])),
        ];
    }
}
