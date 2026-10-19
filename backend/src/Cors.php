<?php
declare(strict_types=1);

final class Cors
{
    public static function handle(): void
    {
        $origin = $_SERVER['HTTP_ORIGIN'] ?? '';
        if ($origin !== '' && in_array($origin, Config::get('cors_origins', []), true)) {
            header("Access-Control-Allow-Origin: $origin");
            header('Vary: Origin');
            header('Access-Control-Allow-Headers: Content-Type, Authorization');
            header('Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS');
        }
        // Browsers send a preflight OPTIONS request before JSON/PUT/DELETE calls.
        if (Request::method() === 'OPTIONS') {
            http_response_code(204);
            exit;
        }
    }
}
