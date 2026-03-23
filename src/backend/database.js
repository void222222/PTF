// database.js
const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

const dbPath = path.join(__dirname, '../../database.sqlite');
const db = new Database(dbPath);

// Função para executar migrações
function runMigrations() {
  // Criação das tabelas (se não existirem)
  db.exec(`
    CREATE TABLE IF NOT EXISTS projects (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      path TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS ia_history (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      project_id INTEGER,
      type TEXT,
      prompt TEXT NOT NULL,
      response TEXT NOT NULL,
      metadata JSON,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(project_id) REFERENCES projects(id)
    );

    CREATE TABLE IF NOT EXISTS user_settings (
      key TEXT PRIMARY KEY,
      value JSON NOT NULL
    );

    CREATE TABLE IF NOT EXISTS scraping_results (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      project_id INTEGER,
      url TEXT NOT NULL,
      screenshot_path TEXT,
      screenshot_base64 TEXT,
      dom_snapshot TEXT,
      analysis JSON,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(project_id) REFERENCES projects(id)
    );
  `);

  // Verifica se a coluna screenshot_base64 já existe (caso a tabela já exista sem ela)
  const tableInfo = db.prepare("PRAGMA table_info(scraping_results)").all();
  const hasBase64Column = tableInfo.some(col => col.name === 'screenshot_base64');
  if (!hasBase64Column) {
    db.exec("ALTER TABLE scraping_results ADD COLUMN screenshot_base64 TEXT;");
    console.log('Coluna screenshot_base64 adicionada com sucesso');
  }
}

runMigrations();

module.exports = db;