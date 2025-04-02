#!/bin/bash

ASSETS_URL="https://github.com/aicell-lab/micro-farm-js/releases/download/0.1.1/public.zip"

curl -L -o public.zip "$ASSETS_URL"
unzip -o public.zip 
rm -f public.zip
ls -la public/
echo "Setup complete! Asset files have been downloaded and organized." 

