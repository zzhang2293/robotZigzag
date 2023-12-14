FROM node:alpine
RUN mkdir /app
COPY ./src /app/src
COPY ./public /app/public
COPY ./package.json /app/package.json
COPY ./package-lock.json /app/package-lock.json
WORKDIR /app
RUN npm install
RUN npm install react-scripts serve -g
RUN npm run build
EXPOSE 3000