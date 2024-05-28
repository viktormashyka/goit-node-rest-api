FROM node:20-alpine

WORKDIR /goit-node-rest-api

RUN yarn install --production

COPY . .

EXPOSE 3000

CMD ["node", "start"]