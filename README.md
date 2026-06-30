# Atomic Application — Skeleton

[![License: GPL-3.0](https://img.shields.io/badge/license-GPL--3.0-blue.svg)](LICENSE)
[![PHP](https://img.shields.io/badge/PHP-%3E%3D8.1-777BB4.svg)](https://www.php.net/)

Lightweight application skeleton for Atomic Framework. Minimal setup and structure to start building applications with Atomic.

## Requirements

- PHP >= 8.1 and Composer.
- MySQL/MariaDB.
- Redis recommended for cache and queues.
- PHP extensions: json, session, mbstring, fileinfo, pdo, pdo_mysql, curl.

## Installation

```bash
composer create-project globus-studio/atomic-framework-application myapp
cd myapp
composer install
cp .env.example .env
php atomic init/key
php -S localhost:8000 -t public
```

Or clone directly:

```bash
git clone https://github.com/MADEVAL/Atomic-Framework-Application.git myapp
cd myapp
composer install
cp .env.example .env
php atomic init/key
php -S localhost:8000 -t public
```

## Project Structure

- `app/` - application code (controllers, models, middleware).
- `bootstrap/` - framework bootstrap and initialization.
- `config/` - configuration files.
- `public/` - web root.
- `routes/`, `resources/`, `storage/` - routes, templates, logs/uploads.

## Common Commands

- `php atomic init` - scaffold project.
- `php atomic migrations/migrate` - run migrations.
- `php atomic queue/worker` - start queue worker.
- `php vendor/bin/phpunit` - run tests.

## Links

- Framework: https://github.com/MADEVAL/Atomic-Framework
- Skeleton: https://github.com/MADEVAL/Atomic-Framework-Application

## License

GPL-3.0-or-later. See [LICENSE](LICENSE).
