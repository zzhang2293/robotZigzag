FROM node:alpine

COPY . /app
WORKDIR /app
RUN npm install json-server
CMD ["npx", "json-server", "db.json"]