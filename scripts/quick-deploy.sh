#!/bin/bash
# Rawaa Platform - Quick Deploy Script (for existing deployments)

set -e

echo "=== Rawaa Platform Quick Deploy ==="
cd /var/www/rawaa

echo "Pulling latest changes..."
git pull origin main

echo "Installing dependencies..."
npm ci --production

echo "Building application..."
npm run build

echo "Pushing database schema..."
npx prisma db push

echo "Restarting services..."
pm2 restart all

echo ""
echo "=== Deployment Complete ==="
echo "Application running at: https://rawaa.sa"