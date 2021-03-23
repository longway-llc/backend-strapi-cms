FROM strapi/base

WORKDIR /srv/app

ARG env-file=.env.development
EXPOSE 1337

COPY /app/package*.json .

RUN yarn

COPY /app .

LABEL tag=lwaero/strapi-cms:v3.5.3

CMD ["yarn", "develop"]