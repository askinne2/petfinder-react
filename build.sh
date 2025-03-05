#!/bin/bash

# Clean dist directory
rm -rf dist

# Build for WordPress
npm run build:wp

# Copy necessary files
mkdir -p dist/css
cp src/index.css dist/css/

# Create version file
echo "$(date '+%Y%m%d%H%M%S')" > dist/version.txt

# Success message
echo "Build completed successfully!"