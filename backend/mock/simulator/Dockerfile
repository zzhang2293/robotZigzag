FROM node:alpine

COPY . /app
WORKDIR /app
RUN npm install json-server body-parser
CMD ["npx", "json-server", "db.json"]