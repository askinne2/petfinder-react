<?php

class PetFinder_React_Admin {
    private $plugin_name;
    private $version;

    public function __construct($plugin_name, $version) {
        $this->plugin_name = $plugin_name;
        $this->version = $version;
        
        // Add admin notice if settings are not configured
        add_action('admin_notices', array($this, 'check_settings'));
    }

    public function check_settings() {
        $options = get_option($this->plugin_name . '_settings');
        if (
            empty($options['api_key']) || 
            empty($options['api_secret']) || 
            empty($options['shelter_id'])
        ) {
            echo '<div class="notice notice-warning is-dismissible">';
            echo '<p>Please <a href="' . admin_url('admin.php?page=' . $this->plugin_name) . '">complete the settings fields</a> for PetFinder integration.</p>';
            echo '</div>';
        }
    }

    public function add_plugin_admin_menu() {
        add_menu_page(
            'PetFinder React', 
            'PetFinder React', 
            'manage_options', 
            $this->plugin_name, 
            array($this, 'display_plugin_admin_page'),
            'dashicons-pets',
            20
        );
    }

    public function register_settings() {
        register_setting(
            $this->plugin_name,
            $this->plugin_name . '_settings',
            array($this, 'validate_settings')
        );

        // API Settings Section
        add_settings_section(
            'petfinder_react_api',
            'API Settings',
            array($this, 'render_api_section'),
            $this->plugin_name
        );

        add_settings_field(
            'api_key',
            'API Key',
            array($this, 'render_api_key_field'),
            $this->plugin_name,
            'petfinder_react_api'
        );

        add_settings_field(
            'api_secret',
            'API Secret',
            array($this, 'render_api_secret_field'),
            $this->plugin_name,
            'petfinder_react_api'
        );

        // Display Settings Section
        add_settings_section(
            'petfinder_react_display',
            'Display Settings',
            array($this, 'render_display_section'),
            $this->plugin_name
        );

        add_settings_field(
            'shelter_id',
            'Shelter ID',
            array($this, 'render_shelter_id_field'),
            $this->plugin_name,
            'petfinder_react_display'
        );

        add_settings_field(
            'posts_per_page',
            'Animals Per Page',
            array($this, 'render_posts_per_page_field'),
            $this->plugin_name,
            'petfinder_react_display'
        );
    }

    public function display_plugin_admin_page() {
        if (!current_user_can('manage_options')) {
            wp_die(esc_html__('You do not have sufficient permissions to access this page.'));
        }
        include_once plugin_dir_path(__FILE__) . 'partials/petfinder-react-admin-display.php';
    }

    public function render_api_section() {
        echo '<p>Enter your PetFinder API credentials below:</p>';
    }

    public function render_display_section() {
        echo '<p>Configure how animals are displayed on your site:</p>';
    }

    public function render_api_key_field() {
        $options = get_option($this->plugin_name . '_settings');
        printf(
            '<input type="text" id="api_key" name="%s" value="%s" class="regular-text">',
            esc_attr($this->plugin_name . '_settings[api_key]'),
            esc_attr($options['api_key'] ?? '')
        );
    }

    public function render_api_secret_field() {
        $options = get_option($this->plugin_name . '_settings');
        echo '<input type="password" id="api_secret" name="' . $this->plugin_name . '_settings[api_secret]" 
              value="' . esc_attr($options['api_secret'] ?? '') . '" class="regular-text">';
    }

    public function render_shelter_id_field() {
        $options = get_option($this->plugin_name . '_settings');
        echo '<input type="text" id="shelter_id" name="' . $this->plugin_name . '_settings[shelter_id]" 
              value="' . esc_attr($options['shelter_id'] ?? '') . '" class="regular-text">';
        echo '<p class="description">Your PetFinder organization ID (e.g., AL459)</p>';
    }

    public function render_posts_per_page_field() {
        $options = get_option($this->plugin_name . '_settings');
        $value = $options['posts_per_page'] ?? 20;
        echo '<input type="number" id="posts_per_page" name="' . $this->plugin_name . '_settings[posts_per_page]" 
              value="' . esc_attr($value) . '" class="small-text" min="1" max="100">';
        echo '<p class="description">Number of animals to display per page (max: 100)</p>';
    }

    public function validate_settings($input) {
        $validated = array();
        
        // API Key: alphanumeric only
        $validated['api_key'] = preg_replace('/[^a-zA-Z0-9]/', '', sanitize_text_field($input['api_key']));
        
        // API Secret: alphanumeric only
        $validated['api_secret'] = preg_replace('/[^a-zA-Z0-9]/', '', sanitize_text_field($input['api_secret']));
        
        // Shelter ID: alphanumeric and dashes only
        $validated['shelter_id'] = preg_replace('/[^a-zA-Z0-9-]/', '', sanitize_text_field($input['shelter_id']));
        
        // Posts per page: numeric only, between 1 and 100
        $posts_per_page = absint($input['posts_per_page']);
        $validated['posts_per_page'] = min(100, max(1, $posts_per_page));

        // Add error messages for invalid inputs
        if (empty($validated['api_key'])) {
            add_settings_error(
                $this->plugin_name . '_settings',
                'invalid_api_key',
                'API Key must contain only letters and numbers.'
            );
        }

        return $validated;
    }
}