<?php
declare(strict_types=1);
if (!defined('ATOMIC_START')) exit;

return [
    // Supported drivers: folder, redis, memcached.
    // Exposed by the framework loaders as CACHE_CONFIG.default/path/prefix.
    'default'  => 'folder',
    'path'     => 'storage/framework/cache/',
    'prefix'   => 'atomic.',
];
