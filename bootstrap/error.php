<?php
declare(strict_types=1);
if (!defined('ATOMIC_START')) { exit; }

$logDir  = ATOMIC_DIR . DIRECTORY_SEPARATOR . 'storage' . DIRECTORY_SEPARATOR . 'logs';
$logFile = $logDir . DIRECTORY_SEPARATOR . 'php_errors-' . date('Y-m-d') . '.log';

ini_set('log_errors', '1');
ini_set('html_errors', '0');

if (is_writable($logDir)) {
    ini_set('error_log', $logFile);
} else {
    error_log('[Atomic] Log directory not writable: ' . $logDir);
}
