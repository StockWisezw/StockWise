# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy the rest of the application
COPY . .

# Consume build arguments for Vite environment variables
ARG VITE_APPWRITE_ENDPOINT
ARG VITE_APPWRITE_PROJECT_ID
ARG VITE_APPWRITE_DATABASE_ID
ARG VITE_APPWRITE_BUCKET_ID

# Set them as environment variables for the build process
ENV VITE_APPWRITE_ENDPOINT=$VITE_APPWRITE_ENDPOINT
ENV VITE_APPWRITE_PROJECT_ID=$VITE_APPWRITE_PROJECT_ID
ENV VITE_APPWRITE_DATABASE_ID=$VITE_APPWRITE_DATABASE_ID
ENV VITE_APPWRITE_BUCKET_ID=$VITE_APPWRITE_BUCKET_ID

# Build the React application
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy custom Nginx configuration for single-page applications
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy the built assets from the builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose port 8080 (Cloud Run default)
EXPOSE 8080

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
