@echo off
cd /d "%~dp0"
where py >nul 2>nul
if not errorlevel 1 (
 start "Minha Evangeline - servidor" cmd /k "py -3 -m http.server 8000 --bind 127.0.0.1"
 goto abrir
)
where python >nul 2>nul
if errorlevel 1 (
 echo Abra index.html pela extensao Live Server do VS Code.
 pause
 exit /b
)
start "Minha Evangeline - servidor" cmd /k "python -m http.server 8000 --bind 127.0.0.1"
:abrir
timeout /t 2 /nobreak >nul
start "" "http://127.0.0.1:8000/index.html"
