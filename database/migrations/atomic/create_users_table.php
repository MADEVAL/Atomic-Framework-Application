<?php
declare(strict_types=1);

if (!defined('ATOMIC_START')) exit;

use DB\Cortex\Schema\Schema;
use App\Http\Models\User;

return [
    'up' => function () {
        try {
            $conf = User::resolveConfiguration();
            $db = $conf['db'];
            $table = $conf['table'];
            $schema = new Schema($db);
            $tables = $schema->getTables();

            if (in_array($table, $tables)) {
                echo "Table '{$table}' already exists. Skipping." . PHP_EOL;
                return;
            }

            $t = $schema->createTable($table);
            $t->addColumn('uuid')->type(Schema::DT_VARCHAR128)->nullable(false)->index(true);
            $t->addColumn('name')->type(Schema::DT_VARCHAR256)->nullable(true);
            $t->addColumn('email')->type(Schema::DT_VARCHAR256)->nullable(false)->index(true);
            $t->addColumn('password')->type(Schema::DT_VARCHAR256)->nullable(true);
            $t->addColumn('role')->type(Schema::DT_VARCHAR128)->nullable(true);
            $t->addColumn('avatar_url')->type(Schema::DT_VARCHAR256)->nullable(true);
            $t->addColumn('created_at')->type(Schema::DT_TIMESTAMP)->defaults(Schema::DF_CURRENT_TIMESTAMP);
            $t->addColumn('updated_at')->type(Schema::DT_TIMESTAMP)->defaults(Schema::DF_CURRENT_TIMESTAMP);
            $t->build();
            echo "Table '{$table}' created." . PHP_EOL;
        } catch (\Throwable $e) {
            echo "Error creating users table: " . $e->getMessage() . PHP_EOL;
        }
    },

    'down' => function () {
        try {
            $conf = User::resolveConfiguration();
            $schema = new Schema($conf['db']);
            $table = $conf['table'];
            $tables = $schema->getTables();

            if (in_array($table, $tables)) {
                $schema->dropTable($table);
                echo "Table '{$table}' dropped." . PHP_EOL;
            } else {
                echo "Table '{$table}' does not exist. Skipping drop." . PHP_EOL;
            }
        } catch (\Throwable $e) {
            echo "Error dropping users table: " . $e->getMessage() . PHP_EOL;
        }
    },
];
