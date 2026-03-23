const { spawn } = require('child_process');
const path = require('path');
const which = require('which');

async function runScraper(url) {
  let pythonCommand;
  try {
    pythonCommand = await which('python');
  } catch (err) {
    try {
      pythonCommand = await which('py');
    } catch (err2) {
      throw new Error('Python não encontrado. Instale o Python e adicione ao PATH.');
    }
  }

  // Caminho absoluto para o script Python
  const projectRoot = path.resolve(__dirname, '../..'); // sobe duas pastas: de src/backend para a raiz
  const pythonScript = path.join(projectRoot, 'src', 'python', 'scraper.py');
  console.log('Caminho do script Python:', pythonScript); // só para debug

  const pythonProcess = spawn(pythonCommand, [pythonScript, url]);

  let output = '';
  let errorOutput = '';

  pythonProcess.stdout.on('data', (data) => {
    output += data.toString();
  });

  pythonProcess.stderr.on('data', (data) => {
    errorOutput += data.toString();
    console.error(`[Python stderr] ${data}`);
  });

  return new Promise((resolve, reject) => {
    pythonProcess.on('close', (code) => {
      if (code === 0) {
        try {
          const result = JSON.parse(output);
          resolve(result);
        } catch (err) {
          reject(new Error(`Erro ao parsear JSON: ${err.message}\nSaída: ${output}`));
        }
      } else {
        reject(new Error(`Python encerrado com código ${code}\nErro: ${errorOutput}`));
      }
    });

    pythonProcess.on('error', (err) => {
      reject(new Error(`Falha ao iniciar Python: ${err.message}`));
    });
  });
}

module.exports = { runScraper };