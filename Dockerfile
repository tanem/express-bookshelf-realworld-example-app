FROM node:8.11.1-alpine

RUN apk update && apk add bash && rm -rf /var/cache/apk/*

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY package.json yarn.lock ./
RUN yarn

COPY . .

EXPOSE 3000

CMD [ "yarn", "start" ]
