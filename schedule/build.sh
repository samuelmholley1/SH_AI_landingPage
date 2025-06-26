#!/bin/bash

# Build script for schedule page
echo "Building schedule page..."

# Create public directory
mkdir -p public

# Copy index.html to public
cp index.html public/

# Copy shared assets to public
cp -r ../shared/assets public/

echo "Schedule page built successfully!"
echo "Output directory: public/"
