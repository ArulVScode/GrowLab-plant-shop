<?php
// Central configuration. Defaults match a stock XAMPP install
// (MySQL user "root" with an empty password). Change here if yours differs.
return [
    'db' => [
        'host' => '127.0.0.1',
        'port' => 3306,
        'name' => 'growlab_db',
        'user' => 'root',
        'pass' => '',
    ],
    // Origins allowed to call this API from the browser (the Vite dev server).
    'cors_origins' => [
        'http://localhost:5173', 
        'http://127.0.0.1:5173',
    ],
    'debug' => true, // set false in production so error details are not exposed
];
