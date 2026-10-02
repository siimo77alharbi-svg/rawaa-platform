#!/bin/bash
# Rawaa Platform - Health Check Script
# Checks if all services are running properly

echo "=== Rawaa Platform Health Check ==="

# Check web server
echo -n "Web Server: "
if curl -s -o /dev/null -w "%{http_code}" https://rawaa.sa | grep -q "200"; then
    echo "OK (200)"
else
    echo "DOWN"
fi

# Check API
echo -n "API: "
if curl -s https://rawaa.sa/api/health | grep -q "ok"; then
    echo "OK"
else
    echo "UNHEALTHY"
fi

# Check database
echo -n "PostgreSQL: "
if pg_isready -h localhost -p 5432; then
    echo "OK"
else
    echo "DOWN"
fi

# Check Redis
echo -n "Redis: "
if redis-cli ping | grep -q "PONG"; then
    echo "OK"
else
    echo "DOWN"
fi

# Check PM2 processes
echo -n "PM2 Processes: "
pm2 list | grep online | wc -l
echo "online"

# Check disk space
echo -n "Disk Usage: "
df -h / | grep -v Filesystem | awk '{print $5}'

# Check memory usage
echo -n "Memory Usage: "
free -m | grep Mem | awk '{printf "%.0f%%", $3/$2 * 100.0}'
echo ""