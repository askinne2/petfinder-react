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


# Create temporary directory
mkdir dist-plugin

# Copy only necessary files
rsync -av --exclude-from='.distignore' . dist-plugin/

# Create zip file
cd dist-plugin && zip -r ../petfinder-react.zip . && cd ..

# Clean up
rm -rf dist-plugin

echo "Plugin zip created successfully!"

# Success message
echo "Build completed successfully!"