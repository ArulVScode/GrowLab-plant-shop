<?php
declare(strict_types=1);

final class Request
{
    public static function method(): string
    {
        return strtoupper($_SERVER['REQUEST_METHOD'] ?? 'GET');
    }

    // Path relative to the "/api" segment, wherever it happens to sit —
    // works whether the vhost DocumentRoot points straight at public/
    // (URL starts with /api) or at a shared parent folder (URL looks like
    // /pupuk-tanaman/backend/public/api/categories).
    public static function path(): string
    {
        $path = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH) ?: '/';
        $pos = strpos($path, '/api');
        if ($pos !== false) {
            $path = substr($path, $pos + 4);
        }
        return '/' . trim($path, '/');
    }

    public static function query(string $key, ?string $default = null): ?string
    {
        return isset($_GET[$key]) ? (string) $_GET[$key] : $default;
    }

    // Parsed JSON request body (the React app sends application/json).
    public static function json(): array
    {
        $raw = file_get_contents('php://input');
        if ($raw === false || trim($raw) === '') {
            return [];
        }
        $data = json_decode($raw, true);
        if (!is_array($data)) {
            throw new HttpException(400, 'Request body must be valid JSON.');
        }
        return $data;
    }
}
