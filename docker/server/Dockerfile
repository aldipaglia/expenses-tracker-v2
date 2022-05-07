FROM node:18.1.0-alpine3.14

### sqitch stuff
RUN apk add --no-cache --virtual \
  build-deps \
  g++ \
  make \
  perl-dev \
  tzdata openssh \
  curl \
  perl-dbd-pg \
  postgresql-client

RUN cpan App::cpanminus
RUN cpanm App::Sqitch --no-wget --notest --quiet
RUN rm -rf /root/.cpan
###

ENV TZ UTC

# RUN npm install -g nodemon @roarr/cli

WORKDIR /server
COPY ../../package.json .
RUN npm install
COPY ../../ .
