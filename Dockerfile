FROM node:12.18.1

ENV NODE_ENV=production
ENV PORT=80

EXPOSE 80

WORKDIR /app

COPY package.json .

RUN npm install


COPY . .

RUN npm run build

CMD npm start
