<?php

class PetFinder_React
{
    private static $instance = null;
    private $version = '1.0.0';
    private $plugin_name = 'petfinder-react';

    public static function get_instance()
    {
        if (null === self::$instance) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    public static function activate()
    {
        // Set default options
        $default_options = array(
            'posts_per_page' => 20,
            'cache_duration' => 300, // 5 minutes
        );

        add_option('petfinder-react_settings', $default_options);

        // Create cache directory
        $upload_dir = wp_upload_dir();
        $cache_dir = $upload_dir['basedir'] . '/petfinder-cache';
        if (!file_exists($cache_dir)) {
            wp_mkdir_p($cache_dir);
        }

        // Flush rewrite rules
        flush_rewrite_rules();
    }

    public static function deactivate()
    {
        // Clear any scheduled hooks
        wp_clear_scheduled_hooks('petfinder_react_cache_cleanup');

        // Flush rewrite rules
        flush_rewrite_rules();
    }

    public static function uninstall()
    {
        // Remove plugin options
        delete_option('petfinder_react_settings');

        // Clear cache directory
        $upload_dir = wp_upload_dir();
        $cache_dir = $upload_dir['basedir'] . '/petfinder-cache';
        if (file_exists($cache_dir)) {
            array_map('unlink', glob("$cache_dir/*.*"));
            rmdir($cache_dir);
        }
    }

    private function __construct()
    {
        $this->load_dependencies();
        $this->define_admin_hooks();
        $this->define_public_hooks();
        $this->setup_cors();

    }

    private function load_dependencies()
    {
        require_once plugin_dir_path(dirname(__FILE__)) . 'admin/class-petfinder-react-admin.php';
        require_once plugin_dir_path(dirname(__FILE__)) . 'public/class-petfinder-react-public.php';
    }

    private function define_admin_hooks()
    {
        $plugin_admin = new PetFinder_React_Admin($this->plugin_name, $this->version);
        add_action('admin_menu', array($plugin_admin, 'add_plugin_admin_menu'));
        add_action('admin_init', array($plugin_admin, 'register_settings'));
    }

    private function define_public_hooks()
    {
        $plugin_public = new PetFinder_React_Public($this->plugin_name, $this->version);
        add_action('wp_enqueue_scripts', array($plugin_public, 'enqueue_scripts'));
        add_shortcode('petfinder_react', array($plugin_public, 'render_shortcode'));
    }

    private function check_requirements()
    {
        $errors = array();

        // Check PHP version
        if (version_compare(PHP_VERSION, '7.4', '<')) {
            $errors[] = 'PetFinder React requires PHP 7.4 or higher.';
        }

        // Check WordPress version
        if (version_compare($GLOBALS['wp_version'], '5.0', '<')) {
            $errors[] = 'PetFinder React requires WordPress 5.0 or higher.';
        }

        // Check for required PHP extensions
        $required_extensions = array('curl', 'json');
        foreach ($required_extensions as $ext) {
            if (!extension_loaded($ext)) {
                $errors[] = sprintf('PetFinder React requires the %s PHP extension.', $ext);
            }
        }

        // Check write permissions for cache
        $upload_dir = wp_upload_dir();
        $cache_dir = $upload_dir['basedir'] . '/petfinder-cache';
        if (!is_writable($cache_dir)) {
            $errors[] = 'PetFinder React requires write permissions for the cache directory.';
        }

        return $errors;
    }

    public function display_requirements_errors()
    {
        $errors = $this->check_requirements();
        if (!empty($errors)) {
            deactivate_plugins(plugin_basename(__FILE__));
            wp_die(implode('<br>', $errors));
        }
    }

    // Add rate limiting
    private function check_rate_limit()
    {
        $options = get_option($this->plugin_name . '_settings');
        $last_request = get_transient('petfinder_last_request');
        $rate_limit = isset($options['rate_limit']) ? $options['rate_limit'] : 0.5; // requests per second

        if ($last_request && time() - $last_request < (1 / $rate_limit)) {
            return false;
        }

        set_transient('petfinder_last_request', time(), 60);
        return true;
    }

    // Add error logging
    private function log_error($message, $data = array())
    {
        if (WP_DEBUG) {
            error_log(sprintf(
                '[PetFinder React] %s | Data: %s',
                $message,
                json_encode($data)
            ));
        }
    }

    // Add cache handling
    private function get_cached_data($key)
    {
        return get_transient('petfinder_' . $key);
    }

    private function set_cached_data($key, $data, $expiration = 300)
    {
        set_transient('petfinder_' . $key, $data, $expiration);
    }

    private function setup_cors() {
        // Add CORS headers for REST API requests
        add_action('rest_api_init', function() {
            remove_filter('rest_pre_serve_request', 'rest_send_cors_headers');
            
            add_filter('rest_pre_serve_request', function($value) {
                $origin = get_http_origin();
                
                // Only allow specific origins
                $allowed_origins = $this->get_allowed_origins();
                
                if ($origin && in_array($origin, $allowed_origins)) {
                    header('Access-Control-Allow-Origin: ' . esc_url_raw($origin));
                    header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
                    header('Access-Control-Allow-Credentials: true');
                    header('Access-Control-Allow-Headers: Authorization, Content-Type, X-WP-Nonce');
                    header('Vary: Origin');
                }
                
                return $value;
            });
        });
    }

    private function get_allowed_origins() {
        $allowed_origins = array(
            home_url(),
            site_url(),
            'https://api.petfinder.com'
        );
        
        // Allow additional origins in development
        if (defined('WP_DEBUG') && WP_DEBUG) {
            $allowed_origins[] = 'http://localhost:5173';
            $allowed_origins[] = 'http://localhost:3000';
        }
        
        return apply_filters('petfinder_react_allowed_origins', $allowed_origins);
    }

}
