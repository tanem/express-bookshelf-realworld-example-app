FROM node:8.11.1

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY package.json yarn.lock ./
RUN yarn

COPY . .

EXPOSE 3000

CMD [ "yarn", "start" ]
