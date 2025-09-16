#!/bin/bash

echo "Starting E-Commerce Development Environment..."
echo

echo "Starting Django Backend Server..."
python manage.py runserver &
BACKEND_PID=$!

sleep 3

echo "Starting React Frontend Server..."
cd frontend
npm run dev &
FRONTEND_PID=$!

echo
echo "Both servers are starting..."
echo "Backend: http://localhost:8000"
echo "Frontend: http://localhost:3000"
echo
echo "Press Ctrl+C to stop both servers"

# Wait for user to stop
wait $BACKEND_PID $FRONTEND_PID
