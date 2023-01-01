FROM node:stretch-slim as builder

RUN npm i -g pkg

RUN mkdir /home/node/app
WORKDIR /home/node/app
COPY package.json package.json
COPY tsconfig.json tsconfig.json
RUN npm i
COPY src src
RUN npm run build

EXPOSE 7004
CMD ["node","dist/app.js"]