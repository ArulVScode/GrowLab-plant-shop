<?php
declare(strict_types=1);

// Bearer-token auth. Not JWT — just a random token stored server-side per
// login, same trust model as a session ID, easy to reason about and to
// revoke (logout just deletes the row).
final class Auth
{
    private const TOKEN_TTL_DAYS = 7;

    public static function issueAdminToken(int $adminId): string
    {
        return self::issue('admin_tokens', 'admin_id', $adminId);
    }

    public static function issueCustomerToken(int $customerId): string
    {
        return self::issue('customer_tokens', 'customer_id', $customerId);
    }

    private static function issue(string $table, string $column, int $id): string
    {
        $token = bin2hex(random_bytes(32));
        $expiresAt = date('Y-m-d H:i:s', strtotime('+' . self::TOKEN_TTL_DAYS . ' days'));
        $stmt = Database::connection()->prepare(
            "INSERT INTO {$table} ({$column}, token, expires_at) VALUES (:id, :token, :expires_at)"
        );
        $stmt->execute(['id' => $id, 'token' => $token, 'expires_at' => $expiresAt]);
        return $token;
    }

    // Reads "Authorization: Bearer <token>", verifies it against admin_tokens,
    // and returns the admin row. Throws 401 for anything invalid/expired.
    public static function requireAdmin(): array
    {
        $token = self::bearerToken();
        $stmt = Database::connection()->prepare(
            'SELECT a.* FROM admin_tokens t
             JOIN admins a ON a.id = t.admin_id
             WHERE t.token = :token AND t.expires_at > NOW()'
        );
        $stmt->execute(['token' => $token]);
        $admin = $stmt->fetch();
        if (!$admin) {
            throw new HttpException(401, 'Invalid or expired admin session.');
        }
        return $admin;
    }

    public static function requireCustomer(): array
    {
        $token = self::bearerToken();
        $stmt = Database::connection()->prepare(
            'SELECT c.* FROM customer_tokens t
             JOIN customers c ON c.id = t.customer_id
             WHERE t.token = :token AND t.expires_at > NOW()'
        );
        $stmt->execute(['token' => $token]);
        $customer = $stmt->fetch();
        if (!$customer) {
            throw new HttpException(401, 'Invalid or expired session. Please log in.');
        }
        if ($customer['status'] === 'suspended') {
            throw new HttpException(403, 'This account has been suspended.');
        }
        return $customer;
    }

    public static function revoke(string $table): void
    {
        $token = self::bearerToken();
        Database::connection()
            ->prepare("DELETE FROM {$table} WHERE token = :token")
            ->execute(['token' => $token]);
    }

    private static function bearerToken(): string
    {
        // getallheaders() is the normal path; the manual fallbacks cover
        // PHP-as-CGI/some Apache setups where it's unavailable or the
        // Authorization header arrives under a different server var.
        $header = '';
        if (function_exists('getallheaders')) {
            foreach (getallheaders() as $name => $value) {
                if (strtolower($name) === 'authorization') {
                    $header = $value;
                    break;
                }
            }
        }
        if ($header === '') {
            $header = $_SERVER['HTTP_AUTHORIZATION'] ?? $_SERVER['REDIRECT_HTTP_AUTHORIZATION'] ?? '';
        }
        if (!preg_match('/^Bearer\s+(\S+)$/i', $header, $m)) {
            throw new HttpException(401, 'Missing or malformed Authorization header.');
        }
        return $m[1];
    }
}