# Run pytest on backend
Write-Host "Running OffLoop AI backend test suite..." -ForegroundColor Cyan
python -m pytest backend/tests -v
