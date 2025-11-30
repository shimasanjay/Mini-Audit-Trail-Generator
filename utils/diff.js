// utils/diff.js
// Small custom diff to extract added and removed words.
// Approach: normalize text -> split into words -> compute multiset difference.

function normalizeWords(text) {
  if (!text) return [];
  const cleaned = text
    .replace(/\r?\n/g, ' ')
    .replace(/["(),.:;?!\[\]{}<>\/\\@#\$%\^&*_=+~`|]/g, ' ')
    .toLowerCase()
    .trim();
  if (!cleaned) return [];
  return cleaned.split(/\s+/).filter(Boolean);
}

function multisetCounts(arr) {
  const m = new Map();
  for (const w of arr) m.set(w, (m.get(w) || 0) + 1);
  return m;
}

function multisetDiff(newCounts, oldCounts) {
  const added = [];
  const removed = [];

  for (const [k, newC] of newCounts.entries()) {
    const oldC = oldCounts.get(k) || 0;
    if (newC > oldC) {
      for (let i = 0; i < newC - oldC; i++) added.push(k);
    }
  }

  for (const [k, oldC] of oldCounts.entries()) {
    const newC = newCounts.get(k) || 0;
    if (oldC > newC) {
      for (let i = 0; i < oldC - newC; i++) removed.push(k);
    }
  }

  return { added, removed };
}

module.exports = { normalizeWords, multisetCounts, multisetDiff };
