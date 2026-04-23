#!/bin/bash
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

echo "Stopping Logistics Pro..."

# Kill backend
if [ -f "$DIR/backend.pid" ]; then
    kill $(cat "$DIR/backend.pid") 2>/dev/null
    rm "$DIR/backend.pid"
fi
pkill -f "logistics-enterprise.jar" 2>/dev/null

# Kill frontend
pkill -f "react-scripts" 2>/dev/null

# Stop MongoDB
brew services stop mongodb-community 2>/dev/null || brew services stop mongodb-community@7.0 2>/dev/null

echo "All stopped."
