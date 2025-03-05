<?php
/*
Plugin Name: PetFinder React Integration
Plugin URI: https://github.com/askinne2/petfinder-react
Description: Integration with PetFinder API for animal shelters
Version: 1.0.0
Author: Andrew Skinner
Author URI: https://21adsmedia.com
License: MIT
*/

// Prevent direct access
if (!defined('ABSPATH')) exit;

// Require the main plugin class
require plugin_dir_path(__FILE__) . 'includes/class-petfinder-react.php';

// Initialize the plugin
function run_petfinder_react() {
    $plugin = PetFinder_React::get_instance();
}

run_petfinder_react();

function petfinder_react_enqueue_scripts() {
    wp_enqueue_script(
        'petfinder-react',
        plugin_dir_url(__FILE__) . 'dist/assets/index.js',
        [],
        '1.0.0',
        true
    );

    wp_localize_script('petfinder-react', 'petfinderReactVars', [
        'apiUrl' => rest_url('petfinder-react/v1'),
        'nonce' => wp_create_nonce('wp_rest'),
        'isWordPress' => true
    ]);
}
add_action('wp_enqueue_scripts', 'petfinder_react_enqueue_scripts');

// Register shortcode
function petfinder_react_shortcode() {
    return '<div id="petfinder-react-root"></div>';
}
add_shortcode('petfinder_react', 'petfinder_react_shortcode');