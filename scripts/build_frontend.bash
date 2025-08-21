#!/bin/bash

# Clean existing dist directories to avoid permission issues
rm -rf frontend/dist backend/dist

cd frontend
npm install
npm run build
cp -r dist ../backend/dist

cd ../backend
npm install