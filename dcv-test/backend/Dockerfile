FROM node:14.17.6-alpine

EXPOSE 3000

WORKDIR /app
COPY package.json ./
COPY yarn.lock ./
RUN yarn --pure-lockfile --production=false
COPY . .
RUN yarn build
CMD ["yarn", "start:prod"]
