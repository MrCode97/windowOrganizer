The repo:
```bash
git clone https://github.com/MrCode97/adventCalender.git
```

Frontend:
```bash
cd adventCalender/frontend
npm install     # install dependencies
node index.js   # run
```

Backend:
```bash
cd adventCalender/backend
npm install     # install dependencies
node index.js   # run
```

DB:
```bash
cd adventCalender/backend
docker build -t advent_db .
# Hit Ctrl-C to stop. Note the `--rm` flag to remove volume on close
docker run --rm -p 5432:5432 --name adventCal advent_db
```
![Alt text](image.png)