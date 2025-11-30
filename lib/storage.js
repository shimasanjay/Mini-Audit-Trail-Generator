const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(process.cwd(), 'data', 'versions.json');
let versions = [];

function ensureDataDir() {
  const dir = path.dirname(DATA_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function loadFromFile() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const raw = fs.readFileSync(DATA_FILE, 'utf8');
      versions = JSON.parse(raw || '[]');
    }
  } catch (e) {
    console.error('Failed loading data file', e);
    versions = [];
  }
}

function saveToFile() {
  try {
    ensureDataDir();
    fs.writeFileSync(DATA_FILE, JSON.stringify(versions, null, 2), 'utf8');
  } catch (e) {
    console.error('Failed writing data file', e);
  }
}

// initialize once (only runs on Node server)
if (typeof window === 'undefined') {
  try {
    loadFromFile();
  } catch (e) {}
}

module.exports = {
  list: () => versions.slice().reverse(), // newest first
  add: (v, persist = true) => {
    versions.push(v);
    if (persist) saveToFile();
  },
  latest: () => (versions.length ? versions[versions.length - 1] : null),
};
