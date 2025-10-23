FROM node:22 AS builder

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Build the NestJS project
RUN npm run build

FROM node:22-alpine

WORKDIR /app

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/dist ./dist

RUN npm install --only=production

# Expose NestJS default port
EXPOSE 8000

# Set environment variable
ENV NODE_ENV=production

# Start the app
CMD ["node", "dist/main.js"]
