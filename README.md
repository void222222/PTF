# PTF App – Resumo

**PTF App** é um aplicativo desktop multiplataforma que integra inteligência artificial local e web scraping para auxiliar desenvolvedores e profissionais de UX. Construído com **Electron**, **React** e **Python**, o app oferece duas ferramentas principais em uma interface de abas moderna.

## Principais funcionalidades


https://github.com/user-attachments/assets/e6b6bf0a-5666-4955-a07d-129b02db7c75


- **Analisador de código com IA**: utilizando o **Ollama** (modelo local, como CodeLlama), o usuário pode colar um trecho de código e pedir explicações, sugestões de otimização ou identificação de bugs. Tudo processado offline, garantindo privacidade.
- **Web Scraper com Playwright**: captura screenshots e o DOM completo de qualquer URL, além de gerar automaticamente uma análise de UX (usabilidade, acessibilidade) usando a mesma IA local.
- **Banco de dados SQLite**: histórico de análises e resultados de scraping armazenados localmente.
- **Modo escuro**: alternância de tema com persistência via localStorage.

## Tecnologias utilizadas

- **Frontend**: React, Vite, CSS Modules
- **Backend**: Node.js, Electron, SQLite (better-sqlite3)
- **IA local**: Ollama (modelo codellama:13b)
- **Web scraping**: Python 3, Playwright
- **Comunicação**: IPC do Electron com contexto isolado

## Como usar

1. Clone o repositório e instale as dependências (`npm install`).
2. Configure o ambiente Python com Playwright (`pip install playwright && playwright install chromium`).
3. Inicie o Ollama (`ollama pull codellama:13b` e `ollama serve`).
4. Execute `npm run dev` para desenvolvimento ou `npm run build && npm start` para produção.

O projeto é ideal para quem deseja uma ferramenta offline de análise de código e scraping com inteligência artificial, integrada em um único ambiente.

---

🔗 **GitHub:** (https://github.com/void222222/PTF)  
🔗 **LinkedIn:**(https://www.linkedin.com/in/lucas-santos-araujo/)
