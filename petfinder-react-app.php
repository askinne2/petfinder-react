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
