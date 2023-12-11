The repo:
```bash
git clone https://github.com/MrCode97/adventCalender.git
```

Frontend:
```bash
cd adventCalender/frontend
npm install
```

Backend:
```bash
cd adventCalender/backend
npm install
node index.js
```

DB:
```bash
cd adventCalender/backend
docker build -t advent_db .
docker run --rm -p 5432:5432 --name adventCal advent_db
```
![Alt text](image.png)