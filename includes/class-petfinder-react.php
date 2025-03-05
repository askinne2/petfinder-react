<?php

class PetFinder_React {
    private static $instance = null;
    private $version = '1.0.0';
    private $plugin_name = 'petfinder-react';

    public static function get_instance() {
        if (null === self::$instance) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    private function __construct() {
        $this->load_dependencies();
        $this->define_admin_hooks();
        $this->define_public_hooks();
    }

    private function load_dependencies() {
        require_once plugin_dir_path(dirname(__FILE__)) . 'admin/class-petfinder-react-admin.php';
        require_once plugin_dir_path(dirname(__FILE__)) . 'public/class-petfinder-react-public.php';
    }

    private function define_admin_hooks() {
        $plugin_admin = new PetFinder_React_Admin($this->plugin_name, $this->version);
        add_action('admin_menu', array($plugin_admin, 'add_plugin_admin_menu'));
        add_action('admin_init', array($plugin_admin, 'register_settings'));
    }

    private function define_public_hooks() {
        $plugin_public = new PetFinder_React_Public($this->plugin_name, $this->version);
        add_action('wp_enqueue_scripts', array($plugin_public, 'enqueue_scripts'));
        add_shortcode('petfinder_react', array($plugin_public, 'render_shortcode'));
    }
}