FROM node:lts-alpine

WORKDIR /app

COPY package.json .
COPY yarn.lock .

RUN yarn install --production

COPY . .

EXPOSE 8080

CMD ["yarn", "start"]