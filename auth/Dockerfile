FROM node:12-alpine
LABEL maintainer="jailson.diasc@gmail.com"

WORKDIR /app
COPY package.json .

RUN npm install

COPY . .

ENTRYPOINT [ "npm", "run", "start" ]
