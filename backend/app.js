const express = require('express');
const path = require('path');
const { getDb } = require('./db');
const { ObjectId } = require('mongodb');

const FRONTEND = path.join(__dirname, '..', 'dist', 'belege-scanner', 'browser');

function createApp() {
  const app = express();
  app.use(express.json());

  app.get('/api/belege', async (req, res) => {
    const belege = await getDb().collection('belege').find().toArray();
    res.json(belege);
  });

  app.get('/api/belege/:id', async (req, res) => {
    const belegId = new ObjectId(req.params.id);
    const beleg = await getDb().collection('belege').findOne({ _id: belegId });
    if (!beleg) {
      res.status(404).json({ error: 'Beleg nicht gefunden' });
    } else {
      res.json(beleg);
    }
  });

  app.post('/api/belege', async (req, res) => {
    const neuerBeleg = req.body;
    await getDb().collection('belege').insertOne(neuerBeleg);
    res.status(201).json(neuerBeleg);
  });

  app.delete('/api/belege/:id', async (req, res) => {
    const belegId = new ObjectId(req.params.id);
    const result = await getDb().collection('belege').deleteOne({ _id: belegId });
    if (result.deletedCount === 0) {
      res.status(404).json({ error: 'Beleg nicht gefunden' });
    } else {
      res.status(204).send();
    }
  });

  app.put('/api/belege/:id', async (req, res) => {
    const belegId = new ObjectId(req.params.id);
    const geaenderterBeleg = req.body;
    const ergebnis = await getDb().collection('belege').updateOne(
      { _id: belegId }, { $set: geaenderterBeleg }
    );
    if (ergebnis.matchedCount === 0) {
      res.status(404).json({ error: 'Beleg nicht gefunden' });
    } else {
      res.status(200).json({ _id: req.params.id, ...geaenderterBeleg });
    }
  });

  require('./extract').register(app);

  app.use(express.static(FRONTEND));

  app.use((req, res) => {
    if (req.path.startsWith('/api')) {
      res.status(404).json({ error: 'Nicht gefunden' });
    } else {
      res.sendFile(path.join(FRONTEND, 'index.html'));
    }
  });

  return app;
}

module.exports = { createApp };
