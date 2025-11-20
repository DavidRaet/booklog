
FROM node:22 

WORKDIR /server 

COPY package*.json ./

RUN npm ci

COPY . .

ENV PORT=3002
EXPOSE 3002

CMD ["npm", "start"]