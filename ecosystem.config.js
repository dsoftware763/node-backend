module.exports = {
  apps : [{
    name: 'API',
    script: 'npm start',
    // Options reference: https://pm2.io/doc/en/runtime/reference/ecosystem-file/
    autorestart: true,
  }]
};