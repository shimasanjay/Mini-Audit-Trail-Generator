
const storage = require('../../lib/storage');

export default function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });
  const all = storage.list();
  res.status(200).json({ versions: all });
}
