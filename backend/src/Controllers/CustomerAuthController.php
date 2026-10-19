<?php
declare(strict_types=1);

final class CustomerAuthController
{
    public static function register(): void
    {
        $in = Request::json();
        $errors = [];

        $name = trim((string) ($in['name'] ?? ''));
        if ($name === '') {
            $errors['name'] = 'Nama lengkap wajib diisi.';
        }

        $email = trim((string) ($in['email'] ?? ''));
        if ($email === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
            $errors['email'] = 'Email tidak valid.';
        }

        $phone = trim((string) ($in['phone'] ?? ''));
        if ($phone === '') {
            $errors['phone'] = 'Nomor HP wajib diisi.';
        }

        $password = (string) ($in['password'] ?? '');
        if (strlen($password) < 6) {
            $errors['password'] = 'Password minimal 6 karakter.';
        }

        if (empty($errors) && $email !== '') {
            $stmt = Database::connection()->prepare('SELECT id FROM customers WHERE email = :email');
            $stmt->execute(['email' => $email]);
            if ($stmt->fetch()) {
                $errors['email'] = 'Email sudah terdaftar.';
            }
        }

        if ($errors) {
            throw new HttpException(422, 'Validation failed.', $errors);
        }

        $pdo = Database::connection();
        $stmt = $pdo->prepare(
            'INSERT INTO customers (name, email, password_hash, phone, status)
             VALUES (:name, :email, :hash, :phone, "active")'
        );
        $stmt->execute([
            'name' => $name,
            'email' => $email,
            'hash' => password_hash($password, PASSWORD_DEFAULT),
            'phone' => $phone,
        ]);

        $customerId = (int) $pdo->lastInsertId();
        $token = Auth::issueCustomerToken($customerId);

        $stmt = $pdo->prepare('SELECT * FROM customers WHERE id = :id');
        $stmt->execute(['id' => $customerId]);

        Response::ok(['token' => $token, 'customer' => self::format($stmt->fetch())], 201);
    }

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

        $stmt = Database::connection()->prepare('SELECT * FROM customers WHERE email = :email');
        $stmt->execute(['email' => $email]);
        $customer = $stmt->fetch();

        if (!$customer || !password_verify($password, $customer['password_hash'])) {
            throw new HttpException(401, 'Email atau password salah.');
        }
        if ($customer['status'] === 'suspended') {
            throw new HttpException(403, 'Akun ini telah ditangguhkan.');
        }

        $token = Auth::issueCustomerToken((int) $customer['id']);

        Response::ok(['token' => $token, 'customer' => self::format($customer)]);
    }

    public static function logout(): void
    {
        Auth::revoke('customer_tokens');
        Response::ok(['success' => true]);
    }

    public static function me(): void
    {
        Response::ok(self::format(Auth::requireCustomer()));
    }

    private static function format(array $c): array
    {
        return [
            'id' => (int) $c['id'],
            'name' => $c['name'],
            'email' => $c['email'],
            'phone' => $c['phone'],
            'city' => $c['city'],
            'status' => $c['status'],
        ];
    }
}