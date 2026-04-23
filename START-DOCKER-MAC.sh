#!/bin/bash
echo ""
echo "============================================"
echo "  LOGISTICS PRO ENTERPRISE - Starting..."
echo "============================================"
echo ""

# Check Docker
if ! docker info > /dev/null 2>&1; then
    echo "ERROR: Docker is not running!"
    echo ""
    echo "Please:"
    echo "  1. Open Docker Desktop from Applications"
    echo "  2. Wait for the whale icon in menu bar"
    echo "  3. Run this script again"
    echo ""
    exit 1
fi
echo "Docker is running OK"
echo ""
echo "Starting all services (first time takes 3-5 minutes)..."
echo ""

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$DIR"

docker-compose up -d --build

echo ""
echo "Waiting for app to be ready..."
sleep 15

LOCAL_IP=$(ipconfig getifaddr en0 2>/dev/null || ipconfig getifaddr en1 2>/dev/null || echo "your-ip")

echo ""
echo "============================================"
echo "  APP IS READY!"
echo "============================================"
echo ""
echo "  This computer:     http://localhost:3000"
echo "  Other office PCs:  http://$LOCAL_IP:3000"
echo ""
echo "  Login: admin / admin123"
echo ""
echo "  To STOP: bash STOP-DOCKER-MAC.sh"
echo "============================================"
echo ""

open http://localhost:3000
