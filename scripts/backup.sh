#!/bin/bash
# Rawaa Platform - Automated Backup System
# Runs daily at 2:00 AM via cron

BACKUP_DIR="/var/backups/rawaa"
DB_NAME="rawaa"
DB_USER="postgres"
DB_HOST="localhost"
RETENTION_DAYS=7
DATE=$(date +%Y%m%d_%H%M%S)

# Create backup directory if it doesn't exist
mkdir -p "$BACKUP_DIR"

echo "Starting backup at $(date)"

# 1. Database backup
echo "Backing up database..."
pg_dump -h "$DB_HOST" -U "$DB_USER" -F c -b -v -f "$BACKUP_DIR/db_$DATE.dump" "$DB_NAME"
if [ $? -eq 0 ]; then
    echo "Database backup successful"
else
    echo "Database backup failed"
    exit 1
fi

# 2. Files backup (uploads, certificates, config)
echo "Backing up files..."
tar -czf "$BACKUP_DIR/files_$DATE.tar.gz" \
    /var/www/rawaa/uploads \
    /etc/nginx/sites-available/rawaa \
    /etc/ssl/certs/rawaa \
    --exclude='*.log' 2>/dev/null
if [ $? -eq 0 ]; then
    echo "Files backup successful"
else
    echo "Files backup warning"
fi

# 3. Compress and secure
echo "Compressing backups..."
cd "$BACKUP_DIR"
tar -czf "full_backup_$DATE.tar.gz" db_$DATE.dump files_$DATE.tar.gz 2>/dev/null
rm -f db_$DATE.dump files_$DATE.tar.gz

# 4. Encrypt backup
echo "Encrypting backup..."
if command -v openssl &> /dev/null; then
    openssl aes-256-cbc -salt -in "full_backup_$DATE.tar.gz" -out "full_backup_$DATE.tar.gz.enc" -pass file:/etc/rawaa/backup.pass -kx
    rm -f "full_backup_$DATE.tar.gz"
fi

# 5. Cleanup old backups
echo "Cleaning up old backups..."
find "$BACKUP_DIR" -name "full_backup_*.enc" -mtime +$RETENTION_DAYS -delete

# 6. Upload to cloud (optional)
if [ -n "$BACKUP_S3_BUCKET" ]; then
    echo "Uploading to S3..."
    aws s3 cp "$BACKUP_DIR/full_backup_$DATE.tar.gz.enc" "s3://$BACKUP_S3_BUCKET/" --quiet
fi

echo "Backup completed at $(date)"

# Send notification
curl -X POST -H "Content-Type: application/json" \
    -d '{"text":"Backup completed successfully","channel":"#backups"}' \
    https://hooks.slack.com/services/YOUR/WEBHOOK/URL 2>/dev/null