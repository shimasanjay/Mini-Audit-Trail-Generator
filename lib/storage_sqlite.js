
const Database = require('better-sqlite3');
const path = require('path');
const dbPath = path.join(process.cwd(), 'data', 'versions.sqlite3');

function init() {
  const db = new Database(dbPath);
  db.pragma('journal_mode = WAL');
  db.exec(`
    CREATE TABLE IF NOT EXISTS versions (
      id TEXT PRIMARY KEY,
      timestamp TEXT,
      addedWords TEXT,
      removedWords TEXT,
      addedWordsCount INTEGER,
      removedWordsCount INTEGER,
      oldLength INTEGER,
      newLength INTEGER,
      content TEXT
    );
  `);
  return db;
}

const db = init();

module.exports = {
  list: () => {
    const rows = db.prepare('SELECT * FROM versions ORDER BY rowid DESC').all();
    return rows.map(r => ({
      ...r,
      addedWords: JSON.parse(r.addedWords || '[]'),
      removedWords: JSON.parse(r.removedWords || '[]'),
      newLength: Number(r.newLength),
      oldLength: Number(r.oldLength),
      addedWordsCount: Number(r.addedWordsCount),
      removedWordsCount: Number(r.removedWordsCount)
    }));
  },
  add: (v) => {
    const stmt = db.prepare(`
      INSERT INTO versions (id,timestamp,addedWords,removedWords,addedWordsCount,removedWordsCount,oldLength,newLength,content)
      VALUES (@id,@timestamp,@addedWords,@removedWords,@addedWordsCount,@removedWordsCount,@oldLength,@newLength,@content)
    `);
    stmt.run({
      id: v.id,
      timestamp: v.timestamp,
      addedWords: JSON.stringify(v.addedWords || []),
      removedWords: JSON.stringify(v.removedWords || []),
      addedWordsCount: v.addedWordsCount || 0,
      removedWordsCount: v.removedWordsCount || 0,
      oldLength: v.oldLength || 0,
      newLength: v.newLength || 0,
      content: v.content || ''
    });
  },
  latest: () => {
    const r = db.prepare('SELECT * FROM versions ORDER BY rowid DESC LIMIT 1').get();
    if (!r) return null;
    return {
      ...r,
      addedWords: JSON.parse(r.addedWords || '[]'),
      removedWords: JSON.parse(r.removedWords || '[]')
    };
  }
};
