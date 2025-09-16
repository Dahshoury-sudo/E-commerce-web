@echo off
echo Starting E-Commerce Development Environment...
echo.

echo Starting Django Backend Server...
start "Django Backend" cmd /k "cd /d %~dp0 && python manage.py runserver"

timeout /t 3 /nobreak > nul

echo Starting React Frontend Server...
start "React Frontend" cmd /k "cd /d %~dp0frontend && npm run dev"

echo.
echo Both servers are starting...
echo Backend: http://localhost:8000
echo Frontend: http://localhost:3000
echo.
echo Press any key to exit...
pause > nul
