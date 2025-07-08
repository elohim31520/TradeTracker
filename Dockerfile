FROM node:22-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci --omit=dev

COPY dist ./dist

COPY config ./config
COPY migrations ./migrations
COPY seeders ./seeders
COPY models ./models

COPY public ./public

EXPOSE 1234

CMD [ "node", "./dist/app.js" ]