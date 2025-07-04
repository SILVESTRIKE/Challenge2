FROM node:18-alpine
WORKDIR /server
COPY package*.json ./
RUN npm install
COPY . .
CMD ["npx", "nodemon", "server.js"]
EXPOSE 3000