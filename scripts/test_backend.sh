#!/bin/bash
echo "Running OffLoop AI backend test suite..."
python3 -m pytest backend/tests -v
