# Java Code Analyzer PRO 🔍

> Ferramenta profissional para análise de padrões de código Java com interface estilo SonarQube

![Version](https://img.shields.io/badge/version-2.0.0-blue.svg)
![Electron](https://img.shields.io/badge/electron-latest-brightgreen.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Author](https://img.shields.io/badge/author-uelberbell%40gmail.com-orange.svg)
![AI](https://img.shields.io/badge/powered%20by-GitHub%20Copilot-purple.svg)

## 📋 Índice

- [Sobre o Projeto](#-sobre-o-projeto)
- [Funcionalidades](#-funcionalidades)
- [Capturas de Tela](#-capturas-de-tela)
- [Pré-requisitos](#-pré-requisitos)
- [Instalação](#-instalação)
- [Como Usar](#-como-usar)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [Tecnologias](#-tecnologias)
- [Métricas de Análise](#-métricas-de-análise)
- [Desenvolvimento](#-desenvolvimento)
- [Contribuição](#-contribuição)
- [Versioning](#-versioning)
- [Autor](#-autor)
- [Licença](#-licença)

## 🎯 Sobre o Projeto

O **Java Code Analyzer PRO** é uma ferramenta desktop desenvolvida com Electron que realiza análise estática de código Java, identificando problemas de qualidade, padrões de código, vulnerabilidades de segurança e code smells. 

Com interface inspirada no SonarQube, oferece uma experiência profissional para desenvolvedores e equipes que buscam manter alta qualidade em seus projetos Java.

### ✨ Principais Diferenciais

- 🎨 **Interface PRO** estilo SonarQube
- 📊 **Dashboard de métricas** em tempo real  
- 🚨 **Quality Gate** automático (PASSED/FAILED)
- 🔍 **15.000+ issues** analisados simultaneamente
- 📱 **Scroll infinito** para performance otimizada
- 💾 **Memória de último caminho** utilizado
- 🎯 **Filtros avançados** por severidade e categoria
- 📋 **Detalhes completos** de cada issue

## 🚀 Funcionalidades

### Core Features
- ✅ **Análise de padrões de código** Java
- ✅ **Detecção de code smells** 
- ✅ **Análise de segurança** (SQL Injection, senhas hardcoded)
- ✅ **Verificação de performance** 
- ✅ **Padrões de produção** (TODOs, código debug)
- ✅ **Cálculo de dívida técnica**
- ✅ **Relatórios detalhados** por arquivo

### Interface Features  
- 🎨 **Interface dual**: Clássica + PRO
- 📊 **Dashboard com métricas** visuais
- 🔍 **Sistema de filtros** avançado
- 📱 **Design responsivo** 
- 🎯 **Modal de detalhes** interativo
- 💾 **Memória de sessão** (último caminho)
- ⚡ **Scroll infinito** otimizado

### Quality Features
- 🚨 **Quality Gate** automático
- 📈 **Distribuição por severidade**: Blocker, Critical, Major, Minor, Info
- 🏷️ **Categorização**: Padrões, Code Smells, Produção, Performance, Segurança
- ⏱️ **Tempo estimado** para correção
- 🎯 **Priorização** inteligente de issues

## 📸 Capturas de Tela

### Tela Principal
![Tela Principal](https://ibb.co/cKQ2WSwJ)
*Interface principal com branding Capgemini e GitHub Copilot*

### Interface PRO
![Interface PRO](https://ibb.co/dqBdZT6)
*Dashboard estilo SonarQube com métricas em tempo real*

### Modal de Detalhes
![Modal Detalhes](https://ibb.co/8DpWyTg1)
*Modal com informações completas do issue e sugestões de correção*

## 🔧 Pré-requisitos

Antes de começar, certifique-se de ter instalado:

```bash
Node.js >= 16.0.0
npm >= 8.0.0
```

### Verificar instalação:
```bash
node --version
npm --version
```

## 📦 Instalação

### 1. Clone o repositório
```bash
git clone https://github.com/your-repo/Java-Code-Analyzer.git
cd Java-Code-Analyzer
```

### 2. Instale as dependências
```bash
npm install
```

### 3. Execute a aplicação
```bash
npm start
```

### 4. Para desenvolvimento com debug
```bash
npm run dev
```

## 🎮 Como Usar

### Primeira Análise
1. **Abra a aplicação**
2. **Clique em "Selecionar Pasta"** 
3. **Escolha a pasta** com arquivos Java (ex: `JavaSource/`)
4. **Clique em "Analisar Código"**
5. **Aguarde a análise** (spinner de loading)
6. **Clique em "Ver Análise Completa"** para interface PRO

### Interface PRO
- 📊 **Dashboard**: Visualize métricas principais
- 🚨 **Quality Gate**: Status geral do projeto
- 📈 **Severidade**: Distribição dos problemas
- 🏷️ **Categorias**: Tipos de issues encontrados
- 🔍 **Filtros**: Refine a visualização
- 📋 **Tabela**: Lista completa com scroll infinito
- 👁️ **Detalhes**: Modal com informações completas

### Filtros Disponíveis
- **Por Severidade**: Blocker, Critical, Major, Minor, Info
- **Por Categoria**: Padrões, Code Smells, Produção, Performance, Segurança
- **Combinações**: Múltiplos filtros simultâneos

## 📁 Estrutura do Projeto

```
java-code-analyzer/
├── main.js                          # Processo principal Electron
├── package.json                     # Dependências e scripts
├── README.md                        # Este arquivo
│
├── src/
│   ├── renderer/                    # Interface do usuário
│   │   ├── assets/
│   │   │   └── capgemini-logo.png   # Logo corporativa
│   │   │
│   │   ├── index.html               # Tela principal
│   │   ├── advanced-results.html    # Interface PRO
│   │   │
│   │   ├── style.css                # CSS tela principal
│   │   ├── advanced-style.css       # CSS interface PRO
│   │   │
│   │   ├── script.js                # JS tela principal
│   │   └── advanced-results-script.js # JS interface PRO
│   │
│   └── analyzer/                    # Engine de análise
│       ├── java-analyzer.js         # Analisador clássico
│       ├── advanced-java-analyzer.js # Analisador PRO
│       └── rules-engine.js          # Motor de regras
│
└── docs/                            # Documentação
    ├── screenshots/                 # Capturas de tela
    └── CHANGELOG.md                 # Histórico de versões
```

## 🛠️ Tecnologias

### Core
- **[Electron](https://electronjs.org/)** - Framework desktop multiplataforma
- **[Node.js](https://nodejs.org/)** - Runtime JavaScript
- **[HTML5/CSS3](https://developer.mozilla.org/)** - Interface moderna
- **[Vanilla JavaScript](https://javascript.info/)** - Lógica da aplicação

### Design System
- **Gradientes CSS** - Visual moderno
- **Flexbox/Grid** - Layout responsivo  
- **Animations** - Transições suaves
- **Typography** - Fontes system (San Francisco, Segoe UI)

### Features Avançadas
- **LocalStorage** - Persistência de dados
- **IPC (Inter-Process Communication)** - Comunicação entre processos
- **File System API** - Leitura de arquivos Java
- **Regular Expressions** - Pattern matching avançado

## 📊 Métricas de Análise

### Severidades
| Severidade | Descrição | Tempo Correção |
|------------|-----------|----------------|
| 🔴 **Blocker** | Bloqueia deploys | 2-4 horas |
| 🚨 **Critical** | Problemas graves | 1-2 horas |
| ⚠️ **Major** | Problemas importantes | 15-30 min |
| ⚠️ **Minor** | Melhorias recomendadas | 5-10 min |
| ℹ️ **Info** | Informações úteis | 2-5 min |

### Categorias
- 📐 **Padrões de Código** - Indentação, chaves, formatação
- 🦨 **Code Smells** - Métodos longos, classes grandes
- 🚀 **Preparação Produção** - TODOs, System.out, debug
- ⚡ **Performance** - Loops ineficientes, concatenação
- 🔒 **Segurança** - SQL Injection, senhas hardcoded

### Quality Gate
```javascript
PASSED: blocker === 0 && critical <= 5 && total <= 1000
FAILED: blocker > 0 || critical > 5 || total > 1000
```

## 🧪 Desenvolvimento

### Scripts Disponíveis
```bash
npm start          # Executar aplicação
npm run dev        # Executar com DevTools
npm run build      # Build para produção
npm run test       # Executar testes (futuro)
npm run lint       # Verificar código
```

### Debug
```bash
# Habilitar DevTools
npm run dev

# Console commands
window.clearLastPath()  # Limpar histórico de caminhos
```

### Personalização

#### Adicionar Nova Regra
```javascript
// src/analyzer/rules-engine.js
addCustomRule('minha-regra', {
    category: 'codingStandards',
    severity: 'major',
    pattern: /seu-pattern-aqui/g,
    message: 'Sua mensagem aqui'
});
```

#### Customizar Interface
```css
/* src/renderer/advanced-style.css */
:root {
    --primary-color: #667eea;
    --secondary-color: #764ba2;
    --success-color: #28a745;
    --warning-color: #ffc107;
    --danger-color: #dc3545;
}
```

## 🤝 Contribuição

Contribuições são sempre bem-vindas! Para contribuir:

1. **Fork** o projeto
2. **Clone** seu fork
3. **Crie uma branch** para sua feature (`git checkout -b feature/MinhaFeature`)
4. **Commit** suas alterações (`git commit -m 'Add: Minha nova feature'`)
5. **Push** para a branch (`git push origin feature/MinhaFeature`)
6. **Abra um Pull Request**

### Padrões de Commit
```
Add: Nova funcionalidade
Fix: Correção de bug  
Update: Atualização de código
Remove: Remoção de código
Docs: Atualização de documentação
Style: Alterações de estilo/formatação
Refactor: Refatoração de código
Test: Adição/correção de testes
```

## 📋 Versioning

Utilizamos [SemVer](http://semver.org/) para versionamento. 

### Histórico de Versões
- **v2.0.0** (2025-01-24) - Interface PRO completa
- **v1.5.0** (2025-01-20) - Scroll infinito e filtros
- **v1.0.0** (2025-01-15) - Primeira versão estável

Veja [CHANGELOG.md](CHANGELOG.md) para detalhes completos.

## 👨‍💻 Autor

**Uelber de Jesus Oliveira**
- 📧 Email: [uelberbell@gmail.com](mailto:uelberbell@gmail.com)  
- 🏢 Empresa: Capgemini Brasil
- 👤 Login: `uelberbell`
- 📅 Última atualização: **26 de Janeiro de 2025**

### 🤖 Powered by GitHub Copilot
Este projeto foi desenvolvido com assistência da IA GitHub Copilot © 2025, demonstrando a sinergia entre desenvolvedores humanos and inteligência artificial na criação de software de qualidade.

## 📄 Licença

Este projeto está licenciado sob a Licença MIT - veja o arquivo [LICENSE](LICENSE) para detalhes.

---

<div align="center">
  
### 🚀 **Java Code Analyzer PRO**
*Análise profissional de qualidade de código*

**Capgemini Brasil** 🇧🇷 | **Powered by GitHub Copilot** 🤖

[![Capgemini](https://img.shields.io/badge/Capgemini-Brasil-blue.svg)](https://www.capgemini.com/br-pt/)
[![GitHub Copilot](https://img.shields.io/badge/GitHub-Copilot-purple.svg)](https://github.com/features/copilot)

---

**Feito com ❤️ e ☕ no Brasil**

*Última atualização: 26/01/2025 às 16:12 (UTC)*

</div>




