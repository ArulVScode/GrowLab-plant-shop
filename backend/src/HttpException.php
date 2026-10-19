<?php
declare(strict_types=1);

// Thrown anywhere in a controller; the front controller turns it into a JSON error.
final class HttpException extends Exception
{
    public int $status;
    public array $fields;

    public function __construct(int $status, string $message, array $fields = [])
    {
        parent::__construct($message);
        $this->status = $status;
        $this->fields = $fields;
    }
}
