const { MongoClient } = require('mongodb');

const client = new MongoClient('mongodb://localhost:27017');
let db;

async function connectDb() {
  await client.connect();
  db = client.db('belegescanner');
  console.log('MongoDB verbunden');
  return db;
}

function getDb() {
  return db;
}

module.exports = { connectDb, getDb };
