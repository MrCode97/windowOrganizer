FROM node:24-alpine

RUN npm install -g serve
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

EXPOSE 3000
CMD ["serve", "-s", "dist", "-l", "3000"]