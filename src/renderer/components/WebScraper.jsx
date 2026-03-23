import React, { useState } from 'react';

const WebScraper = () => {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleScrape = async () => {
    if (!url.trim()) return;
    setLoading(true);
    try {
      const response = await window.electron.invoke('run-scraper', { url });
      setResult(response);
    } catch (err) {
      console.error(err);
      setResult({ error: 'Erro ao executar scraper. Verifique se o Python e Playwright estão instalados.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Web Scraper com Playwright</h2>
      <input
        type="text"
        style={{ width: '80%', marginRight: '10px', padding: '8px' }}
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="https://exemplo.com"
      />
      <button onClick={handleScrape} disabled={loading}>
        {loading ? 'Executando...' : 'Analisar Site'}
      </button>
      {result && (
        <div style={{ marginTop: '20px' }}>
          {result.error ? (
            <p style={{ color: 'red' }}>{result.error}</p>
          ) : (
            <>
              {result.screenshot_base64 && (
                <div>
                  <h3>Screenshot:</h3>
                  <img
                    src={`data:image/png;base64,${result.screenshot_base64}`}
                    alt="Screenshot"
                    style={{ maxWidth: '100%', border: '1px solid #ccc', borderRadius: '4px' }}
                  />
                </div>
              )}
              {result.analysis && (
                <div>
                  <h3>Análise de UX:</h3>
                  <pre style={{ whiteSpace: 'pre-wrap', background: '#f5f5f5', padding: '10px', borderRadius: '5px' }}>
                    {result.analysis}
                  </pre>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default WebScraper;