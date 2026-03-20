# EchoBrains Assistant Startup Script
Write-Host "Starting EchoBrains Assistant..." -ForegroundColor Green
Write-Host ""

# Start server in background
Write-Host "Starting server..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "node server/server.js" -WindowStyle Normal

# Wait a moment for server to start
Start-Sleep -Seconds 3

# Start React app
Write-Host "Starting React app..." -ForegroundColor Yellow
Set-Location echobrains-react
npm run dev