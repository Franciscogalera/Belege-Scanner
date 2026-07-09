// Nur für lokalen Test
const { connectDb } = require('./db');
const { createApp } = require('./app');

async function start() {
  await connectDb();
  createApp().listen(4000, () => {
    console.log('Lokal: http://localhost:4000');
  });
}

start();
