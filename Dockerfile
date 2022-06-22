FROM node:16.15-alpine as node

WORKDIR /app

COPY package.json ./

RUN npm install -g

COPY . .

RUN npm run build --prod --omit=dev

FROM nginx:1.17.1-alpine as prod-stage

COPY --from=node /app/dist/demoweb /usr/share/nginx/html

EXPOSE 80

CMD ["nginx","-g","daemon off;"]