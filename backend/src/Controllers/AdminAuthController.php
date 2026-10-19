<?php
declare(strict_types=1);

final class AdminAuthController
{
    public static function login(): void
    {
        $in = Request::json();
        $email = trim((string) ($in['email'] ?? ''));
        $password = (string) ($in['password'] ?? '');

        if ($email === '' || $password === '') {
            $fields = array_filter([
                'email' => $email === '' ? 'Email is required.' : null,
                'password' => $password === '' ? 'Password is required.' : null,
            ]);
            throw new HttpException(422, 'Validation failed.', $fields);
        }

        $stmt = Database::connection()->prepare('SELECT * FROM admins WHERE email = :email');
        $stmt->execute(['email' => $email]);
        $admin = $stmt->fetch();

        if (!$admin || !password_verify($password, $admin['password_hash'])) {
            throw new HttpException(401, 'Email atau password salah.');
        }

        $token = Auth::issueAdminToken((int) $admin['id']);

        Response::ok([
            'token' => $token,
            'admin' => self::format($admin),
        ]);
    }

    public static function logout(): void
    {
        Auth::revoke('admin_tokens');
        Response::ok(['success' => true]);
    }

    public static function me(): void
    {
        Response::ok(self::format(Auth::requireAdmin()));
    }

    private static function format(array $a): array
    {
        return [
            'id' => (int) $a['id'],
            'name' => $a['name'],
            'email' => $a['email'],
        ];
    }
}