#!/bin/sh
set -e

# Define the paths for the key files
PRIVATE_KEY_PATH="/app/private.key"
PUBLIC_KEY_PATH="/app/public.key"
GENERATOR_SCRIPT_PATH="/app/generateKeyPairSync.js"

# Check if the private key file does not exist
if [ ! -f "$PRIVATE_KEY_PATH" ]; then
  echo "Key pair not found. Generating new keys..."
  
  # Run the Node.js script to generate keys
  # We use a temporary file to capture the output
  KEY_OUTPUT=$(node $GENERATOR_SCRIPT_PATH)
  
  # Extract the private and public keys from the output
  # This assumes the script's output format is consistent
  PRIVATE_KEY=$(echo "$KEY_OUTPUT" | grep 'Private key:' | sed 's/Private key: //')
  PUBLIC_KEY=$(echo "$KEY_OUTPUT" | grep 'publicKey key:' | sed 's/publicKey key: //')
  
  # Write the keys to their respective files
  echo "$PRIVATE_KEY" > "$PRIVATE_KEY_PATH"
  echo "$PUBLIC_KEY" > "$PUBLIC_KEY_PATH"
  
  echo "New key pair generated successfully."
else
  echo "Key pair found. Skipping generation."
fi

# Execute the main container command (passed as arguments to this script)
exec "$@"
