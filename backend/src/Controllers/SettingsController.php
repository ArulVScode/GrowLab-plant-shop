<?php
declare(strict_types=1);

final class SettingsController
{
    private const DEFAULTS = [
        'bank'    => ['name' => '', 'accountNumber' => '', 'accountName' => ''],
        'va'      => ['bank' => '', 'number' => ''],
        'ewallet' => ['provider' => '', 'number' => '', 'accountName' => '', 'qrisUrl' => ''],
    ];

    // GET /settings/payment (publik: pelanggan butuh ini setelah checkout)
    public static function payment(): void
    {
        Response::ok(self::load());
    }

    // PUT /admin/settings/payment
    public static function updatePayment(): void
    {
        Auth::requireAdmin();
        $in = Request::json();

        $clean = [];
        foreach (self::DEFAULTS as $group => $fields) {
            foreach ($fields as $field => $_) {
                $value = trim((string) ($in[$group][$field] ?? ''));
                $max = $field === 'qrisUrl' ? 500 : 100;
                if (mb_strlen($value) > $max) {
                    throw new HttpException(422, 'Validation failed.', ["$group.$field" => "Max $max characters."]);
                }
                $clean[$group][$field] = $value;
            }
        }
        if ($clean['ewallet']['qrisUrl'] !== '' && !preg_match('#^https?://#i', $clean['ewallet']['qrisUrl'])) {
            throw new HttpException(422, 'Validation failed.', ['ewallet.qrisUrl' => 'Must be an http(s) URL.']);
        }

        Database::connection()
            ->prepare("INSERT INTO settings (`key`, `value`) VALUES ('payment', :v) ON DUPLICATE KEY UPDATE `value` = VALUES(`value`)")
            ->execute(['v' => json_encode($clean, JSON_UNESCAPED_UNICODE)]);

        Response::ok($clean);
    }

    private static function load(): array
    {
        $stmt = Database::connection()->prepare("SELECT `value` FROM settings WHERE `key` = 'payment'");
        $stmt->execute();
        $saved = json_decode((string) ($stmt->fetchColumn() ?: '{}'), true) ?: [];

        $out = self::DEFAULTS;
        foreach ($out as $group => $fields) {
            foreach ($fields as $field => $_) {
                $out[$group][$field] = (string) ($saved[$group][$field] ?? '');
            }
        }
        return $out;
    }
}