FROM node:11-alpine

RUN mkdir -p /usr/src/app

WORKDIR /usr/src/app

COPY package.json ./
COPY package-lock.json ./
COPY src ./src
COPY public ./public
COPY rollup.config.js .
COPY server.js .

RUN npm install

RUN npm run build

RUN rm -rf ./src
RUN rm -rf ./rollup.config.js

CMD npm run start
