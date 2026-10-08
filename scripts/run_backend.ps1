# Run OffLoop AI Backend Server on Windows PowerShell
Write-Host "Starting OffLoop AI Backend Server..." -ForegroundColor Green
$env:PYTHONPATH = "$PSScriptRoot\..\backend"
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
