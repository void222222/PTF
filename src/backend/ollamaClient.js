const axios = require('axios');

async function queryOllama(prompt, model = 'codellama:13b') {
  try {
    const response = await axios.post('http://localhost:11434/api/generate', {
      model,
      prompt,
      stream: false
    });
    return response.data.response;
  } catch (error) {
    console.error('Erro ao chamar Ollama:', error.message);
    throw error;
  }
}

module.exports = { queryOllama };