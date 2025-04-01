#!/bin/bash

# Create public directory if it doesn't exist
mkdir -p public

# Define URLs
ASSETS_URL="https://github.com/aicell-lab/micro-farm-js/releases/download/0.1.0/assets.zip"
PACKAGES_URL=""

echo "Downloading asset files..."
# Download assets.zip
curl -L -o assets.zip "$ASSETS_URL"

# Download packages.zip
curl -L -o packages.zip "$PACKAGES_URL"

echo "Checking packages.zip content..."
unzip -l packages.zip

echo "Setting up files..."
# Move assets.zip to public folder
mv assets.zip public/

# Unzip packages.zip directly to public folder
echo "Extracting packages.zip..."
unzip -o packages.zip -d public/

# Clean up temporary files
rm -f packages.zip

echo "Listing contents of public directory:"
ls -la public/

echo "Setup complete! Asset files have been downloaded and organized." 