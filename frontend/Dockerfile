# === Stage 1: Build ===
FROM node:24-alpine AS build

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

# === Stage 2: Production (Keine node_modules Installation nötig!)
FROM node:24-alpine

WORKDIR /adventscalendar

# Kopiere NUR den kompilierten Frontend-Code und den nativen Server
COPY --from=build /app/dist/ ./dist/
COPY ./server.js ./server.js

# Standard-Fallbacks für Umgebungsvariablen (können zur Laufzeit überschrieben werden)
ENV PORT=3000
ENV BACKEND_URL=http://localhost:7007

EXPOSE 3000
CMD ["node", "server.js"]
