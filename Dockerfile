FROM node:14.17.2 as node

WORKDIR /app
COPY ./ /app
RUN npm install
RUN npm run build

FROM nginx:alpine
COPY --from=node /app/dist/app-proyecto-ia /usr/share/nginx/html
COPY ./nginx-custom.conf /etc/nginx/conf.d/default.conf