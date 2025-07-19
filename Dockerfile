# Use the official Bun image on Alpine Linux
FROM oven/bun:alpine

# Set the working directory
WORKDIR /app

# Copy package.json and bun.lockb
COPY package.json bun.lockb ./

# Install dependencies
RUN bun install --production

# Copy the rest of the application source code
COPY . .

# Command to run the application
CMD ["bun", "index.ts"]
