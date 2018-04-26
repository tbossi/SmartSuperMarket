FROM node:9.11.1-alpine

WORKDIR app

COPY package.json packahe.json
RUN npm install

COPY . .

CMD npm rebuild node-sass && npm start

