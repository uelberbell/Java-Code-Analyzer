const { ipcRenderer } = require('electron');

// Elementos da interface
let folderPathInput;
let selectFolderBtn;
let verifyBtn;
let loading;
let resultsInfo;
let resultTitle;
let resultDescription;
let showAdvancedBtn;

let analysisResults = null;

// Inicializar elementos quando DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    console.log('🎯 Inicializando interface...');
    
    // Selecionar elementos
    folderPathInput = document.getElementById('folder-path');
    selectFolderBtn = document.getElementById('select-folder-btn');
    verifyBtn = document.getElementById('verify-btn');
    loading = document.getElementById('loading');
    resultsInfo = document.getElementById('results-info');
    resultTitle = document.getElementById('result-title');
    resultDescription = document.getElementById('result-description');
    showAdvancedBtn = document.getElementById('show-advanced-btn');
    
    // Verificar se todos os elementos foram encontrados
    if (!selectFolderBtn) {
        console.error('❌ Botão select-folder-btn não encontrado!');
        return;
    }
    
    if (!folderPathInput) {
        console.error('❌ Input folder-path não encontrado!');
        return;
    }
    
    console.log('✅ Todos os elementos encontrados');
    
    // Carregar último caminho salvo
    loadLastPath();
    
    // Configurar event listeners
    setupEventListeners();
});

function setupEventListeners() {
    console.log('🔧 Configurando event listeners...');
    
    // Event listener para seleção de pasta
    selectFolderBtn.addEventListener('click', async () => {
        console.log('📁 Clique no botão Selecionar Pasta detectado');
        await selectFolder();
    });
    
    // Event listener para verificação
    verifyBtn.addEventListener('click', async () => {
        console.log('🔍 Clique no botão Verificar detectado');
        await analyzeFiles();
    });
    
    // Event listener apenas para o botão PRO
    if (showAdvancedBtn) {
        showAdvancedBtn.addEventListener('click', () => {
            console.log('📊 Abrindo Análise PRO...');
            showAdvancedResults();
        });
    }
    
    console.log('✅ Event listeners configurados');
}

// 🆕 NOVA FUNÇÃO: Carregar último caminho
function loadLastPath() {
    try {
        const lastPath = localStorage.getItem('javaAnalyzer_lastPath');
        if (lastPath && folderPathInput) {
            console.log('📁 Carregando último caminho:', lastPath);
            folderPathInput.value = lastPath;
            
            // Habilitar botão de verificar se há caminho
            if (verifyBtn && lastPath.trim()) {
                verifyBtn.disabled = false;
                console.log('✅ Botão Analisar habilitado com último caminho');
            }
        }
    } catch (error) {
        console.warn('⚠️ Erro ao carregar último caminho:', error);
    }
}

// 🆕 NOVA FUNÇÃO: Salvar caminho
function saveLastPath(path) {
    try {
        if (path && path.trim()) {
            localStorage.setItem('javaAnalyzer_lastPath', path);
            localStorage.setItem('javaAnalyzer_lastPathDate', new Date().toISOString());
            console.log('💾 Último caminho salvo:', path);
        }
    } catch (error) {
        console.warn('⚠️ Erro ao salvar último caminho:', error);
    }
}

async function selectFolder() {
    console.log('📁 Tentando selecionar pasta...');
    
    try {
        // Desabilitar botão durante a seleção
        selectFolderBtn.disabled = true;
        selectFolderBtn.textContent = 'Selecionando...';
        
        // 🆕 ENVIAR ÚLTIMO CAMINHO para o dialog
        const currentPath = folderPathInput.value || '';
        const folderPath = await ipcRenderer.invoke('select-folder', currentPath);
        
        console.log('📁 Resposta do dialog:', folderPath);
        
        if (folderPath) {
            folderPathInput.value = folderPath;
            verifyBtn.disabled = false;
            
            // 🆕 SALVAR novo caminho
            saveLastPath(folderPath);
            
            console.log('✅ Pasta selecionada e salva:', folderPath);
        } else {
            console.log('⚠️ Nenhuma pasta selecionada');
        }
        
    } catch (error) {
        console.error('❌ Erro ao selecionar pasta:', error);
        alert('Erro ao selecionar pasta: ' + error.message);
        
    } finally {
        // Reabilitar botão
        selectFolderBtn.disabled = false;
        selectFolderBtn.textContent = 'Selecionar Pasta';
    }
}

async function analyzeFiles() {
    const folderPath = folderPathInput.value;
    
    if (!folderPath) {
        alert('Por favor, selecione uma pasta primeiro.');
        return;
    }

    console.log('🔍 Iniciando análise da pasta:', folderPath);
    
    // 🆕 SALVAR caminho quando iniciar análise também
    saveLastPath(folderPath);
    
    showLoading();
    
    try {
        const results = await ipcRenderer.invoke('analyze-java-files', folderPath);
        
        console.log('📊 Resultados recebidos:', results);
        
        if (results.error) {
            showError(results.error);
            return;
        }
        
        analysisResults = results;
        showAnalysisResults(results);
        
    } catch (error) {
        console.error('❌ Erro na análise:', error);
        showError('Erro durante a análise dos arquivos: ' + error.message);
    }
}

function showLoading() {
    if (loading) loading.classList.remove('hidden');
    if (resultsInfo) resultsInfo.classList.add('hidden');
    if (verifyBtn) verifyBtn.disabled = true;
}

function hideLoading() {
    if (loading) loading.classList.add('hidden');
    if (verifyBtn) verifyBtn.disabled = false;
}

function showAnalysisResults(results) {
    hideLoading();
    
    const totalFiles = results.totalFiles || 0;
    const filesWithErrors = results.filesWithErrors || 0;
    const totalIssues = results.totalIssues || 0;
    
    console.log(`📊 Exibindo resultados: ${totalIssues} problemas em ${filesWithErrors} de ${totalFiles} arquivos`);
    
    if (totalIssues === 0) {
        if (resultTitle) resultTitle.textContent = '✅ Código Limpo!';
        if (resultDescription) {
            resultDescription.textContent = `Parabéns! Foram analisados ${totalFiles.toLocaleString('pt-BR')} arquivo(s) Java e nenhum problema foi detectado. Seu código está seguindo os padrões de qualidade.`;
        }
        if (showAdvancedBtn) showAdvancedBtn.classList.add('hidden');
    } else {
        if (resultTitle) resultTitle.textContent = `📊 Análise Concluída!`;
        if (resultDescription) {
            resultDescription.textContent = `Foram encontrados ${totalIssues.toLocaleString('pt-BR')} problema(s) em ${filesWithErrors.toLocaleString('pt-BR')} arquivo(s) de um total de ${totalFiles.toLocaleString('pt-BR')} analisados. Clique abaixo para ver a análise detalhada.`;
        }
        if (showAdvancedBtn) {
            showAdvancedBtn.classList.remove('hidden');
            showAdvancedBtn.textContent = '🚀 Ver Análise Completa';
        }
    }
    
    if (resultsInfo) resultsInfo.classList.remove('hidden');
}

function showError(errorMessage) {
    hideLoading();
    
    if (resultTitle) resultTitle.textContent = '❌ Erro na análise';
    if (resultDescription) resultDescription.textContent = `Ocorreu um erro durante a análise: ${errorMessage}`;
    if (showAdvancedBtn) showAdvancedBtn.classList.add('hidden');
    
    if (resultsInfo) resultsInfo.classList.remove('hidden');
}

function showAdvancedResults() {
    if (analysisResults) {
        console.log('🚀 Abrindo interface PRO completa...');
        ipcRenderer.send('show-advanced-results', analysisResults);
    }
}

// 🆕 NOVA FUNÇÃO: Limpar histórico (opcional - para debug)
function clearLastPath() {
    try {
        localStorage.removeItem('javaAnalyzer_lastPath');
        localStorage.removeItem('javaAnalyzer_lastPathDate');
        console.log('🗑️ Histórico de caminhos limpo');
    } catch (error) {
        console.warn('⚠️ Erro ao limpar histórico:', error);
    }
}

// 🆕 EXPORTAR função para debug (opcional)
window.clearLastPath = clearLastPath;

console.log('📱 Script principal carregado - Java Code Analyzer v2.0');
console.log('👨‍💻 Author: uelber.jesus@capgemini.com');
console.log('🤖 Powered by GitHub Copilot © 2025');