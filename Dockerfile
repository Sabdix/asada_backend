FROM node:22

WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./

RUN npm config set strict-ssl false

RUN npm cache clean --force

RUN npm install --no-cache

# Copy source code
COPY . .

# Build application
RUN npm run build

# # Expose port
# EXPOSE 3000

# Start application
CMD ["node", "dist/main.js"]