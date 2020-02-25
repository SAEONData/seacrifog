FROM node:13-alpine
WORKDIR /app
COPY . .
RUN npm config set ignore-scripts true
RUN npm ci
RUN npm config set ignore-scripts false
EXPOSE 3000
CMD [ "npm", "run", "start:prod" ]