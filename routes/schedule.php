<?php
declare(strict_types=1);
if (!defined('ATOMIC_START')) exit;

use Engine\Atomic\Scheduler\Scheduler;
use Engine\Atomic\Scheduler\Jobs\LogCleanupJob;

$scheduler = Scheduler::instance();

$scheduler->job(LogCleanupJob::class)
    ->daily_at('00:05')
    ->description('Purge dated log files older than configured max_days per channel');
