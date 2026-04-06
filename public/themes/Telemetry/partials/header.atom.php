<?php
if (!defined( 'ATOMIC_START' ) ) exit;
?>
<!-- Header -->
<header class="w3-container atomic-header">
    <div class="atomic-header-flex">
        <div class="atomic-header-left">
            <h1 class="atomic-header-title">
                <img src="/favicon.ico" alt="Atomic" class="atomic-header-favicon">
                <?php echo htmlspecialchars($title); ?>
            </h1>
        </div>
        <div class="atomic-header-right">
            <div id="queue-header-counters" class="atomic-header-counters">
                <?php if ($status_counts['total'] > 0): ?>
                    <?php if ($status_counts['failed'] > 0): ?>
                        <span class="atomic-chip atomic-chip-failed">
                            <i class="fa fa-times"></i><span><?php echo htmlspecialchars($status_counts['failed']); ?> failed</span>
                        </span>
                    <?php endif; ?>
                    <?php if ($status_counts['queued'] > 0): ?>
                        <span class="atomic-chip atomic-chip-queued">
                            <i class="fa fa-clock-o"></i><span><?php echo htmlspecialchars($status_counts['queued']); ?> queued</span>
                        </span>
                    <?php endif; ?>
                    <?php if ($status_counts['running'] > 0): ?>
                        <span class="atomic-chip atomic-chip-running">
                            <i class="fa fa-cogs"></i><span><?php echo htmlspecialchars($status_counts['running']); ?> running</span>
                        </span>
                    <?php endif; ?>
                    <?php if ($status_counts['completed'] > 0): ?>
                        <span class="atomic-chip atomic-chip-success">
                            <i class="fa fa-check"></i><span><?php echo htmlspecialchars($status_counts['completed']); ?> completed</span>
                        </span>
                    <?php endif; ?>
                    <span class="atomic-total">Total: <?php echo htmlspecialchars($status_counts['total']); ?></span>
                <?php else: ?>
                    <span class="atomic-chip atomic-chip-empty">
                        <i class="fa fa-check"></i><span>Queue empty</span>
                    </span>
                <?php endif; ?>
            </div>
            <div id="queue-header-actions" class="atomic-header-actions">
                <button onclick="toggleFilter()" class="atomic-btn">
                    <i class="fa fa-filter"></i><span>Filters</span>
                </button>
                <a href="/telemetry" class="atomic-btn ghost">
                    <i class="fa fa-refresh"></i><span>Refresh</span>
                </a>
            </div>
        </div>
    </div>
</header>

<!-- Navigation Tabs -->
<nav class="w3-container atomic-nav">
    <div class="w3-padding-small" style="display:flex; gap:12px; flex-wrap:wrap;">
        <a href="#" class="w3-button atomic-nav-tab atomic-active" data-tab="dashboard"><i class="fa fa-dashboard"></i> Dashboard</a>
        <a href="#" class="w3-button atomic-nav-tab" data-tab="queues"><i class="fa fa-tasks"></i> Queues</a>
        <a href="#" class="w3-button atomic-nav-tab" data-tab="hive"><i class="fa fa-database"></i> Hive</a>
        <a href="#" class="w3-button atomic-nav-tab" data-tab="logs"><i class="fa fa-file-text-o"></i> Logs</a>
    </div>
</nav>
