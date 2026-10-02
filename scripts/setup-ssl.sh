#!/bin/bash
# Rawaa Platform - SSL Certificate Setup Script
# Uses Let's Encrypt with Certbot for free SSL certificates

DOMAIN="rawaa.sa"
EMAIL="admin@rawaa.sa"
BACKUP_DIR="/var/backups/rawaa-ssl"
SSL_DIR="/etc/ssl/certs/rawaa"

echo "Setting up SSL certificates for $DOMAIN..."

# Install certbot if not installed
if ! command -v certbot &> /dev/null; then
    echo "Installing certbot..."
    sudo apt update
    sudo apt install -y certbot
fi

# Create SSL directory
sudo mkdir -p "$SSL_DIR"
sudo mkdir -p "$BACKUP_DIR"

# Get SSL certificate
echo "Obtaining SSL certificate..."
sudo certbot certonly \
    --standalone \
    -d "$DOMAIN" \
    -d "www.$DOMAIN" \
    -m "$EMAIL" \
    --non-interactive \
    --agree-to-tos \
    --webroot-path /var/www/html \
    --webroot

if [ $? -eq 0 ]; then
    echo "SSL certificate obtained successfully!"
    
    # Copy certificates to our SSL directory
    sudo cp /etc/letsencrypt/live/$DOMAIN/fullchain.pem "$SSL_DIR/fullchain.pem"
    sudo cp /etc/letsencrypt/live/$DOMAIN/privkey.pem "$SSL_DIR/privkey.pem"
    
    # Set permissions
    sudo chown -R www-data:www-data "$SSL_DIR"
    sudo chmod 600 "$SSL_DIR/privkey.pem"
else
    echo "Failed to obtain SSL certificate"
    exit 1
fi

# Setup auto-renewal (daily at 3 AM)
echo "Setting up auto-renewal..."
(crontab -l 2>/dev/null; echo "0 3 * * * certbot renew --quiet") | crontab -

# Reload nginx to use new certificates
echo "Reloading nginx..."
sudo systemctl reload nginx

echo "SSL setup complete!"
echo "Certificates located at: $SSL_DIR"