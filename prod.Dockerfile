FROM strapi/base

WORKDIR /srv/app

ARG env-file=.env.production
ENV NODE_ENV=production

EXPOSE 1337

COPY /app/package*.json .

RUN yarn

COPY /app .

RUN yarn build