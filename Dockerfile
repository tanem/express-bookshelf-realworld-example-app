FROM node:16.15.0
RUN mkdir -p /home/node/app/_coverage && chown -R node:node /home/node/app
WORKDIR /home/node/app
COPY --chown=node:node package*.json ./
RUN npm ci
COPY --chown=node:node . .
EXPOSE 3000
USER node
CMD [ "./bin/start.sh" ]