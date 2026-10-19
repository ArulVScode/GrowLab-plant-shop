<?php
declare(strict_types=1);

// Front controller: every /api/* request lands here.
require __DIR__ . '/../src/bootstrap.php';

Cors::handle();

$router = new Router();

// ---- Categories ----
$router->add('GET',    '/categories',       fn() => CategoryController::index());
$router->add('GET',    '/categories/{id}',  fn($p) => CategoryController::show($p));
$router->add('POST',   '/categories',       fn() => CategoryController::store());
$router->add('PUT',    '/categories/{id}',  fn($p) => CategoryController::update($p));
$router->add('DELETE', '/categories/{id}',  fn($p) => CategoryController::destroy($p));

$router->add('POST', '/uploads', fn() => UploadController::store());

// --- Products ----
// The bulk-* routes MUST be registered before "/products/{id}", otherwise
// the router would try to treat "bulk-status" as a product id.
$router->add('POST',   '/products/bulk-status', fn() => ProductController::bulkUpdateStatus());
$router->add('POST',   '/products/bulk-delete', fn() => ProductController::bulkDelete());
$router->add('GET',    '/products',             fn() => ProductController::index());
$router->add('GET',    '/products/{id}',        fn($p) => ProductController::show($p));
$router->add('POST',   '/products',             fn() => ProductController::store());
$router->add('PUT',    '/products/{id}',        fn($p) => ProductController::update($p));
$router->add('DELETE', '/products/{id}',        fn($p) => ProductController::destroy($p));

// ---- Orders ----
$router->add('GET',  '/orders',                      fn() => OrderController::index());
$router->add('GET',  '/me/orders',                    fn() => OrderController::myOrders());
$router->add('GET',  '/orders/{orderNumber}',         fn($p) => OrderController::show($p));
$router->add('POST', '/orders',                       fn() => OrderController::store());
$router->add('PUT',  '/orders/{orderNumber}/status',  fn($p) => OrderController::updateStatus($p));
$router->add('PUT',  '/orders/{orderNumber}/tracking', fn($p) => OrderController::updateTracking($p));
$router->add('PUT',  '/orders/{orderNumber}/payment-status', fn($p) => OrderController::updatePaymentStatus($p));

// ---- Wishlist ----
$router->add('GET',    '/me/wishlist',              fn() => WishlistController::index());
$router->add('POST',   '/me/wishlist',               fn() => WishlistController::store());
$router->add('DELETE', '/me/wishlist/{productId}',  fn($p) => WishlistController::destroy($p));

// ---- Admin auth ----
$router->add('POST', '/admin/auth/login',  fn() => AdminAuthController::login());
$router->add('POST', '/admin/auth/logout', fn() => AdminAuthController::logout());
$router->add('GET',  '/admin/auth/me',     fn() => AdminAuthController::me());

// ---- Customers (admin) ----
$router->add('GET', '/customers',               fn() => CustomerController::index());
$router->add('GET', '/customers/{id}',          fn($p) => CustomerController::show($p));
$router->add('PUT', '/customers/{id}/status',   fn($p) => CustomerController::updateStatus($p));

// ---- Customer auth ----
$router->add('POST', '/auth/register', fn() => CustomerAuthController::register());
$router->add('POST', '/auth/login',    fn() => CustomerAuthController::login());
$router->add('POST', '/auth/logout',   fn() => CustomerAuthController::logout());
$router->add('GET',  '/auth/me',       fn() => CustomerAuthController::me());

// ---- Settings ----
$router->add('GET', '/settings/payment',       fn() => SettingsController::payment());
$router->add('PUT', '/admin/settings/payment', fn() => SettingsController::updatePayment());

// Health check — handy to confirm the server + DB are wired up.
$router->add('GET', '/health', function () {
    Database::connection()->query('SELECT 1');
    Response::ok(['status' => 'ok']);
});

$router->dispatch(Request::method(), Request::path());
