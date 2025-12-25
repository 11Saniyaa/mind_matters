# PowerShell script to stop the backend server
# Usage: .\stop-server.ps1

Write-Host "🛑 Stopping backend server..." -ForegroundColor Yellow

$nodeProcesses = Get-Process | Where-Object {$_.ProcessName -eq "node"}

if ($nodeProcesses) {
    $nodeProcesses | Stop-Process -Force
    Write-Host "✅ All Node processes stopped" -ForegroundColor Green
} else {
    Write-Host "ℹ️ No Node processes running" -ForegroundColor Cyan
}

# Check if port 5000 is free
Start-Sleep -Seconds 1
$portCheck = netstat -ano | findstr :5000

if ($portCheck) {
    Write-Host "⚠️ Port 5000 is still in use. Finding process..." -ForegroundColor Yellow
    netstat -ano | findstr :5000
} else {
    Write-Host "✅ Port 5000 is now free" -ForegroundColor Green
}

