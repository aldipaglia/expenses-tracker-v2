FROM postgres:13.3-alpine

COPY ./pg-healthcheck.sh /usr/local/bin/

HEALTHCHECK CMD ["pg-healthcheck.sh"]
