/**
 * Optional Node.js backend for Florida State Roleplay website.
 * Provides a simple REST API to sync config and news across all devices.
 *
 * Usage:
 *   1. npm install express cors
 *   2. node server.js
 *   3. Open http://localhost:3000
 */

const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, 'data.json');

// Simple admin token for API write access.
// Change this in production and keep it secret!
const ADMIN_TOKEN = process.env.ADMIN_TOKEN || 'H&l9Jo0';

app.use(cors());
app.use(express.json({ limit: '2mb' }));
app.use(express.static(__dirname));

// Default data structure
function getDefaultData() {
  return {
    version: 1,
    updatedAt: new Date().toISOString(),
    config: {},
    news: []
  };
}

// Read data from disk
function readData() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
    }
  } catch (e) {
    console.error('Failed to read data file:', e);
  }
  return getDefaultData();
}

// Write data to disk
function writeData(data) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
    return true;
  } catch (e) {
    console.error('Failed to write data file:', e);
    return false;
  }
}

// GET current data
app.get('/api/data', (req, res) => {
  res.json(readData());
});

// POST updated data (protected by admin token)
app.post('/api/data', (req, res) => {
  const token = req.headers.authorization;
  if (token !== `Bearer ${ADMIN_TOKEN}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { config, news } = req.body;
  const data = readData();

  if (config) data.config = config;
  if (news) data.news = news;
  data.updatedAt = new Date().toISOString();

  if (writeData(data)) {
    res.json({ success: true, updatedAt: data.updatedAt });
  } else {
    res.status(500).json({ error: 'Failed to save data' });
  }
});

app.listen(PORT, () => {
  console.log(`FSRP server running on http://localhost:${PORT}`);
  console.log(`Admin API token: ${ADMIN_TOKEN}`);
});
