#!/bin/bash
# Rawaa Platform - Complete Deployment Script for Wafa iCloud
# This script deploys the entire platform to a Linux server

set -e

echo "=== Rawaa Platform Deployment ==="
echo "Starting deployment at $(date)"

# Configuration
APP_DIR="/var/www/rawaa"
DOMAIN="rawaa.sa"
DB_NAME="rawaa"
DB_USER="rawaa_user"
DB_PASS=$(openssl rand -base64 12)

# 1. Create application directory
echo "Step 1: Setting up directories..."
sudo mkdir -p "$APP_DIR"
sudo chown -R $(whoami):$(whoami) "$APP_DIR"
cd "$APP_DIR"

# 2. Clone repository
echo "Step 2: Cloning repository..."
git clone https://github.com/siimo77alharbi-svg/rawaa-platform.git .
git checkout main

# 3. Install system dependencies
echo "Step 3: Installing system dependencies..."
sudo apt update
sudo apt install -y nodejs npm postgresql redis-server nginx

# 4. Set up PostgreSQL
echo "Step 4: Setting up PostgreSQL..."
sudo systemctl start postgresql
sudo -u postgres createdb "$DB_NAME"
sudo -u postgres createuser -P "$DB_USER" -d "$DB_NAME" <<< "$DB_PASS"
echo "Database created: $DB_NAME"

# 5. Install npm dependencies
echo "Step 5: Installing npm dependencies..."
npm ci --production

# 6. Generate Prisma client
echo "Step 6: Generating Prisma client..."
export DATABASE_URL="postgresql://$DB_USER:$DB_PASS@localhost:5432/$DB_NAME"
npx prisma generate
npx prisma db push
npx prisma db seed

# 7. Build application
echo "Step 7: Building application..."
npm run build

# 8. Configure nginx
echo "Step 8: Configuring nginx..."
cp nginx.conf /etc/nginx/sites-available/rawaa
sudo ln -sf /etc/nginx/sites-available/rawaa /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx

# 9. Set up SSL
echo "Step 9: Setting up SSL..."
./scripts/setup-ssl.sh

# 10. Start application with PM2
echo "Step 10: Starting application..."
npm install -g pm2
pm2 start ecosystem.config.js
pm2 save

# 11. Setup monitoring
echo "Step 11: Setting up monitoring..."
./scripts/setup-monitoring-cron.sh
./scripts/setup-backup-cron.sh

echo ""
echo "=== Deployment Complete ==="
echo "Application URL: https://$DOMAIN"
echo "Admin Panel: https://$DOMAIN/admin"
echo "API URL: https://$DOMAIN/api"
echo "Database: $DB_NAME / $DB_USER"
echo ""
echo "To view logs: pm2 logs"
echo "To restart: pm2 restart all"
echo "To stop: pm2 stop all"