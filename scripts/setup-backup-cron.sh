#!/bin/bash
# Rawaa Platform - Backup Cron Setup Script

echo "Setting up automated backups..."

# Create backup directory
sudo mkdir -p /var/backups/rawaa
sudo chown -R www-data:www-data /var/backups/rawaa

# Create backup password file
sudo mkdir -p /etc/rawaa
echo "your-backup-encryption-password" | sudo tee /etc/rawaa/backup.pass > /dev/null
sudo chmod 600 /etc/rawaa/backup.pass

# Copy backup script
sudo cp scripts/backup.sh /usr/local/bin/rawaa-backup.sh
sudo chmod +x /usr/local/bin/rawaa-backup.sh

# Add to crontab (runs daily at 2:00 AM)
(crontab -l 2>/dev/null; echo "0 2 * * * /usr/local/bin/rawaa-backup.sh >> /var/log/rawaa-backup.log 2>&1") | crontab -

echo "Backup automation configured!"
echo "Backups will run daily at 2:00 AM"
echo "Backup location: /var/backups/rawaa"