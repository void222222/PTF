import React from 'react';

function Settings({ darkMode, setDarkMode }) {
  return (
    <div className="settings">
      <h2>Configurações</h2>
      <div className="setting-item">
        <label>
          <input
            type="checkbox"
            checked={darkMode}
            onChange={() => setDarkMode(!darkMode)}
          />
          Modo Escuro
        </label>
      </div>
      {/* Adicione mais configurações futuramente */}
    </div>
  );
}

export default Settings;