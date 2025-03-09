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
        
        // Register AJAX handlers
        add_action('wp_ajax_petfinder_react_fetch_data', array($this, 'handle_ajax_request'));
        add_action('wp_ajax_nopriv_petfinder_react_fetch_data', array($this, 'handle_ajax_request'));
        
        // Register REST API endpoints
        add_action('rest_api_init', array($this, 'register_rest_routes'));
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
                    header('Access-Control-Allow-Headers: Authorization, Content-Type, X-WP-Nonce, X-Requested-With');
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

    /**
     * Handle AJAX requests with nonce verification
     */
    public function handle_ajax_request() {
        // Verify the nonce
        if (!isset($_POST['nonce']) || !wp_verify_nonce($_POST['nonce'], 'petfinder_react_ajax_nonce')) {
            wp_send_json_error(array('message' => 'Security check failed'), 403);
            wp_die();
        }
        
        // Process the AJAX request based on the action parameter
        $action = isset($_POST['action_type']) ? sanitize_text_field($_POST['action_type']) : '';
        
        switch ($action) {
            case 'get_animals':
                // Process animals request
                $type = isset($_POST['type']) ? sanitize_text_field($_POST['type']) : '';
                $page = isset($_POST['page']) ? intval($_POST['page']) : 1;
                
                $result = $this->fetch_animals_from_api($type, $page);
                if (!$result) {
                    wp_send_json_error(array('message' => 'Failed to retrieve animals'), 500);
                    wp_die();
                }
                
                wp_send_json_success($result);
                break;
                
            case 'get_animal':
                // Process single animal request
                $id = isset($_POST['id']) ? absint($_POST['id']) : 0;
                if ($id <= 0) {
                    wp_send_json_error(array('message' => 'Invalid animal ID'), 400);
                    wp_die();
                }
                
                $result = $this->fetch_animal_from_api($id);
                if (!$result) {
                    wp_send_json_error(array('message' => 'Failed to retrieve animal'), 500);
                    wp_die();
                }
                
                wp_send_json_success($result);
                break;
                
            default:
                wp_send_json_error(array('message' => 'Invalid action'), 400);
                break;
        }
        
        wp_die();
    }
    
    /**
     * Fetch animals from Petfinder API and cache results
     */
    private function fetch_animals_from_api($type = '', $page = 1) {
        $options = get_option($this->plugin_name . '_settings');
        $api_key = $options['api_key'] ?? '';
        $api_secret = $options['api_secret'] ?? '';
        $shelter_id = $options['shelter_id'] ?? '';
        
        if (empty($api_key) || empty($api_secret)) {
            $this->log_error('Missing API credentials');
            return false;
        }
        
        // Check cache first
        $cache_key = 'animals_' . $type . '_' . $page;
        $cached_data = $this->get_cached_data($cache_key);
        if ($cached_data) {
            return $cached_data;
        }
        
        // Make API request if not in cache
        // This is a placeholder - you'd use wp_remote_get or similar to make the actual API request
        
        // For testing, return mock data with the correct structure
        $mock_data = array(
            'animals' => array(
                array(
                    'id' => 1,
                    'type' => 'Dog',
                    'name' => 'Buddy',
                    'breeds' => array(
                        'primary' => 'Mixed',
                        'secondary' => null,
                        'mixed' => true
                    ),
                    'age' => 'Young',
                    'gender' => 'Male',
                    'size' => 'Medium',
                    'description' => 'A friendly dog looking for a home.',
                    'photos' => array(array('small' => 'https://via.placeholder.com/150', 'medium' => 'https://via.placeholder.com/300', 'large' => 'https://via.placeholder.com/600')),
                    'status' => 'adoptable',
                    'published_at' => '2023-06-01T12:00:00Z',
                    'contact' => array(
                        'email' => 'contact@example.com',
                        'phone' => '555-555-5555',
                        'address' => array(
                            'address1' => '123 Main St',
                            'city' => 'Anytown',
                            'state' => 'CA',
                            'postcode' => '12345'
                        )
                    )
                ),
                array(
                    'id' => 2,
                    'type' => 'Cat',
                    'name' => 'Whiskers',
                    'breeds' => array(
                        'primary' => 'Tabby',
                        'secondary' => null,
                        'mixed' => false
                    ),
                    'age' => 'Adult',
                    'gender' => 'Female',
                    'size' => 'Small',
                    'description' => 'A sweet cat looking for a quiet home.',
                    'photos' => array(array('small' => 'https://via.placeholder.com/150', 'medium' => 'https://via.placeholder.com/300', 'large' => 'https://via.placeholder.com/600')),
                    'status' => 'adoptable',
                    'published_at' => '2023-06-02T12:00:00Z',
                    'contact' => array(
                        'email' => 'contact@example.com',
                        'phone' => '555-555-5555',
                        'address' => array(
                            'address1' => '123 Main St',
                            'city' => 'Anytown',
                            'state' => 'CA',
                            'postcode' => '12345'
                        )
                    )
                )
            ),
            'pagination' => array(
                'count_per_page' => 20,
                'total_count' => 100,
                'current_page' => $page,
                'total_pages' => 5
            )
        );
        
        // Cache the result
        $this->set_cached_data($cache_key, $mock_data);
        
        return $mock_data;
    }
    
    /**
     * Fetch single animal from Petfinder API and cache results
     */
    private function fetch_animal_from_api($id) {
        // Similar to fetch_animals_from_api but for a single animal
        $cache_key = 'animal_' . $id;
        $cached_data = $this->get_cached_data($cache_key);
        if ($cached_data) {
            return $cached_data;
        }
        
        // Mock data for testing with complete structure
        $animal = array(
            'id' => $id,
            'type' => 'Dog',
            'name' => 'Buddy',
            'breeds' => array(
                'primary' => 'Mixed',
                'secondary' => null,
                'mixed' => true
            ),
            'age' => 'Young',
            'gender' => 'Male',
            'size' => 'Medium',
            'description' => 'A friendly dog looking for a home.',
            'photos' => array(array('small' => 'https://via.placeholder.com/150', 'medium' => 'https://via.placeholder.com/300', 'large' => 'https://via.placeholder.com/600')),
            'status' => 'adoptable',
            'published_at' => '2023-06-01T12:00:00Z',
            'contact' => array(
                'email' => 'contact@example.com',
                'phone' => '555-555-5555',
                'address' => array(
                    'address1' => '123 Main St',
                    'city' => 'Anytown',
                    'state' => 'CA',
                    'postcode' => '12345'
                )
            )
        );
        
        $this->set_cached_data($cache_key, $animal);
        return $animal;
    }

    /**
     * Register custom REST API endpoints
     */
    public function register_rest_routes() {
        register_rest_route('petfinder-react/v1', '/animals', array(
            'methods' => 'GET',
            'callback' => array($this, 'get_animals_endpoint'),
            'permission_callback' => function() {
                return true; // Public endpoint
            },
            'args' => array(
                'type' => array(
                    'sanitize_callback' => 'sanitize_text_field'
                )
            )
        ));
        
        register_rest_route('petfinder-react/v1', '/animals/(?P<id>\d+)', array(
            'methods' => 'GET',
            'callback' => array($this, 'get_animal_endpoint'),
            'permission_callback' => function() {
                return true; // Public endpoint
            },
            'args' => array(
                'id' => array(
                    'validate_callback' => function($param) {
                        return is_numeric($param);
                    }
                )
            )
        ));
    }
    
    /**
     * REST API endpoint for fetching animals
     */
    public function get_animals_endpoint($request) {
        // Verify the REST nonce
        if (!current_user_can('edit_posts') && !wp_verify_nonce($request->get_header('X-WP-Nonce'), 'wp_rest')) {
            return new WP_Error('rest_forbidden', 'Unauthorized access', array('status' => 403));
        }
        
        $type = $request->get_param('type');
        // Process the request...
        
        return rest_ensure_response(array('success' => true));
    }
    
    /**
     * REST API endpoint for fetching a single animal
     */
    public function get_animal_endpoint($request) {
        // Verify the REST nonce
        if (!current_user_can('edit_posts') && !wp_verify_nonce($request->get_header('X-WP-Nonce'), 'wp_rest')) {
            return new WP_Error('rest_forbidden', 'Unauthorized access', array('status' => 403));
        }
        
        $id = $request->get_param('id');
        // Process the request...
        
        return rest_ensure_response(array('success' => true));
    }

}
