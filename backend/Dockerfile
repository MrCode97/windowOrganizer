FROM node:20-alpine

WORKDIR /adventscalendar/
COPY package.json /adventscalendar/package.json
COPY package-lock.json /adventscalendar/package-lock.json
COPY index.js /adventscalendar/index.js

RUN npm i

ENV JWT_SECRET=jwt_secret_sign_key
ENV DB_USER=fwe
ENV DB_HOST=db
ENV DB=adventcalendar
ENV DB_PASSWORD=VerySecureAdventsklaenderPW
ENV DB_PORT=5432

EXPOSE 7007

CMD ["node", "index.js"]