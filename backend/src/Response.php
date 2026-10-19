<?php
declare(strict_types=1);

final class Response
{
    public static function json($data, int $status = 200): void
    {
        http_response_code($status);
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
        exit;
    }

    public static function ok($data, int $status = 200): void
    {
        self::json(['data' => $data], $status);
    }

    public static function error(int $status, string $message, array $fields = []): void
    {
        $error = ['message' => $message];
        if ($fields) {
            $error['fields'] = $fields;
        }
        self::json(['error' => $error], $status);
    }
}
