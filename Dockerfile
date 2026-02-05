FROM node:22-alpine

WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./
COPY pnpm-lock.yaml ./

# Install pnpm and dependencies
RUN npm install -g pnpm
RUN pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Build application
RUN pnpm run build

# Expose port
EXPOSE 3000

# Start application
CMD ["node", "dist/main.js"]