# Set build image for node
FROM node:20-alpine AS builder


WORKDIR /app


# Installing Dependencies
COPY package*.json ./
RUN npm install

# Copy code source and building app
COPY . .
RUN npm run build

# Release prod build
FROM node:20-alpine

# Copying dependencies, dist folder and env file
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY .env .env

# Expose app port
EXPOSE 3000

# Run app command
CMD ["node", "dist/main"]