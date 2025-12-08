#!/bin/sh
set -e

# Define the paths
SECRETS_DIR="/app/secrets"
PRIVATE_KEY_PATH="$SECRETS_DIR/private.key"
PUBLIC_KEY_PATH="$SECRETS_DIR/public.key"
GENERATOR_SCRIPT_PATH="/app/generateKeyPairSync.js"

mkdir -p $SECRETS_DIR

if [ ! -f "$PRIVATE_KEY_PATH" ]; then
  echo "Key pair not found. Generating new keys..."
  
  node $GENERATOR_SCRIPT_PATH "$PRIVATE_KEY_PATH" "$PUBLIC_KEY_PATH"
  
  echo "New key pair generated in $SECRETS_DIR."
else
  echo "Key pair found. Skipping generation."
fi

exec "$@"