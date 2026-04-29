# Atomic Application - Skeleton

Lightweight application skeleton for Atomic Framework. Minimal setup and structure to start building applications with Atomic.

Repository:
- Framework: https://github.com/MADEVAL/Atomic-Framework
- Application skeleton: https://github.com/MADEVAL/Atomic-Framework-Application

Requirements:
- PHP >= 8.1 and Composer.
- MySQL/MariaDB.
- Redis recommended for cache and queues.
- PHP extensions: json, session, mbstring, fileinfo, pdo, pdo_mysql, curl.

Quick start:

```bash
git clone https://github.com/MADEVAL/Atomic-Framework-Application.git myapp
cd myapp
composer install
cp .env.example .env
php atomic init/key
php -S localhost:8000 -t public
```

Key folders:
- `app/` - application code (controllers, models, middleware).
- `bootstrap/` - framework bootstrap and initialization.
- `config/` - configuration files.
- `public/` - web root.
- `routes/`, `resources/`, `storage/` - routes, templates, logs/uploads.

Common commands:
- `php atomic init` - scaffold project.
- `php atomic migrations/migrate` - run migrations.
- `php atomic queue/worker` - start queue worker.
- `php vendor/bin/phpunit` - run tests.

License: GPL-3.0-or-later.
