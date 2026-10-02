#!/bin/bash
# Rawaa Platform - System Monitoring Script
# Runs every 5 minutes via cron

MONITOR_LOG="/var/log/rawaa-monitor.log"
ALERT_WEBHOOK="https://hooks.slack.com/services/YOUR/WEBHOOK/URL"
WEB_URL="https://rawaa.sa"
API_URL="https://rawaa.sa/api/health"

function log() {
    echo "[$(date)] $1" >> "$MONITOR_LOG"
}

function alert() {
    local title=$1
    local message=$2
    log "ALERT: $title - $message"
    
    # Send Slack notification
    curl -s -X POST -H "Content-Type: application/json" \
        -d "{\"text\":\"*$title*: $message\"}" \
        "$ALERT_WEBHOOK" > /dev/null 2>&1
}

# 1. Check web server uptime
log "Checking web server..."
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" --max-time 10 "$WEB_URL")
if [ "$HTTP_CODE" != "200" ]; then
    alert "Web Server Down" "HTTP status: $HTTP_CODE"
fi

# 2. Check API health
log "Checking API health..."
API_RESPONSE=$(curl -s --max-time 10 "$API_URL")
if ! echo "$API_RESPONSE" | grep -q "ok"; then
    alert "API Unhealthy" "Response: $API_RESPONSE"
fi

# 3. Check disk space
log "Checking disk space..."
DISK_USAGE=$(df -h / | grep -v Filesystem | awk '{print $5}' | sed 's/%//')
if [ "$DISK_USAGE" -gt 85 ]; then
    alert "High Disk Usage" "Disk usage: ${DISK_USAGE}%"
fi

# 4. Check memory usage
log "Checking memory usage..."
MEM_USAGE=$(free -m | grep Mem | awk '{printf "%.0f", $3/$2 * 100.0}')
if [ "$MEM_USAGE" -gt 90 ]; then
    alert "High Memory Usage" "Memory usage: ${MEM_USAGE}%"
fi

# 5. Check PostgreSQL
log "Checking PostgreSQL..."
if ! pg_isready -h localhost -p 5432; then
    alert "PostgreSQL Down" "Database not responding"
fi

# 6. Check Redis
log "Checking Redis..."
if ! redis-cli ping | grep -q PONG; then
    alert "Redis Down" "Cache not responding"
fi

# 7. Check SSL certificate expiry
log "Checking SSL certificate..."
CERT_EXPIRY=$(echo | openssl s_client -connect rawaa.sa:443 -servername rawaa.sa 2>/dev/null | openssl x509 -noout -end_date 2>/dev/null | cut -d= -f2)
if [ -n "$CERT_EXPIRY" ]; then
    CERT_DATE=$(date -d "$CERT_EXPIRY" +%s)
    CURRENT_DATE=$(date +%s)
    DAYS_LEFT=$(( (CERT_DATE - CURRENT_DATE) / 86400 ))
    if [ "$DAYS_LEFT" -lt 30 ]; then
        alert "SSL Certificate Expiring" "Expires in $DAYS_LEFT days"
    fi
fi

log "Monitoring cycle complete"