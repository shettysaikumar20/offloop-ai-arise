#!/bin/bash
echo "Starting OffLoop AI Backend Server..."
export PYTHONPATH="$(dirname "$0")/../backend"
python3 -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
