FROM node:16 AS builder

WORKDIR /app
COPY . .

RUN npm cache clean --force
RUN npm install --force
RUN npm i @vue/cli@5.0.5 --force
RUN npm run build -- --mode development

FROM nginx:1.23

COPY nginx/apps.conf /etc/nginx/conf.d/apps.conf
COPY nginx/nginx.conf /etc/nginx/nginx.conf
COPY --from=builder /app/dist /var/www/html/dist

CMD ["nginx", "-g", "daemon off;"]
