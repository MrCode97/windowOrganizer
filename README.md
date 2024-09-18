###### 1. The repo:
```bash
git clone https://github.com/MrCode97/windowOrganizer.git
cd windowOrganizer
```

###### 2. Create your own `.env` files, i.e. 
```bash
cp frontend/.env.example frontend/.env
cp backend/.env.example backend/.env
```
and modify accordingly.


##### 3. DB:
```bash
# 1st terminal: windowOrganizer %
cd backend
docker build -t advent_db .
# Hit Ctrl-C to stop. Note the `--rm` flag to remove volume on close
docker run --rm -p 5432:5432 --name adventCal advent_db
```

##### 4. Backend:
```bash
# 2nd terminal: windowOrganizer %
cd backend
npm install     # install dependencies
export $(cat .env | xargs) # export env variables
node index.js   # run
```

```bash
# instead of export when using Windows
Get-Content .env | ForEach-Object { [System.Environment]::SetEnvironmentVariable($_.Split('=')[0], $_.Split('=')[1], [System.EnvironmentVariableTarget]::Process) }
```

##### 5. Frontend:
```bash
# 3rd terminal: windowOrganizer %
cd frontend
export $(cat .env | xargs) # export env variables
npm install     # install dependencies
npm start       # run
```

![Alt text](image.png)
