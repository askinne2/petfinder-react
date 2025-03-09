#!/bin/bash

# Clean previous build artifacts
echo "Cleaning up previous builds..."
rm -rf dist dist-plugin petfinder-react.zip

# Build for WordPress
echo "Building WordPress plugin..."
npm run build:wp

# Copy necessary files
mkdir -p dist/css
cp src/index.css dist/css/

# Create version file with timestamp
VERSION=$(date '+%Y%m%d%H%M%S')
echo $VERSION > dist/version.txt
echo "Creating version: $VERSION"

# Create temporary directory
mkdir dist-plugin

# Copy only necessary files
echo "Copying plugin files..."
rsync -av --exclude-from='.distignore' . dist-plugin/

# Create zip file
echo "Creating plugin archive..."
cd dist-plugin && zip -r ../petfinder-react.zip . && cd ..

# Clean up
rm -rf dist-plugin

echo "✅ Plugin zip created successfully!"
echo "✅ Build completed successfully!"