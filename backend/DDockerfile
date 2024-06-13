FROM node:22-alpine as base

WORKDIR /app

COPY package.json ./

RUN yarn install

COPY . ./

RUN npx prisma generate

CMD yarn start