FROM node:latest

WORKDIR /app

COPY ./package*.json ./

RUN npm install
RUN npm install -g nodemon

COPY . .

CMD ["npm", "run", "start"]

EXPOSE 3001