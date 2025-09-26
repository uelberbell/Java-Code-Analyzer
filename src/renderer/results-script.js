const { ipcRenderer } = require('electron');

// Elementos da interface
const backBtn = document.getElementById('back-btn');
const totalFilesSpan = document.getElementById('total-files');
const filesWithErrorsSpan = document.getElementById('files-with-errors');
const totalIssuesSpan = document.getElementById('total-issues');
const resultsTable = document.getElementById('results-table');
const resultsTbody = document.getElementById('results-tbody');
const detailsModal = document.getElementById('details-modal');
const modalTitle = document.getElementById('modal-title');
const errorDetails = document.getElementById('error-details');
const closeModal = document.getElementById('close-modal');

// Event Listeners
backBtn.addEventListener('click', () => window.close());
closeModal.addEventListener('click', hideModal);

// Receber dados da análise
ipcRenderer.on('analysis-results', (event, results) => {
    console.log('Resultados recebidos:', results); // Debug
    displayResults(results);
});

function displayResults(results) {
    // Atualizar estatísticas
    totalFilesSpan.textContent = `Arquivos analisados: ${results.totalFiles || 0}`;
    filesWithErrorsSpan.textContent = `Arquivos com problemas: ${results.filesWithErrors || 0}`;
    totalIssuesSpan.textContent = `Total de problemas: ${results.totalIssues || 0}`;
    
    // Limpar tabela
    resultsTbody.innerHTML = '';
    
    // Adicionar linhas da tabela
    if (results.files && results.files.length > 0) {
        results.files.forEach(file => {
            if (file.issues && file.issues.length > 0) {
                const row = createTableRow(file);
                resultsTbody.appendChild(row);
            }
        });
    }
    
    // Se não há arquivos com problemas na tabela, mostrar mensagem
    if (resultsTbody.children.length === 0) {
        const row = document.createElement('tr');
        row.innerHTML = '<td colspan="4" style="text-align: center; color: #666;">Nenhum arquivo com problemas para exibir</td>';
        resultsTbody.appendChild(row);
    }
}

function createTableRow(file) {
    const row = document.createElement('tr');
    
    const fileName = file.path.split('/').pop() || file.path.split('\\').pop() || file.path;
    const issueCount = file.issues.length;
    const affectedLines = file.issues.map(issue => issue.line).join(', ');
    
    row.innerHTML = `
        <td>${fileName}</td>
        <td>${issueCount}</td>
        <td>${affectedLines}</td>
        <td><button class="view-details-btn" data-file-path="${file.path}">Ver Detalhes</button></td>
    `;
    
    // Adicionar event listener ao botão
    const detailBtn = row.querySelector('.view-details-btn');
    detailBtn.addEventListener('click', () => {
        showFileDetails(file.path, file.issues);
    });
    
    return row;
}

function showFileDetails(filePath, issues) {
    const fileName = filePath.split('/').pop() || filePath.split('\\').pop() || filePath;
    modalTitle.textContent = `Detalhes: ${fileName}`;
    
    // Limpar detalhes anteriores
    errorDetails.innerHTML = '';
    
    // Adicionar cada problema
    issues.forEach(issue => {
        const errorItem = document.createElement('div');
        errorItem.className = 'error-item';
        
        errorItem.innerHTML = `
            <h4>${getIssueTypeLabel(issue.type)}</h4>
            <p><span class="line-number">Linha ${issue.line}</span></p>
            <p>${issue.message}</p>
            ${issue.suggestion ? `<p><strong>Sugestão:</strong> ${issue.suggestion}</p>` : ''}
        `;
        
        errorDetails.appendChild(errorItem);
    });
    
    detailsModal.classList.remove('hidden');
}

function hideModal() {
    detailsModal.classList.add('hidden');
}

function getIssueTypeLabel(type) {
    const labels = {
        'indentation': '🔄 Problema de Indentação',
        'comments': '💬 Comentário Inadequado',
        'braces': '🔗 Estrutura sem Chaves',
        'general': '⚠️ Problema Geral'
    };
    
    return labels[type] || '⚠️ Problema Detectado';
}

// Fechar modal ao clicar fora dele
detailsModal.addEventListener('click', (e) => {
    if (e.target === detailsModal) {
        hideModal();
    }
});