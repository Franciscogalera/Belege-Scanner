// Nur für lokalen Test
const { verbinde } = require('./db');
const { createApp } = require('./app');

async function start() {
  await verbinde();
  createApp().listen(4000, () => {
    console.log('Lokal: http://localhost:4000');
  });
}

start();
