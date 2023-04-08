FROM node:lts-alpine

WORKDIR /app

COPY package.json .
COPY yarn.lock .

RUN yarn install 

COPY . .

EXPOSE 3123

CMD ["yarn", "start"]