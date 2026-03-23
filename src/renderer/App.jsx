import React, { useState } from 'react';
import { useTheme } from './hooks/useTheme';
import TabBar from './components/TabBar';
import CodeAnalyzer from './components/CodeAnalyzer';
import WebScraper from './components/WebScraper';
import Settings from './components/Settings';
import './styles/theme.css';
import './styles/tabs.css';

const tabs = [
  { id: 'analyzer', label: '🔍 Analisador de Código', icon: '' },
  { id: 'scraper', label: '🌐 Web Scraper', icon: '' },
  { id: 'settings', label: '⚙️ Configurações', icon: '' }
];

function App() {
  const [activeTab, setActiveTab] = useState('analyzer');
  const { darkMode, setDarkMode } = useTheme();

  return (
    <div className="app">
      <TabBar tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
      <div className="tab-content">
        {activeTab === 'analyzer' && <CodeAnalyzer />}
        {activeTab === 'scraper' && <WebScraper />}
        {activeTab === 'settings' && <Settings darkMode={darkMode} setDarkMode={setDarkMode} />}
      </div>
    </div>
  );
}

export default App;