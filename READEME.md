###### 1. The repo:
```bash
git clone https://github.com/MrCode97/windowOrganizer.git
```

###### 2. Create your own `.env` files, i.e. 
```bash
cp frontend/.env.example frontend/.env
cp backend/.env.example backend/.env
```
and modify accordingly.

##### 3. Frontend:
```bash
cd adventCalender/frontend
export $(cat .env | xargs) # export env variables
npm install     # install dependencies
npm start       # run
```

##### 4. Backend:
```bash
cd adventCalender/backend
npm install     # install dependencies
export $(cat .env | xargs) # export env variables
node index.js   # run
```
```bash
# instead of export when using Windows
Get-Content .env | ForEach-Object { [System.Environment]::SetEnvironmentVariable($_.Split('=')[0], $_.Split('=')[1], [System.EnvironmentVariableTarget]::Process) }
```


##### 5. DB:
```bash
cd adventCalender/backend
docker build -t advent_db .
# Hit Ctrl-C to stop. Note the `--rm` flag to remove volume on close
docker run --rm -p 5432:5432 --name adventCal advent_db
```
![Alt text](image.png)