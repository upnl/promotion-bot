FROM node:18

MAINTAINER Jiho Park <andrewpark421@gmail.com>

RUN mkdir -p /app
WORKDIR /app
ADD . /app

ENV NODE_ENV production

RUN npm install
RUN npm run build