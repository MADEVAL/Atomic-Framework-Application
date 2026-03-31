<?php
if (!defined('ATOMIC_START')) exit;
?>
<footer class="atomic-footer" style="text-align:center;padding:2rem 0;margin-top:3rem;border-top:1px solid var(--atomic-border, #e0e0e0);">
    <div class="atomic-container">
        <div style="font-weight:600;color:var(--atomic-text-primary, #1a1a2e);">Atomic Framework</div>
        <div style="font-size:0.85rem;color:var(--atomic-text-secondary, #888);margin-top:0.25rem;">Power in minimalism</div>
        <div style="font-size:0.8rem;color:var(--atomic-text-secondary, #aaa);margin-top:1rem;">
            &copy; <?php echo date('Y'); ?> Atomic Framework
        </div>
    </div>
</footer>

<?php print_scripts('footer'); ?>
</body>
</html>
