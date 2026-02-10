# ---------- build ----------
FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# ---------- runtime ----------
FROM nginx:alpine

# remove config default do nginx
RUN rm /etc/nginx/conf.d/default.conf

# copia config customizada
COPY nginx.conf /etc/nginx/conf.d/default.conf

# copia build do Vite
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 3000

CMD ["nginx", "-g", "daemon off;"]
