@echo off
echo Starting EchoBrains Assistant...
echo.
echo Starting server...
start "EchoBrains Server" cmd /k "node server/server.js"
timeout /t 3 /nobreak >nul
echo.
echo Starting React app...
cd echobrains-react
npm run dev