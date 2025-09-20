#!/bin/bash

# Start Next.js API server
echo "Starting Next.js API server..."
cd /Users/mackewinsson/projects/simple-budget
npm run dev &
NEXT_PID=$!

# Wait a moment for Next.js to start
sleep 5

# Start Expo development server
echo "Starting Expo development server..."
cd /Users/mackewinsson/projects/budgeting-mobile
npx expo start &
EXPO_PID=$!

echo "Both servers are starting..."
echo "Next.js API: http://localhost:3000"
echo "Expo Dev Server: http://localhost:8081"
echo ""
echo "Press Ctrl+C to stop both servers"

# Wait for user to stop
wait

# Cleanup
kill $NEXT_PID $EXPO_PID 2>/dev/null
