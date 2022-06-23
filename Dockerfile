FROM node:alpine AS builder

RUN addgroup -S app && adduser -S app -G app

RUN apk add --no-cache jq

RUN mkdir -p /var/app; chown -R app:app /var/app; chmod -R u+rwx /var/app;
WORKDIR  /var/app/
USER app

COPY --chown=app:app ./package.json ./package-lock.json ./
RUN npm ci --legacy-peer-deps

COPY --chown=app:app ./ ./

RUN npx webpack --mode production
RUN npm prune --production

FROM node:alpine as server

RUN addgroup -S app && adduser -S app -G app

COPY --from=builder --chown=app:app /var/app/ /var/app

USER app
WORKDIR /var/app

ENV NODE_ENV=production
CMD npm start