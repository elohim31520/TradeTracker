#!/bin/sh
set -e

# Define the paths for the key files inside the secrets directory
SECRETS_DIR="/app/secrets"
PRIVATE_KEY_PATH="$SECRETS_DIR/private.key"
PUBLIC_KEY_PATH="$SECRETS_DIR/public.key"
GENERATOR_SCRIPT_PATH="/app/generateKeyPairSync.js"

# Ensure the secrets directory exists in the container
mkdir -p $SECRETS_DIR

# Check if the private key file does not exist
if [ ! -f "$PRIVATE_KEY_PATH" ]; then
  echo "Key pair not found in secrets directory. Generating new keys..."
  
  # Run the Node.js script to generate keys
  KEY_OUTPUT=$(node $GENERATOR_SCRIPT_PATH)
  
  # Extract the private and public keys from the output
  PRIVATE_KEY=$(echo "$KEY_OUTPUT" | grep -A 1 '-----PRIVATE KEY-----' | tail -n 1)
  PUBLIC_KEY=$(echo "$KEY_OUTPUT" | grep -A 1 '-----PUBLIC KEY-----' | tail -n 1)
  
  # Write the keys to their respective files
  echo "$PRIVATE_KEY" > "$PRIVATE_KEY_PATH"
  echo "$PUBLIC_KEY" > "$PUBLIC_KEY_PATH"
  
  echo "New key pair generated in $SECRETS_DIR."
else
  echo "Key pair found in secrets directory. Skipping generation."
fi

# Execute the main container command
exec "$@"
