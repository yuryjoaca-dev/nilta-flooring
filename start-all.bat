@echo off
setlocal ENABLEDELAYEDEXPANSION

REM ==============================
REM  CHANGE DIRECTORY TO SCRIPT
REM ==============================
cd /d %~dp0

echo ================================
echo Starting Nilta DEV Environment
echo ================================
echo.

REM ==============================
REM  START BACKEND (PORT 5000)
REM ==============================
echo [*] Starting backend on port 5000...
start "Nilta Backend" cmd /k "cd backend && npm run dev"

REM ==============================
REM  START FRONTEND (PORT 5173)
REM ==============================
echo [*] Starting frontend (Vite) on port 5173...
start "Nilta Frontend" cmd /k "cd /d %~dp0 && npm run dev"

REM ==============================
REM  START NGROK BACKEND TUNNEL
REM ==============================
echo [*] Starting ngrok backend tunnel (port 5000)...
start "ngrok Backend" cmd /k "cd /d %~dp0 && ngrok http 5000"

REM little wait so ngrok spins up
echo Waiting 5 seconds for ngrok backend to boot...
ping 127.0.0.1 -n 5 > nul

REM ==============================
REM  START NGROK FRONTEND TUNNEL
REM ==============================
echo [*] Starting ngrok frontend tunnel (port 5173)...
start "ngrok Frontend" cmd /k "cd /d %~dp0 && ngrok http 5173"

echo Waiting 5 seconds for ngrok frontend to boot...
ping 127.0.0.1 -n 5 > nul

REM ==============================
REM  READ TUNNEL URLS FROM NGROK API
REM ==============================
echo [*] Reading tunnel URLs from ngrok...

set i=0
set backendUrl=
set frontUrl=

REM ngrok API: http://127.0.0.1:4040/api/tunnels
REM Each line with "public_url" looks like:
REM    "public_url":"https://something.ngrok-free.app",
REM We split on double quotes and take token 4 => the URL

for /f "tokens=4 delims=\"" %%A in ('curl -s http://127.0.0.1:4040/api/tunnels ^| findstr /i "public_url"') do (
    set /a i+=1
    if !i! EQU 1 set backendUrl=%%A
    if !i! EQU 2 set frontUrl=%%A
)

echo Detected backend tunnel: !backendUrl!
echo Detected frontend tunnel: !frontUrl!
echo.

REM ==============================
REM  UPDATE .env WITH BACKEND URL
REM ==============================
if defined backendUrl (
    echo [*] Updating .env with backend URL...
    (
        echo VITE_API_BASE_URL=!backendUrl!
    ) > .env
    echo .env updated: VITE_API_BASE_URL=!backendUrl!
) else (
    echo [!] Could not detect backendUrl from ngrok API.
)

REM ==============================
REM  OPEN FINAL WINDOW WITH LINK
REM ==============================
if defined frontUrl (
    echo [*] Opening window with FINAL link to send...
    start "Send this link" cmd /k "echo SEND THIS LINK TO YOUR FRIEND: !frontUrl! && echo. && pause"
) else (
    echo [!] Could not detect frontUrl from ngrok API.
    echo     Check the 'ngrok Frontend' window manually.
)

echo.
echo ===============================================
echo All services started.
echo Backend tunnel:  !backendUrl!
echo Frontend tunnel: !frontUrl!
echo (Send the FRONTEND link to your friend.)
echo ===============================================
echo.

pause
endlocal
