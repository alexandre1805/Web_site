FROM node:16.17.0-bullseye-slim

WORKDIR /app

COPY ./package.json ./
RUN yarn install --include=dev

COPY . .

RUN chown -R node:node /app/node_modules

CMD [ "yarn", "run", "dev"]
