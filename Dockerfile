FROM node:14.17.0-alpine

RUN npm install -g -f yarn

# Create App Directory
WORKDIR /home/premier-league

COPY package*.json ./

COPY . .

EXPOSE 3000

CMD ["npm", "start"]
