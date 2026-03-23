const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const db = require('./src/backend/database');
const ollama = require('./src/backend/ollamaClient');
const { runScraper } = require('./src/backend/pythonRunner');

let mainWindow;

app.whenReady().then(() => {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800, 
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  if (process.env.NODE_ENV === 'development') {
    mainWindow.loadURL('http://localhost:5173');
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, 'dist/renderer/index.html'));
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    app.whenReady().then(() => {});
  }
});

ipcMain.handle('ollama-analyze', async (event, { code, action }) => {
  let prompt = '';
  if (action === 'explain') prompt = `Explique o seguinte código de forma clara e didática:\n\n${code}`;
  else if (action === 'optimize') prompt = `Otimize o seguinte código, explicando as melhorias:\n\n${code}`;
  else if (action === 'bug') prompt = `Encontre possíveis bugs ou problemas no seguinte código:\n\n${code}`;

  const response = await ollama.queryOllama(prompt);
  
  const stmt = db.prepare(`INSERT INTO ia_history (type, prompt, response, metadata) VALUES (?, ?, ?, ?)`);
  stmt.run(action, code, response, JSON.stringify({ timestamp: new Date() }));
  
  return { result: response };
});

ipcMain.handle('run-scraper', async (event, { url }) => {
  console.log('=== run-scraper chamado com URL:', url);
  try {
    const result = await runScraper(url);
    console.log('Scraper retornou:', result ? 'OK' : 'vazio');

    if (result.error) {
      console.log('Erro do scraper:', result.error);
      return { error: result.error };
    }

    // Salva no banco
    const stmt = db.prepare(`INSERT INTO scraping_results (url, screenshot_base64, dom_snapshot) VALUES (?, ?, ?)`);
    const info = stmt.run(url, result.screenshot_base64, result.dom);
    console.log('Salvo no banco, id:', info.lastInsertRowid);

    // Análise opcional (se falhar, não quebra)
    let analysis = null;
    if (result.dom) {
      try {
        const analysisPrompt = `Analise o seguinte DOM de um site e identifique possíveis problemas de UX, acessibilidade ou quebra de layout. Seja específico:\n\n${result.dom.slice(0, 5000)}`; // limita tamanho
        analysis = await ollama.queryOllama(analysisPrompt);
        const updateStmt = db.prepare(`UPDATE scraping_results SET analysis = ? WHERE id = ?`);
        updateStmt.run(JSON.stringify({ analysis }), info.lastInsertRowid);
      } catch (e) {
        console.error('Erro na análise UX:', e);
        analysis = 'Erro ao gerar análise.';
      }
    }

    const response = {
      screenshot_base64: result.screenshot_base64,
      analysis: analysis,
      title: result.title
    };
    console.log('Respondendo ao front-end');
    return response;

  } catch (err) {
    console.error('Erro no handler run-scraper:', err);
    return { error: err.message };
  }
});