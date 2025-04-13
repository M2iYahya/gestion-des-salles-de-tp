FROM node:22.12.0-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install -g npm@10.9.0
RUN npm install

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]