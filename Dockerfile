# Stage 1: Build the application
FROM node:22-alpine AS builder

WORKDIR /app

# Copy package files and install all dependencies (including dev)
COPY package*.json ./
RUN npm ci

# Copy the rest of the application source code
COPY . .

# Build the TypeScript project
RUN npm run build

# Stage 2: Create the production image
FROM node:22-alpine

WORKDIR /app

# Copy package files and install only production dependencies
COPY package*.json ./
RUN npm ci --omit=dev

# Copy built application from the builder stage
COPY --from=builder /app/dist ./dist

# Copy other necessary assets
COPY config ./config
COPY migrations ./migrations
COPY seeders ./seeders
COPY models ./models
COPY public ./public

# Copy the key generation script and the entrypoint script
COPY generateKeyPairSync.js ./
COPY entrypoint.sh ./

# Make the entrypoint script executable
RUN chmod +x ./entrypoint.sh

EXPOSE 3000

# Set the entrypoint
ENTRYPOINT ["./entrypoint.sh"]

# The command to run after the entrypoint
CMD [ "node", "./dist/app.js" ]