const https = require('https');
const fs = require('fs');
const { verbinde } = require('./db');
const { createApp } = require('./app');

const sslOptions = {
  key: fs.readFileSync('/var/www/certs/lyra/privkey.pem'),
  cert: fs.readFileSync('/var/www/certs/lyra/fullchain.pem'),
};

async function start() {
  await verbinde();
  const app = createApp();

  https.createServer(sslOptions, app).listen(443, '0.0.0.0', () => {
    console.log('HTTPS läuft auf 443');
  });

  app.listen(80, '0.0.0.0', () => {
    console.log('HTTP läuft auf 80');
  });
}

start();
