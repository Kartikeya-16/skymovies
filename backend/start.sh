#!/bin/bash

# Color codes for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo "🎬 Movie Booking Backend Startup Script"
echo "========================================"
echo ""

# Check if .env file exists
if [ ! -f .env ]; then
    echo -e "${RED}❌ .env file not found!${NC}"
    echo "Creating .env from .env.example..."
    if [ -f .env.example ]; then
        cp .env.example .env
        echo -e "${YELLOW}⚠️  Please update the .env file with your API keys${NC}"
    fi
    exit 1
fi

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}📦 Installing dependencies...${NC}"
    npm install
fi

# Check if MongoDB is running
echo -e "${YELLOW}🔍 Checking MongoDB status...${NC}"
if ! pgrep -x "mongod" > /dev/null 2>&1; then
    echo -e "${YELLOW}⚠️  MongoDB is not running${NC}"
    echo "Starting MongoDB..."
    brew services start mongodb-community
    sleep 3
fi

# Verify MongoDB connection
if mongosh --eval "db.version()" --quiet > /dev/null 2>&1; then
    echo -e "${GREEN}✅ MongoDB is running${NC}"
else
    echo -e "${RED}❌ Cannot connect to MongoDB${NC}"
    echo "Please install MongoDB:"
    echo "  brew tap mongodb/brew"
    echo "  brew install mongodb-community"
    echo "  brew services start mongodb-community"
    exit 1
fi

# Ask if user wants to seed database
echo ""
read -p "Do you want to seed the database with sample data? (y/n) " -n 1 -r
echo ""
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${YELLOW}🌱 Seeding database...${NC}"
    npm run seed
fi

echo ""
echo -e "${GREEN}🚀 Starting backend server...${NC}"
echo -e "${GREEN}📍 API will be available at: http://localhost:5000${NC}"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

# Start the server
npm run dev

