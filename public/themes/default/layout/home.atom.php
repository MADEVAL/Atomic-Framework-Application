<?php
if (!defined('ATOMIC_START')) exit;

get_header();
?>
<section class="atomic-hero" style="text-align:center;padding:5rem 1rem;">
    <div class="atomic-container">
        <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" style="width:80px;height:80px;margin-bottom:1.5rem;">
            <defs><radialGradient id="g2" cx="50%" cy="50%" r="50%"><stop offset="0%" style="stop-color:#7eb8ff"/><stop offset="100%" style="stop-color:#4f9cf7"/></radialGradient></defs>
            <circle cx="50" cy="50" r="12" fill="#4f9cf7"/>
            <ellipse cx="50" cy="50" rx="45" ry="18" fill="none" stroke="url(#g2)" stroke-width="3" transform="rotate(0 50 50)" opacity="0.7"/>
            <ellipse cx="50" cy="50" rx="45" ry="18" fill="none" stroke="url(#g2)" stroke-width="3" transform="rotate(60 50 50)" opacity="0.5"/>
            <ellipse cx="50" cy="50" rx="45" ry="18" fill="none" stroke="url(#g2)" stroke-width="3" transform="rotate(120 50 50)" opacity="0.3"/>
        </svg>
        <h1 class="atomic-title">Atomic Framework</h1>
        <p class="atomic-subtitle" style="color:var(--atomic-text-secondary, #666);max-width:600px;margin:1rem auto;">
            Fast &amp; minimal PHP framework built on Fat-Free. Authentication, middleware, plugins, i18n &mdash; all included.
        </p>
        <div style="margin-top:0.75rem;">
            <span style="display:inline-block;padding:0.25rem 0.75rem;border-radius:999px;font-size:0.8rem;background:var(--atomic-bg-secondary, #f0f4ff);color:var(--atomic-primary, #4f9cf7);">
                v<?php echo ATOMIC_VERSION; ?>
            </span>
        </div>
        <div style="margin-top:2rem;display:flex;gap:1rem;justify-content:center;flex-wrap:wrap;">
            <a href="/register" class="atomic-btn atomic-btn-primary" style="padding:0.75rem 2rem;background:#4f9cf7;color:#fff;border-radius:8px;text-decoration:none;font-weight:600;">Get Started</a>
            <a href="/login" style="padding:0.75rem 2rem;border:1px solid var(--atomic-border, #ddd);border-radius:8px;text-decoration:none;color:var(--atomic-text-primary, #333);font-weight:500;">Login</a>
        </div>
    </div>
</section>

<section style="padding:3rem 1rem;">
    <div class="atomic-container" style="max-width:900px;margin:0 auto;">
        <h2 style="text-align:center;margin-bottom:2rem;">Built for Modern Development</h2>
        <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(250px, 1fr));gap:1.5rem;">
            <div style="padding:1.5rem;border:1px solid var(--atomic-border, #e0e0e0);border-radius:12px;">
                <div style="font-size:1.5rem;margin-bottom:0.5rem;">&#9889;</div>
                <h3 style="margin-bottom:0.5rem;">Lightning Fast</h3>
                <p style="color:var(--atomic-text-secondary, #666);font-size:0.9rem;">Built on Fat-Free core with advanced caching: Memcached, Redis, file-based.</p>
            </div>
            <div style="padding:1.5rem;border:1px solid var(--atomic-border, #e0e0e0);border-radius:12px;">
                <div style="font-size:1.5rem;margin-bottom:0.5rem;">&#128274;</div>
                <h3 style="margin-bottom:0.5rem;">Secure Auth</h3>
                <p style="color:var(--atomic-text-secondary, #666);font-size:0.9rem;">Registration, login, roles, guards, and middleware out of the box.</p>
            </div>
            <div style="padding:1.5rem;border:1px solid var(--atomic-border, #e0e0e0);border-radius:12px;">
                <div style="font-size:1.5rem;margin-bottom:0.5rem;">&#127760;</div>
                <h3 style="margin-bottom:0.5rem;">i18n Ready</h3>
                <p style="color:var(--atomic-text-secondary, #666);font-size:0.9rem;">Multi-language support with URL prefixes, locale detection, and translation files.</p>
            </div>
        </div>
    </div>
</section>
<?php
get_footer();
?>
