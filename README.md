###### Prerequisites
- Node.js 24 (set via `nvm use` or see `.nvmrc`)
- Docker (for DB / full compose)

###### 1. Clone
```bash
git clone https://github.com/MrCode97/windowOrganizer.git
cd windowOrganizer
nvm use
```

###### 2. Environment files
```bash
cp frontend/.env.example frontend/.env
cp backend/.env.example backend/.env
# modify values as needed
```

###### 3. Database (three options)

**Option A — Docker Compose (recommended):**
```bash
cd compose
docker compose up -d db
```

**Option B — standalone Docker:**
```bash
cd backend
docker build -t advent_db -f ./Dockerfile.db .
docker run --rm -p 5432:5432 --name adventCal advent_db
```

**Option C — local PostgreSQL:**
Create a database named `adventcalendar` with the credentials in `backend/.env`.

###### 4. Backend
```bash
cd backend
npm install
npm run dev    # starts with nodemon (auto-restart on changes)
```

###### 5. Frontend
```bash
cd frontend
npm install
npm run dev    # starts Vite dev server on http://localhost:3000
```

Vite reads `.env` automatically — no manual `export` needed.
It also proxies `/api` requests to `http://localhost:7007` so the backend URL is handled transparently.

###### 6. Full stack with Docker Compose
```bash
cd compose
docker compose up -d
```
