#!/bin/bash

/app/wait-for-it.sh mongo:27017 --timeout=60 --strict -- echo "MongoDB is up"

# Run the downloader script
python app/utils/downloader.py

# Start the Uvicorn server
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload

