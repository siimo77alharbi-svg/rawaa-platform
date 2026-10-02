#!/bin/bash
# Rawaa Platform - Monitoring Cron Setup Script

echo "Setting up system monitoring..."

# Create log directory
sudo mkdir -p /var/log
sudo touch /var/log/rawaa-monitor.log
sudo chmod 666 /var/log/rawaa-monitor.log

# Copy monitoring script
sudo cp scripts/monitor.sh /usr/local/bin/rawaa-monitor.sh
sudo chmod +x /usr/local/bin/rawaa-monitor.sh

# Add to crontab (runs every 5 minutes)
(crontab -l 2>/dev/null; echo "*/5 * * * * /usr/local/bin/rawaa-monitor.sh") | crontab -

echo "Monitoring configured!"
echo "Checks run every 5 minutes"
echo "Log file: /var/log/rawaa-monitor.log"