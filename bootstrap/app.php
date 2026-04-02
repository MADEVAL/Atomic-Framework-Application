<?php
declare(strict_types=1);
if (!defined('ATOMIC_START')) exit;

define('ATOMIC_ROOT', __DIR__);
require_once ATOMIC_ROOT . DIRECTORY_SEPARATOR . 'const.php';
require_once ATOMIC_ROOT . DIRECTORY_SEPARATOR . 'error.php';
require_once ATOMIC_VENDOR . 'autoload.php';
require_once ATOMIC_SUPPORT . 'helpers.php';

$atomic = \Base::instance();

use Engine\Atomic\Core\App;
use Engine\Atomic\Core\Config\ConfigLoader;
use Engine\Atomic\Core\Config\PhpConfigLoader;

switch (ATOMIC_LOADER) {
    case 'php':
        $phpLoader = new PhpConfigLoader($atomic);
        $phpLoader->load();
        break;
    case 'env':
        ConfigLoader::init($atomic, ATOMIC_ENV);
        break;
    default:
        ConfigLoader::init($atomic, ATOMIC_ENV);
        break;
}

$application = App::instance($atomic)
    ->prefly()
    ->registerLogger()
    ->registerExceptionHandler()
    ->registerLocales()
    ->registerUnloadHandler()
    ->registerMiddleware()
    ->registerRoutes()
    ->registerCorePlugins()
    ->registerPlugins()
    ->initTheme()
    ->initSession()
    ->setDB()
    ->registerLocaleHrefs()
    ->registerUserProvider();

\App\Event\Application::instance()->init();
\App\Hook\Application::instance()->init();

return $application;
