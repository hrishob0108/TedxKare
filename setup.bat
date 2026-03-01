@echo off
REM TEDxKARE Setup Script for Windows
REM This script automates the initial setup of the project

echo.
echo ===================================
echo TEDxKARE Recruitment Portal Setup
echo ===================================
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo Error: Node.js is not installed.
    echo Please install Node.js v16+ from https://nodejs.org/
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
echo Node.js detected: %NODE_VERSION%
echo.

REM Setup Backend
echo --- SETTING UP BACKEND ---
cd backend

if not exist .env (
    echo Creating .env from .env.example...
    copy .env.example .env >nul
    echo .env created. Please edit it with your configuration.
) else (
    echo .env already exists
)

echo Installing backend dependencies...
call npm install

echo Backend setup complete!
echo.

REM Setup Frontend
echo --- SETTING UP FRONTEND ---
cd ..\frontend

if not exist .env (
    echo Creating .env from .env.example...
    copy .env.example .env >nul
    echo .env created
) else (
    echo .env already exists
)

echo Installing frontend dependencies...
call npm install

echo Frontend setup complete!
echo.

REM Summary
echo ===================================
echo Setup Complete!
echo ===================================
echo.
echo Next Steps:
echo.
echo 1. Configure Environment Variables:
echo    - Backend: backend\.env
echo    - Frontend: frontend\.env
echo.
echo 2. Start Backend (Terminal 1):
echo    cd backend ^&^& npm run dev
echo.
echo 3. Start Frontend (Terminal 2):
echo    cd frontend ^&^& npm run dev
echo.
echo 4. Create Admin Account:
echo    POST http://localhost:5000/api/admin/create
echo    Body: {"email":"admin@tedxkare.com","password":"your_password"}
echo.
echo 5. Access Application:
echo    - Frontend: http://localhost:5173
echo    - Admin: http://localhost:5173/admin
echo.
echo For more details, see README.md and QUICKSTART.md
echo.
pause
