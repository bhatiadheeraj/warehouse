FROM node:16

RUN npm install -g pm2

WORKDIR /app
COPY package.json /app
COPY package-lock.json /app
RUN npm install

COPY . /app
