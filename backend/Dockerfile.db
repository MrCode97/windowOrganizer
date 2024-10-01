FROM postgres:latest

ENV POSTGRES_USER=fwe
ENV POSTGRES_PASSWORD=VerySecureAdventsklaenderPW
ENV POSTGRES_DB=adventcalendar

COPY init.sql /docker-entrypoint-initdb.d/

EXPOSE 5432

VOLUME ["/var/lib/postgresql/data"]