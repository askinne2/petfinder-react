<?php

class PetFinder_React_Admin {
    private $plugin_name;
    private $version;

    public function __construct($plugin_name, $version) {
        $this->plugin_name = $plugin_name;
        $this->version = $version;
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

        add_settings_section(
            'petfinder_react_general',
            'API Settings',
            array($this, 'render_settings_section'),
            $this->plugin_name
        );

        add_settings_field(
            'api_key',
            'API Key',
            array($this, 'render_api_key_field'),
            $this->plugin_name,
            'petfinder_react_general'
        );

        add_settings_field(
            'api_secret',
            'API Secret',
            array($this, 'render_api_secret_field'),
            $this->plugin_name,
            'petfinder_react_general'
        );
    }

    public function display_plugin_admin_page() {
        include_once plugin_dir_path(__FILE__) . 'partials/petfinder-react-admin-display.php';
    }

    public function render_settings_section() {
        echo '<p>Enter your PetFinder API credentials below:</p>';
    }

    public function render_api_key_field() {
        $options = get_option($this->plugin_name . '_settings');
        echo '<input type="text" id="api_key" name="' . $this->plugin_name . '_settings[api_key]" 
              value="' . esc_attr($options['api_key'] ?? '') . '" class="regular-text">';
    }

    public function render_api_secret_field() {
        $options = get_option($this->plugin_name . '_settings');
        echo '<input type="password" id="api_secret" name="' . $this->plugin_name . '_settings[api_secret]" 
              value="' . esc_attr($options['api_secret'] ?? '') . '" class="regular-text">';
    }

    public function validate_settings($input) {
        $validated = array();
        $validated['api_key'] = sanitize_text_field($input['api_key']);
        $validated['api_secret'] = sanitize_text_field($input['api_secret']);
        return $validated;
    }
}