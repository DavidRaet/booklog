FROM node:21.5-alpine AS build

WORKDIR /frontend 

COPY package.json package-lock.json ./
RUN npm run ci

COPY . .
RUN npm run build

FROM nginx:alpine 

COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]