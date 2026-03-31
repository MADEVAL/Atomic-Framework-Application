<?php
if (!defined('ATOMIC_START')) exit;

get_head();
?>
<header class="atomic-header">
    <div class="atomic-container atomic-flex atomic-justify-between atomic-items-center" style="padding: 1rem 0;">
        <a href="/" class="atomic-logo-link" style="display:flex;align-items:center;gap:0.5rem;text-decoration:none;color:var(--atomic-text-primary, #1a1a2e);">
            <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" style="width:32px;height:32px;">
                <circle cx="50" cy="50" r="12" fill="#4f9cf7"/>
                <ellipse cx="50" cy="50" rx="45" ry="18" fill="none" stroke="#4f9cf7" stroke-width="3" transform="rotate(0 50 50)" opacity="0.7"/>
                <ellipse cx="50" cy="50" rx="45" ry="18" fill="none" stroke="#4f9cf7" stroke-width="3" transform="rotate(60 50 50)" opacity="0.5"/>
                <ellipse cx="50" cy="50" rx="45" ry="18" fill="none" stroke="#4f9cf7" stroke-width="3" transform="rotate(120 50 50)" opacity="0.3"/>
            </svg>
            <span style="font-weight:700;font-size:1.1rem;">Atomic</span>
        </a>
        <nav style="display:flex;gap:1rem;align-items:center;">
            <?php if (\Engine\Atomic\Core\Guard::is_authenticated()): ?>
                <a href="/dashboard" style="color:var(--atomic-text-secondary, #555);text-decoration:none;">Dashboard</a>
                <a href="/logout" style="color:var(--atomic-text-secondary, #555);text-decoration:none;">Logout</a>
            <?php else: ?>
                <a href="/login" style="color:var(--atomic-text-secondary, #555);text-decoration:none;">Login</a>
                <a href="/register" style="color:var(--atomic-text-secondary, #555);text-decoration:none;">Register</a>
            <?php endif; ?>
        </nav>
    </div>
</header>
