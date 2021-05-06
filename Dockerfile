FROM node:14.16.1

RUN npm install --global npm

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY package.json package-lock.json ./
RUN npm install

COPY . .

EXPOSE 3000

CMD [ "./bin/start.sh" ]
