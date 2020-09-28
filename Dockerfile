FROM node:alpine

RUN addgroup -S app && adduser -S app -G app

RUN mkdir -p /var/app; chown -R app:app /var/app;
WORKDIR  /var/app
USER app

COPY ./package.json ./package-lock.json ./
RUN npm install

COPY ./ ./

CMD npm start