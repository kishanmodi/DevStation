# Build stage
FROM node:20-slim AS build

WORKDIR /app

# Install build dependencies
COPY package*.json ./
RUN npm install

# Copy source and build
COPY . .
RUN npm run build

# Production stage
FROM node:20-slim

WORKDIR /app

# Install 'serve' to host the static files
RUN npm install -g serve

# Copy build artifacts from build stage
COPY --from=build /app/dist ./dist

# Expose port 3000
EXPOSE 3000

# Start the application
CMD ["serve", "-s", "dist", "-l", "3000"]
