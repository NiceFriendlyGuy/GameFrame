@echo off
echo Starting backend...
cd backend
docker compose up -d --build

cd ..
echo Starting frontend...
cd frontend
ng serve
