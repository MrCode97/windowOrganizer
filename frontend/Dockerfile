FROM node:20-alpine

RUN npm install -g serve
WORKDIR /adventscalendar/
COPY build/ /adventscalendar

ENV REACT_APP_BACKEND_URL=""

CMD ["serve"]