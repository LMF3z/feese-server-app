FROM node:16.18.0

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

ENV NODE_ENV=production

COPY . .

EXPOSE 3001

CMD ["npm", "start"]