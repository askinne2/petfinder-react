<?php

class PetFinder_React_Public {
    private $plugin_name;
    private $version;

    public function __construct($plugin_name, $version) {
        $this->plugin_name = $plugin_name;
        $this->version = $version;
    }

    public function enqueue_scripts() {
        $options = get_option($this->plugin_name . '_settings');
        
        // Enqueue styles
        wp_enqueue_style(
            $this->plugin_name,
            plugin_dir_url(dirname(__FILE__)) . 'dist/css/styles.css',
            [],
            $this->version
        );
    
        // Enqueue scripts
        wp_enqueue_script(
            $this->plugin_name,
            plugin_dir_url(dirname(__FILE__)) . 'dist/assets/index.js',
            [],
            $this->version,
            true
        );
    
        wp_localize_script(
            $this->plugin_name,
            'petfinderReactVars',
            array(
                'apiKey' => $options['api_key'] ?? '',
                'apiSecret' => $options['api_secret'] ?? '',
                'restUrl' => rest_url('wp/v2/'),
                'nonce' => wp_create_nonce('wp_rest'),
                'isWordPress' => true
            )
        );
    }

    public function render_shortcode($atts = [], $content = null) {
        // Shortcode attributes with defaults
        $attributes = shortcode_atts(
            array(
                'shelter_id' => '',
                'type' => '',
                'breed' => '',
                'size' => '',
                'gender' => '',
                'age' => ''
            ),
            $atts
        );

        // Create a container for React to mount
        $output = sprintf(
            '<div id="petfinder-react-root" data-attributes="%s"></div>',
            esc_attr(json_encode($attributes))
        );

        return $output;
    }
}