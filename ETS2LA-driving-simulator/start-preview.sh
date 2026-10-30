#!/bin/bash

cd "$(dirname "$0")"

echo "Starting mock telemetry..."
node mock-server.js &
MOCK_PID=$!

sleep 2

echo "Starting web server..."
python3 -m http.server 8000 &
WEB_PID=$!

trap 'kill "$MOCK_PID" "$WEB_PID" 2>/dev/null' EXIT INT TERM

wait