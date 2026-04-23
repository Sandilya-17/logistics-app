#!/bin/bash
echo ""
echo "============================================"
echo "  Logistics Pro - Mac Setup & Run Script"
echo "============================================"
echo ""

# Get the directory where this script lives
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# Delete any old compiled files to force a clean build
echo "Cleaning old build files..."
rm -rf "$DIR/backend/target"
rm -rf "$DIR/frontend/node_modules"
echo "Clean done."
echo ""

# Check Java
if ! command -v java &> /dev/null; then
    echo "ERROR: Java not found!"
    echo "Install it with: brew install openjdk@17"
    echo "Then run: export PATH=\"/opt/homebrew/opt/openjdk@17/bin:\$PATH\""
    exit 1
fi
echo "Java: $(java -version 2>&1 | head -1)"

# Check Maven
if ! command -v mvn &> /dev/null; then
    echo "ERROR: Maven not found! Install: brew install maven"
    exit 1
fi
echo "Maven: OK"

# Check Node
if ! command -v node &> /dev/null; then
    echo "ERROR: Node.js not found! Install: brew install node"
    exit 1
fi
echo "Node: $(node --version)"

echo ""

# Start MongoDB
echo "Starting MongoDB..."
brew services start mongodb-community 2>/dev/null || brew services start mongodb-community@7.0 2>/dev/null || true
sleep 2

# Build backend
echo ""
echo "Building backend (first time takes ~2 minutes)..."
cd "$DIR/backend"
mvn package -DskipTests -q
if [ $? -ne 0 ]; then
    echo ""
    echo "ERROR: Build failed! Run this for details:"
    echo "  cd $DIR/backend && mvn package -DskipTests"
    exit 1
fi
echo "Build successful!"

# Start backend in background
echo "Starting backend server..."
java -jar "$DIR/backend/target/logistics-enterprise.jar" --spring.main.banner-mode=off > "$DIR/backend.log" 2>&1 &
BACKEND_PID=$!
echo "Backend PID: $BACKEND_PID (saved to backend.pid)"
echo $BACKEND_PID > "$DIR/backend.pid"
sleep 6

# Install frontend deps if needed
cd "$DIR/frontend"
if [ ! -d "node_modules" ]; then
    echo "Installing frontend packages (first time ~2 minutes)..."
    npm install --silent
fi

# Get local IP
LOCAL_IP=$(ipconfig getifaddr en0 2>/dev/null || ipconfig getifaddr en1 2>/dev/null || echo "unknown")

echo ""
echo "============================================"
echo "  ALL SERVICES STARTED!"
echo "============================================"
echo ""
echo "  This computer:       http://localhost:3000"
echo "  Other office PCs:    http://$LOCAL_IP:3000"
echo ""
echo "  Login: admin / admin123"
echo ""
echo "  Press Ctrl+C to stop"
echo "============================================"
echo ""

# Start frontend (blocks here - Ctrl+C stops everything)
export BROWSER=none
export HOST=0.0.0.0
npm start
