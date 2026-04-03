<?php
declare(strict_types=1);
namespace App\Http\Controllers;

if (!defined('ATOMIC_START')) exit;

use Engine\Atomic\App\Controller;
use Engine\Atomic\Auth\Auth;
use Engine\Atomic\Core\App;
use Engine\Atomic\Theme\Theme;

class DashboardController extends Controller
{
    public function __construct()
    {
        parent::__construct();
        $app = App::instance();
        if (!$app->get('__theme_booted')) {
            Theme::instance();
            $app->set('__theme_booted', true);
        }
    }

    public function index(\Base $f3): void
    {
        $user = Auth::instance()->get_current_user();
        $f3->set('PAGE.title', 'Dashboard');
        echo \View::instance()->render('account/dashboard.atom.php', 'text/html', [
            'user' => $user,
        ]);
    }
}
