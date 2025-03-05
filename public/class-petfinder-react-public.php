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
                'shelterId' => $options['shelter_id'] ?? '',
                'postsPerPage' => $options['posts_per_page'] ?? 20,
                'restUrl' => rest_url('wp/v2/'),
                'nonce' => wp_create_nonce('wp_rest'),
                'isWordPress' => true
            )
        );
    }

    public function sanitize_shortcode_atts($atts) {
        $clean_atts = array();
        
        // Allowed animal types
        $allowed_types = array('dog', 'cat', 'rabbit', 'small-furry', 'horse', 'bird', 'scales-fins-other', 'barnyard');
        
        // Allowed sizes
        $allowed_sizes = array('small', 'medium', 'large', 'xlarge');
        
        // Allowed genders
        $allowed_genders = array('male', 'female', 'unknown');
        
        // Sanitize type
        if (!empty($atts['type'])) {
            $type = strtolower(sanitize_text_field($atts['type']));
            $clean_atts['type'] = in_array($type, $allowed_types) ? $type : '';
        }
        
        // Sanitize breed (allow only letters, numbers, spaces, and hyphens)
        if (!empty($atts['breed'])) {
            $clean_atts['breed'] = preg_replace('/[^a-zA-Z0-9\s-]/', '', sanitize_text_field($atts['breed']));
        }
        
        // Sanitize size
        if (!empty($atts['size'])) {
            $size = strtolower(sanitize_text_field($atts['size']));
            $clean_atts['size'] = in_array($size, $allowed_sizes) ? $size : '';
        }
        
        // Sanitize gender
        if (!empty($atts['gender'])) {
            $gender = strtolower(sanitize_text_field($atts['gender']));
            $clean_atts['gender'] = in_array($gender, $allowed_genders) ? $gender : '';
        }
        
        return $clean_atts;
    }

    public function render_shortcode($atts = []) {
        $clean_atts = $this->sanitize_shortcode_atts($atts);
        
        return sprintf(
            '<div id="petfinder-react-root" data-attributes="%s"></div>',
            esc_attr(wp_json_encode($clean_atts))
        );
    }
}