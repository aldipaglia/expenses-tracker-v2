FROM node:18.1.0-alpine3.14

RUN wget --no-check-certificate -qO- https://github.com/golang-migrate/migrate/releases/download/v4.15.2/migrate.linux-amd64.tar.gz | tar xvz
RUN mv /migrate /usr/local/bin/migrate
# # RUN npm install -g nodemon @roarr/cli

WORKDIR /server
COPY ../../package.json .
RUN npm install
COPY ../../ .
