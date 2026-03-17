FROM node:lts-alpine AS build-stage
WORKDIR /app
COPY package*.json .
RUN npm install
COPY . .
RUN npm run build

FROM nginx:stable-alpine AS production-stage
WORKDIR /usr/share/nginx/html
COPY --from=build-stage /app/dist .
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]