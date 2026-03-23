import React, { useState } from 'react';

function CodeAnalyzer() {
  const [code, setCode] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [action, setAction] = useState('explain');

  const handleAnalyze = async () => {
    if (!code.trim()) return;
    setLoading(true);
    try {
      const response = await window.electron.invoke('ollama-analyze', { code, action });
      setResult(response.result);
    } catch (error) {
      console.error('Erro na análise:', error);
      setResult('Erro ao conectar com o Ollama. Verifique se ele está rodando.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="code-analyzer">
      <h2>Analisador de Código com IA</h2>
      <div className="action-buttons">
        <button onClick={() => setAction('explain')} className={action === 'explain' ? 'active' : ''}>
          Explicar
        </button>
        <button onClick={() => setAction('optimize')} className={action === 'optimize' ? 'active' : ''}>
          Otimizar
        </button>
        <button onClick={() => setAction('bug')} className={action === 'bug' ? 'active' : ''}>
          Encontrar Bugs
        </button>
      </div>
      <textarea
        rows="10"
        placeholder="Cole seu código aqui..."
        value={code}
        onChange={(e) => setCode(e.target.value)}
      />
      <button onClick={handleAnalyze} disabled={loading}>
        {loading ? 'Analisando...' : 'Analisar'}
      </button>
      <div className="result">
        <h3>Resultado:</h3>
        <pre>{result}</pre>
      </div>
    </div>
  );
}

export default CodeAnalyzer;