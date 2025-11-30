const { v4: uuidv4 } = require('uuid');
const storage = require('../../lib/storage');
const { normalizeWords, multisetCounts, multisetDiff } = require('../../utils/diff');

export default function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { text } = req.body || {};
  if (typeof text !== 'string') return res.status(400).json({ error: 'Invalid text' });

  const prev = storage.latest();
  const prevText = prev ? prev.content : '';

  const oldWords = normalizeWords(prevText);
  const newWords = normalizeWords(text);

  const oldCounts = multisetCounts(oldWords);
  const newCounts = multisetCounts(newWords);

  const { added, removed } = multisetDiff(newCounts, oldCounts);

  const now = new Date();
  const timestamp = now.toISOString().replace('T', ' ').slice(0, 19);

  const version = {
    id: uuidv4(),
    timestamp,
    addedWords: Array.from(new Set(added)),
    removedWords: Array.from(new Set(removed)),
    addedWordsCount: added.length,
    removedWordsCount: removed.length,
    oldLength: prevText.length,
    newLength: text.length,
    content: text,
  };

  storage.add(version, true);
  return res.status(201).json({ ok: true, version });
}
