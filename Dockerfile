FROM node:16-alpine

WORKDIR /app

COPY package*.json ./
COPY . .

RUN npm ci
RUN npm run webpack:prod

EXPOSE 3000

CMD ["node", "index.js"]
