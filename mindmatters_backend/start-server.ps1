# PowerShell script to start the backend server
# Usage: .\start-server.ps1

Write-Host "🛑 Stopping any existing Node processes..." -ForegroundColor Yellow
Get-Process | Where-Object {$_.ProcessName -eq "node"} | Stop-Process -Force -ErrorAction SilentlyContinue

Start-Sleep -Seconds 2

Write-Host "🚀 Starting backend server..." -ForegroundColor Green
Write-Host ""

node server.js

