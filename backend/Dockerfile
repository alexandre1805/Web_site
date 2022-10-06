FROM node:16.17.0-bullseye-slim

WORKDIR /app

COPY ./package.json ./
RUN npm install --include=dev

COPY . .

CMD [ "npm", "start" ]
