FROM node:alpine

RUN addgroup -S app && adduser -S app -G app

RUN mkdir -p /var/app; chown -R app:app /var/app; chmod -R u+rwx /var/app;
WORKDIR  /var/app/
USER app

COPY ./package.json ./package-lock.json ./
RUN npm ci --legacy-peer-deps

COPY ./ ./

RUN npx webpack --mode production

ENV NODE_ENV=production
CMD npm start