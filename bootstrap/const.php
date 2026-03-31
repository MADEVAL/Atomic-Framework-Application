<?php
declare(strict_types=1);
if (!defined('ATOMIC_START')) exit;

define('ATOMIC_LOADER', 'env');                                     // php or env
define('ATOMIC_PHP_ERRORS', true);                                  // Write PHP errors (true/false)
define('ATOMIC_VERSION', '0.1.0');                                  // Framework version
define('ATOMIC_NAME', 'Atomic Framework');                          // Framework name
define('ATOMIC_DIR', realpath(ATOMIC_ROOT . DIRECTORY_SEPARATOR . '..'));
define('ATOMIC_ENV', ATOMIC_DIR . DIRECTORY_SEPARATOR . '.env');
define('ATOMIC_APP_ROUTES', ATOMIC_DIR . DIRECTORY_SEPARATOR . 'routes' . DIRECTORY_SEPARATOR);
define('ATOMIC_CONFIG', ATOMIC_DIR . DIRECTORY_SEPARATOR . 'config' . DIRECTORY_SEPARATOR);
define('ATOMIC_VENDOR', ATOMIC_DIR . DIRECTORY_SEPARATOR . 'vendor' . DIRECTORY_SEPARATOR);
define('ATOMIC_FRAMEWORK', realpath(ATOMIC_VENDOR . 'atomic' . DIRECTORY_SEPARATOR . 'framework') . DIRECTORY_SEPARATOR);
define('ATOMIC_ENGINE', ATOMIC_FRAMEWORK . 'engine' . DIRECTORY_SEPARATOR);
define('ATOMIC_SUPPORT', ATOMIC_FRAMEWORK . 'engine' . DIRECTORY_SEPARATOR . 'Atomic' . DIRECTORY_SEPARATOR . 'Support' . DIRECTORY_SEPARATOR);
define('ATOMIC_UPLOADS', ATOMIC_DIR . DIRECTORY_SEPARATOR . 'public' . DIRECTORY_SEPARATOR . 'uploads' . DIRECTORY_SEPARATOR);

define('MINUTE_IN_SECONDS', 60);
define('HOUR_IN_SECONDS', 60 * MINUTE_IN_SECONDS);
define('DAY_IN_SECONDS', 24 * HOUR_IN_SECONDS);
define('WEEK_IN_SECONDS', 7 * DAY_IN_SECONDS);
define('MONTH_IN_SECONDS', 30 * DAY_IN_SECONDS);
define('YEAR_IN_SECONDS', 365 * DAY_IN_SECONDS);

define('HALF_HOUR_IN_SECONDS', 30 * MINUTE_IN_SECONDS);
define('HALF_DAY_IN_SECONDS', 12 * HOUR_IN_SECONDS);
define('EVERY_TWO_DAYS_IN_SECONDS', 2 * DAY_IN_SECONDS);
define('HALF_MONTH_IN_SECONDS', 15 * DAY_IN_SECONDS);

define('ATOMIC_MAX_MEMORY_LIMIT', 256);
define('ATOMIC_DEFAULT_MEMORY_LIMIT', 128);
define('ATOMIC_CACHE_ALL_PAGES', true);                             // Cache all pages (true/false)
define('ATOMIC_CACHE_EXPIRE_TIME', HOUR_IN_SECONDS);                // Cache expiration time in seconds
define('ATOMIC_SAVE_QUERIES', false);                               // Save database queries (true/false)
define('ATOMIC_COMPRESS_CSS', false);                               // Compress CSS (true/false)
define('ATOMIC_COMPRESS_JS', false);                                // Compress JS (true/false)
define('ATOMIC_CONCATENATE_SCRIPTS', false);                        // Concatenate JS (true/false)
define('ATOMIC_CONCATENATE_STYLES', false);                         // Concatenate CSS (true/false)

define('ATOMIC_HTTP_USERAGENT', 'AtomicHTTP/'.ATOMIC_VERSION.' PHP/'.PHP_VERSION . '; https://globus.studio');
define('ATOMIC_HTTP_RETRIES', 3);
define('ATOMIC_HTTP_TIMEOUT', 15);                                  // in seconds
define('ATOMIC_HTTP_ENGINE', 'curl');                               // curl | socket | stream

define('ATOMIC_JPEG_QUALITY', 85);                                  // JPEG quality (0-100)
define('ATOMIC_PNG_COMPRESSION_LEVEL', 6);                          // PNG compression level (0-9)
define('ATOMIC_WEBP_QUALITY', 85);                                  // WEBP quality (0-100)
define('ATOMIC_AVIF_QUALITY', 50);                                  // AVIF quality (0-100)
define('ATOMIC_SVG_PRECISION', 3);                                  // SVG precision (1-10)

define('ATOMIC_THUMBNAIL_SIZE', 150);                               // Default thumbnail size in pixels
define('ATOMIC_THUMBNAIL_CROP', true);                              // Crop thumbnails to exact size (true/false)
define('ATOMIC_THUMBNAIL_QUALITY', 85);                             // Thumbnail quality (0-100)
define('ATOMIC_IMAGE_SIZE_SMALL', 300);                             // Small image size in pixels
define('ATOMIC_IMAGE_SIZE_MEDIUM', 600);                            // Medium image size in pixels
define('ATOMIC_IMAGE_SIZE_LARGE', 1200);                            // Large image size in pixels
