# Build environment
FROM node:14 as build
WORKDIR /app
COPY . .
RUN npm ci --only=production
RUN npm run dist

# Production environment
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx/nginx.conf /etc/nginx/nginx.conf
COPY nginx/localhost.conf /etc/nginx/conf.d/default.conf
EXPOSE 80