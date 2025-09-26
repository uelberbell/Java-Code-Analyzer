const fs = require('fs-extra');
const path = require('path');

class JavaAnalyzer {
    constructor() {
        this.rules = {
            indentation: true,
            comments: true,
            braces: true,
            general: true
        };
    }

    async analyzeFolder(folderPath) {
        try {
            const javaFiles = await this.findJavaFiles(folderPath);
            console.log(`Encontrados ${javaFiles.length} arquivos Java para análise`);
            
            const results = {
                totalFiles: javaFiles.length,
                filesWithErrors: 0,
                totalIssues: 0,
                files: []
            };

            for (const filePath of javaFiles) {
                console.log(`Analisando: ${filePath}`);
                const fileAnalysis = await this.analyzeFile(filePath);
                
                if (fileAnalysis.issues.length > 0) {
                    results.filesWithErrors++;
                    results.totalIssues += fileAnalysis.issues.length;
                    console.log(`${fileAnalysis.issues.length} problemas encontrados em ${filePath}`);
                }
                
                results.files.push(fileAnalysis);
            }

            console.log('Resultado final:', results);
            return results;
        } catch (error) {
            console.error('Erro na análise:', error);
            throw new Error(`Erro ao analisar pasta: ${error.message}`);
        }
    }

    async findJavaFiles(folderPath) {
        const javaFiles = [];
        
        async function scanDirectory(dir) {
            try {
                const items = await fs.readdir(dir);
                
                for (const item of items) {
                    const fullPath = path.join(dir, item);
                    
                    try {
                        const stat = await fs.stat(fullPath);
                        
                        if (stat.isDirectory()) {
                            // Pular diretórios comuns que não contêm código fonte
                            if (!['node_modules', '.git', 'target', 'build', 'dist'].includes(item)) {
                                await scanDirectory(fullPath);
                            }
                        } else if (item.toLowerCase().endsWith('.java')) {
                            javaFiles.push(fullPath);
                        }
                    } catch (statError) {
                        console.warn(`Erro ao acessar ${fullPath}:`, statError.message);
                    }
                }
            } catch (readError) {
                console.warn(`Erro ao ler diretório ${dir}:`, readError.message);
            }
        }
        
        await scanDirectory(folderPath);
        return javaFiles;
    }

    async analyzeFile(filePath) {
        try {
            const content = await fs.readFile(filePath, 'utf8');
            const lines = content.split('\n');
            const issues = [];

            for (let i = 0; i < lines.length; i++) {
                const line = lines[i];
                const lineNumber = i + 1;

                // Verificar indentação
                if (this.rules.indentation) {
                    const indentationIssue = this.checkIndentation(line, lineNumber);
                    if (indentationIssue) {
                        issues.push(indentationIssue);
                    }
                }

                // Verificar comentários inadequados
                if (this.rules.comments) {
                    const commentIssue = this.checkComments(line, lineNumber);
                    if (commentIssue) {
                        issues.push(commentIssue);
                    }
                }

                // Verificar estruturas sem chaves
                if (this.rules.braces) {
                    const braceIssue = this.checkBraces(line, lines, i);
                    if (braceIssue) {
                        issues.push({...braceIssue, line: lineNumber});
                    }
                }

                // Verificações gerais
                if (this.rules.general) {
                    const generalIssues = this.checkGeneral(line, lineNumber);
                    issues.push(...generalIssues);
                }
            }

            return {
                path: filePath,
                issues: issues
            };
        } catch (error) {
            console.error(`Erro ao analisar arquivo ${filePath}:`, error.message);
            return {
                path: filePath,
                issues: [{
                    type: 'general',
                    line: 1,
                    message: `Erro ao ler arquivo: ${error.message}`,
                    suggestion: 'Verifique se o arquivo não está corrompido e possui permissões adequadas.'
                }]
            };
        }
    }

    checkIndentation(line, lineNumber) {
        // Pular linhas vazias
        if (line.trim().length === 0) return null;

        // Verificar se a linha tem espaços e tabs misturados
        if (line.includes('\t') && line.match(/^ +/)) {
            return {
                type: 'indentation',
                line: lineNumber,
                message: 'Mistura de tabs e espaços para indentação detectada.',
                suggestion: 'Use apenas espaços ou apenas tabs para indentação, não misture os dois.'
            };
        }

        // Verificar indentação inconsistente (múltiplos de 2 ou 4 espaços)
        const leadingSpaces = line.match(/^ */)[0].length;
        if (leadingSpaces > 0 && leadingSpaces % 4 !== 0 && leadingSpaces % 2 !== 0) {
            return {
                type: 'indentation',
                line: lineNumber,
                message: `Indentação inconsistente: ${leadingSpaces} espaços.`,
                suggestion: 'Use indentação de 2 ou 4 espaços de forma consistente.'
            };
        }

        return null;
    }

    checkComments(line, lineNumber) {
        const trimmed = line.trim();
        
        // Verificar comentários no final de linhas com código
        if (trimmed.includes('//') && !trimmed.startsWith('//')) {
            const codeBeforeComment = trimmed.substring(0, trimmed.indexOf('//')).trim();
            if (codeBeforeComment.length > 0) {
                return {
                    type: 'comments',
                    line: lineNumber,
                    message: 'Comentário inline pode afetar a legibilidade do código.',
                    suggestion: 'Considere mover o comentário para uma linha separada acima do código.'
                };
            }
        }

        // Verificar comentários TODO ou FIXME em produção
        if (trimmed.match(/(TODO|FIXME|XXX|HACK|BUG)/i)) {
            return {
                type: 'comments',
                line: lineNumber,
                message: 'Comentário de desenvolvimento encontrado (TODO/FIXME/XXX/HACK/BUG).',
                suggestion: 'Remova ou resolva comentários de desenvolvimento antes do deploy em produção.'
            };
        }

        return null;
    }

    checkBraces(line, lines, index) {
        const trimmed = line.trim();
        
        // Verificar if/else/while/for sem chaves
        const controlStructures = /^(if|else\s+if|while|for)\s*\([^)]*\)\s*$/;
        const elseStructure = /^else\s*$/;
        
        if (controlStructures.test(trimmed) || elseStructure.test(trimmed)) {
            const nextLineIndex = index + 1;
            if (nextLineIndex < lines.length) {
                const nextLine = lines[nextLineIndex].trim();
                // Se a próxima linha não é uma chave de abertura e não está vazia
                if (!nextLine.startsWith('{') && nextLine.length > 0 && !nextLine.startsWith('//') && !nextLine.startsWith('/*')) {
                    return {
                        type: 'braces',
                        message: `Estrutura de controle sem chaves detectada: ${trimmed}`,
                        suggestion: 'Sempre use chaves {} para estruturas de controle, mesmo para uma linha única.'
                    };
                }
            }
        }

        // Verificar else if malformado
        if (trimmed.match(/^else\s*\{\s*if/)) {
            return {
                type: 'braces',
                message: 'Estrutura else-if malformada detectada.',
                suggestion: 'Use "else if" em vez de "else { if".'
            };
        }

        return null;
    }

    checkGeneral(line, lineNumber) {
        const issues = [];
        const trimmed = line.trim();
        
        // Verificar linhas muito longas (>120 caracteres)
        if (line.length > 120) {
            issues.push({
                type: 'general',
                line: lineNumber,
                message: `Linha muito longa: ${line.length} caracteres (recomendado máximo 120).`,
                suggestion: 'Quebre a linha em múltiplas linhas para melhor legibilidade.'
            });
        }

        // Verificar espaços em branco no final da linha
        if (line.endsWith(' ') || line.endsWith('\t')) {
            issues.push({
                type: 'general',
                line: lineNumber,
                message: 'Espaços em branco no final da linha detectados.',
                suggestion: 'Remova espaços em branco desnecessários no final das linhas.'
            });
        }

        // Verificar System.out.println em código
        if (trimmed.includes('System.out.print')) {
            issues.push({
                type: 'general',
                line: lineNumber,
                message: 'System.out.println encontrado no código.',
                suggestion: 'Use um sistema de logging apropriado em vez de System.out.println para produção.'
            });
        }

        // Verificar uso de printStackTrace()
        if (trimmed.includes('printStackTrace()')) {
            issues.push({
                type: 'general',
                line: lineNumber,
                message: 'printStackTrace() encontrado no código.',
                suggestion: 'Use um sistema de logging apropriado em vez de printStackTrace() para produção.'
            });
        }

        return issues;
    }
}

module.exports = JavaAnalyzer;