FROM node:22

# Define build-time argument with a default value

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm config set strict-ssl false

RUN npm cache clean --force

RUN npm install --no-cache

COPY . .

RUN npm run build
CMD ["sh", "-c", "node dist/main.js"]
