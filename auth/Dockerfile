FROM node:12
LABEL maintainer="jailson.diasc@gmail.com"

WORKDIR /app
COPY package.json .

RUN npm install

COPY . .

ENTRYPOINT [ "npm", "run", "start" ]
