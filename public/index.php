<?php
declare(strict_types=1);
// Atomic – power in minimalism
define('ATOMIC_START', microtime(true));
$atomic = require_once __DIR__ . '/../bootstrap/app.php';
$atomic->run();
