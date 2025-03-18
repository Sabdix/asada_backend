FROM --platform=linux/amd64 node:22

# Define build-time argument with a default value

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm  config set strict-ssl false

RUN npm install

COPY . .

RUN npm run build
CMD ["sh", "-c", "node dist/main.js"]
