<?php
declare(strict_types=1);

// Tiny autoloader: Foo -> src/Foo.php or src/Controllers/Foo.php
spl_autoload_register(function (string $class): void {
    foreach ([__DIR__, __DIR__ . '/Controllers'] as $dir) {
        $file = $dir . '/' . $class . '.php';
        if (is_file($file)) {
            require $file;
            return;
        }
    }
});

date_default_timezone_set('Asia/Jakarta');

// Any uncaught error becomes a JSON response (never an HTML error page).
set_exception_handler(function (Throwable $e): void {
    if ($e instanceof HttpException) {
        Response::error($e->status, $e->getMessage(), $e->fields);
    }
    $message = Config::get('debug') ? $e->getMessage() : 'Internal server error.';
    Response::error(500, $message);
});
