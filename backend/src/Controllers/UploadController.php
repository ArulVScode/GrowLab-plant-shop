<?php
declare(strict_types=1);

final class UploadController
{
    private const MAX_BYTES = 2 * 1024 * 1024; // 2 MB
    private const TYPES = ['image/jpeg' => 'jpg', 'image/png' => 'png', 'image/webp' => 'webp'];

    // POST /uploads (multipart/form-data, field "file", admin only)
    public static function store(): void
    {
        Auth::requireAdmin();

        $file = $_FILES['file'] ?? null;
        if (!$file || ($file['error'] ?? UPLOAD_ERR_NO_FILE) !== UPLOAD_ERR_OK) {
            throw new HttpException(422, 'No file received (or it is larger than the server limit).');
        }
        if ($file['size'] > self::MAX_BYTES) {
            throw new HttpException(422, 'Image must be 2 MB or smaller.');
        }

        $info = @getimagesize($file['tmp_name']);
        $mime = $info['mime'] ?? '';
        if (!isset(self::TYPES[$mime])) {
            throw new HttpException(422, 'Only JPG, PNG, or WebP images are allowed.');
        }

        $dir = dirname(__DIR__, 2) . '/public/uploads';
        if (!is_dir($dir) && !mkdir($dir, 0755, true) && !is_dir($dir)) {
            throw new HttpException(500, 'Could not create the uploads folder.');
        }

        $name = bin2hex(random_bytes(8)) . '.' . self::TYPES[$mime];
        if (!move_uploaded_file($file['tmp_name'], $dir . '/' . $name)) {
            throw new HttpException(500, 'Could not save the uploaded file.');
        }

        $https = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off')
            || ($_SERVER['HTTP_X_FORWARDED_PROTO'] ?? '') === 'https';
        $base = rtrim(str_replace('\\', '/', dirname($_SERVER['SCRIPT_NAME'])), '/');
        $url = ($https ? 'https' : 'http') . '://' . $_SERVER['HTTP_HOST'] . $base . '/uploads/' . $name;

        Response::ok(['url' => $url], 201);
    }
}