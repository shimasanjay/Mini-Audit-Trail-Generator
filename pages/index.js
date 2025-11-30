
import React, { useEffect, useState } from 'react';

export default function Home() {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [versions, setVersions] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchVersions();
  }, []);

  async function fetchVersions() {
    try {
      const r = await fetch('/api/versions');
      const j = await r.json();
      setVersions(j.versions || []);
    } catch (e) {
      console.error(e);
    }
  }

  async function saveVersion() {
    setLoading(true);
    setMessage('Saving...');
    try {
      const r = await fetch('/api/save-version', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });
      const j = await r.json();
      if (r.ok) {
        setMessage('Saved');
        await fetchVersions();
      } else {
        setMessage(j.error || 'Save failed');
      }
    } catch (e) {
      console.error(e);
      setMessage('Network error');
    } finally {
      setLoading(false);
      setTimeout(() => setMessage(''), 1800);
    }
  }

  return (
    <div className="container">
      <h1 className="title">Mini Audit Trail Generator</h1>
      <p className="subtitle">Type text below and click <strong>Save Version</strong> to record changes.</p>

      <div className="main-layout">
        
        {/* EDITOR */}
        <div className="editor-container">
          <label className="label">Content Editor</label>

          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={12}
            className="editor"
            placeholder="Write something and press Save Version..."
          />

          <div className="editor-actions">
            <button onClick={saveVersion} disabled={loading} className="save-btn">
              {loading ? 'Saving...' : 'Save Version'}
            </button>
            <span className="message">{message}</span>
          </div>
        </div>

        {/* HISTORY */}
        <div className="history-container">
          <h3 className="history-title">Version History</h3>

          <div className="history-box">
            {versions.length === 0 && <div className="no-versions">No versions yet</div>}

            {versions.map((v) => (
              <div key={v.id} className="version-card">
                <div className="timestamp">{v.timestamp}</div>

                <div className="summary">
                  +{v.addedWordsCount} / -{v.removedWordsCount} — {v.newLength} chars
                </div>

                <div className="diff-line">
                  <strong>Added:</strong> {v.addedWords?.length ? v.addedWords.join(', ') : '—'}
                </div>
                <div className="diff-line">
                  <strong>Removed:</strong> {v.removedWords?.length ? v.removedWords.join(', ') : '—'}
                </div>

                <details className="content-preview">
                  <summary>View content</summary>
                  <pre>{v.content}</pre>
                </details>
              </div>
            ))}
          </div>
        </div>

      </div>

      <hr className="divider" />

      <div className="notes">
        <strong>Notes:</strong> This example uses an in-memory store with optional JSON persistence.
      </div>
    </div>
  );
}
