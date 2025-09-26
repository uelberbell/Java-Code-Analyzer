# 🔍 Java Code Analyzer

Uma ferramenta desktop simples e eficiente para análise de padrões de código Java, construída com Electron, Node.js e JavaScript.

## 📋 Funcionalidades

### ✅ Verificações Implementadas
- **Indentação**: Detecta uso misto de tabs e espaços, indentação inconsistente
- **Comentários**: Identifica comentários inadequados e marcadores de desenvolvimento (TODO/FIXME)
- **Estruturas de Controle**: Verifica if/else/while/for sem chaves obrigatórias
- **Padrões de Código**: Analisa estruturas malformadas que podem afetar produção

### 🖥️ Interface
- **Tela Principal**: Seletor de pasta JavaSource e botão de verificação
- **Resultados**: Grid com classes problemáticas e detalhes por linha
- **Detalhes**: Modal com informações específicas de cada erro encontrado

## 🚀 Instalação

1. Clone o repositório:
```bash
git clone https://github.com/uelberbell/Java-Code-Analyzer.git
cd java-code-analyzer
```

2. Instale as dependências:
```bash
npm install
```

3. Execute a aplicação:
```bash
npm start
```

## 🛠️ Desenvolvimento

Para executar em modo de desenvolvimento com DevTools:
```bash
npm run dev
```

## 📁 Estrutura do Projeto

```
java-code-analyzer/
├── package.json
├── main.js                 # Processo principal do Electron
├── src/
│   ├── renderer/
│   │   ├── index.html      # Interface principal
│   │   ├── results.html    # Interface de resultados
│   │   ├── style.css       # Estilos da aplicação
│   │   ├── script.js       # Lógica da tela principal
│   │   └── results-script.js # Lógica da tela de resultados
│   └── analyzer/
│       └── java-analyzer.js # Motor de análise dos arquivos Java
└── README.md
```

## 🔧 Como Usar

1. **Selecionar Pasta**: Clique em "Selecionar Pasta" e escolha o diretório JavaSource
2. **Verificar**: Clique no botão "Verificar" para iniciar a análise
3. **Resultados**: Se problemas forem encontrados, clique em "Mostrar Apontamentos"
4. **Detalhes**: Na tela de resultados, clique em "Ver Detalhes" para informações específicas

## ⚙️ Regras de Análise

### Indentação
- Detecta mistura de tabs e espaços
- Verifica consistência na indentação (múltiplos de 2 ou 4)

### Comentários
- Identifica comentários inline que afetam legibilidade
- Detecta marcadores de desenvolvimento (TODO, FIXME, XXX)

### Estruturas de Controle
- Verifica if/else/while/for sem chaves obrigatórias
- Detecta estruturas else-if malformadas

## 🎯 Próximas Melhorias

- [ ] Configuração personalizável de regras
- [ ] Exportação de relatórios (PDF/HTML)
- [ ] Integração com IDEs populares
- [ ] Suporte a mais regras de Clean Code
- [ ] Análise de complexidade ciclomática

## 🤝 Contribuindo

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 👨‍💻 Autor

**uelber-jesus_GCO2**

---


⭐ Se este projeto foi útil para você, considere dar uma estrela no repositório!
