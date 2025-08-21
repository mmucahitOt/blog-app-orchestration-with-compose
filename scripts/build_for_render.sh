#!/bin/bash

# Exit on any error
set -e

echo "Starting Render build process..."

# Clean existing dist directories to avoid permission issues
echo "Cleaning dist directories..."
rm -rf frontend/dist backend/dist

# Install backend dependencies
echo "Installing backend dependencies..."
cd backend
npm install
cd ..

# Install frontend dependencies and build
echo "Installing frontend dependencies..."
cd frontend
npm install
npm run build
cp -r dist ../backend/dist

echo "Render build completed successfully!" 