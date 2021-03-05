FROM node:11-alpine

# create working directory
RUN mkdir -p /usr/src/app

# change into working directory
WORKDIR /usr/src/app

# copy neccessary files
COPY package.json ./
COPY package-lock.json ./
COPY src ./src
COPY public ./public
COPY rollup.config.js .
COPY server.js .

# install dependencies
RUN npm install

# build lotivis library
RUN npm run build

# remove unneccessary files
RUN rm -rf ./src
RUN rm -rf ./rollup.config.js

# start server
CMD npm run serve:example
