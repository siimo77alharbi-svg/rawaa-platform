module.exports = {
  apps: [
    {
      name: 'rawaa-api',
      script: './dist/api/server.js',
      instances: 'max',
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
        PORT: 3001
      },
      max_memory_restart: '500M',
      restart_delay: 3000,
      autorestart: true
    },
    {
      name: 'rawaa-frontend',
      script: './node_modules/.bin/next',
      args: 'start -p 3000',
      instances: 1,
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      },
      max_memory_restart: '1G',
      autorestart: true
    }
  ]
};