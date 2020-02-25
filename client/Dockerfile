# Build environment
FROM node:13 as build
WORKDIR /app
COPY . .
RUN npm ci
RUN npm run dist

# Production environment
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80