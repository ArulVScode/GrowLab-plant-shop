<?php
declare(strict_types=1);

final class Router
{
    /** @var array<int, array{0:string,1:string,2:callable}> */
    private array $routes = [];

    public function add(string $method, string $pattern, callable $handler): void
    {
        // "/categories/{id}" -> named capture group
        $regex = '#^' . preg_replace('#\{(\w+)\}#', '(?P<$1>[^/]+)', $pattern) . '$#';
        $this->routes[] = [strtoupper($method), $regex, $handler];
    }

    public function dispatch(string $method, string $path): void
    {
        $pathMatched = false;
        foreach ($this->routes as [$routeMethod, $regex, $handler]) {
            if (preg_match($regex, $path, $m)) {
                $pathMatched = true;
                if ($routeMethod === $method) {
                    $params = array_filter($m, 'is_string', ARRAY_FILTER_USE_KEY);
                    $handler($params);
                    return;
                }
            }
        }
        if ($pathMatched) {
            throw new HttpException(405, 'Method not allowed.');
        }
        throw new HttpException(404, 'Endpoint not found.');
    }
}
