<?php if (!defined('ABSPATH')) exit; ?>

<div class="wrap">
    <h1><?php echo esc_html(get_admin_page_title()); ?></h1>
    <div class="notice notice-info">
        <p><?php echo wp_kses(
                __('Configure your <a href="https://www.petfinder.com/developers/" target="_blank">PetFinder API</a> settings below.'),
                ['a' => ['href' => [], 'target' => []]]
            ); ?></p>
    </div>
    <div class="card">
        <form method="post" action="options.php">
            <?php
            settings_fields($this->plugin_name);
            do_settings_sections($this->plugin_name);
            submit_button();
            ?>
        </form>
    </div>

    <div class="card" style="margin-top: 20px;">
        <h3>Shortcode Usage</h3>
        <p>Use the following shortcode to display the PetFinder animals list:</p>
        <code>[petfinder_react]</code>

        <h4>Optional Attributes:</h4>
        <ul style="list-style-type: disc; margin-left: 20px;">
            <li><code>type</code> - Filter by animal type (e.g., "dog", "cat")</li>
            <li><code>breed</code> - Filter by breed</li>
            <li><code>size</code> - Filter by size</li>
            <li><code>gender</code> - Filter by gender</li>
            <li><code>age</code> - Filter by age</li>
        </ul>

        <p><strong>Example:</strong></p>
        <code>[petfinder_react type="dog" breed="german-shepherd"]</code>
    </div>
</div>