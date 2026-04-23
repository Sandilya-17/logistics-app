#!/bin/bash
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$DIR"
echo "Stopping Logistics Pro..."
docker-compose down
echo "Done! All services stopped."
