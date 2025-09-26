const fs = require('fs-extra');
const path = require('path');
const RulesEngine = require('./rules-engine');

class AdvancedJavaAnalyzer {
    constructor() {
        this.rulesEngine = new RulesEngine();
        this.fileStats = {};
    }

    async analyzeFolder(folderPath) {
        try {
            const javaFiles = await this.findJavaFiles(folderPath);
            console.log(`🔍 Analisando ${javaFiles.length} arquivos Java...`);
            
            const results = {
                totalFiles: javaFiles.length,
                filesWithErrors: 0,
                totalIssues: 0,
                issuesBySeverity: { blocker: 0, critical: 0, major: 0, minor: 0, info: 0 },
                issuesByCategory: {},
                files: [],
                summary: {
                    duplicatedCodeBlocks: 0,
                    averageMethodComplexity: 0,
                    technicalDebt: '0h'
                }
            };

            // Inicializar contadores por categoria
            const rulesConfig = this.rulesEngine.getRulesConfig();
            Object.keys(rulesConfig).forEach(category => {
                results.issuesByCategory[category] = 0;
            });

            for (const filePath of javaFiles) {
                const fileAnalysis = await this.analyzeFile(filePath);
                
                if (fileAnalysis.issues.length > 0) {
                    results.filesWithErrors++;
                    results.totalIssues += fileAnalysis.issues.length;
                    
                    // Contar por severidade e categoria
                    fileAnalysis.issues.forEach(issue => {
                        results.issuesBySeverity[issue.severity]++;
                        results.issuesByCategory[issue.category]++;
                    });
                }
                
                results.files.push(fileAnalysis);
            }

            // Calcular métricas avançadas
            results.summary = this.calculateSummaryMetrics(results);
            
            return results;
        } catch (error) {
            throw new Error(`Erro ao analisar pasta: ${error.message}`);
        }
    }

    async analyzeFile(filePath) {
        try {
            const content = await fs.readFile(filePath, 'utf8');
            const lines = content.split('\n');
            const issues = [];

            // Estatísticas do arquivo
            const fileStats = this.analyzeFileStructure(content, lines);
            
            for (let i = 0; i < lines.length; i++) {
                const line = lines[i];
                const lineNumber = i + 1;

                // Aplicar todas as regras
                issues.push(...this.applyCodingStandardsRules(line, lineNumber, lines, i));
                issues.push(...this.applyCodeSmellsRules(line, lineNumber, lines, i, fileStats));
                issues.push(...this.applyProductionReadinessRules(line, lineNumber));
                issues.push(...this.applyPerformanceRules(line, lineNumber, lines, i));
                issues.push(...this.applySecurityRules(line, lineNumber));
            }

            // Análises de arquivo completo
            issues.push(...this.analyzeFileLevel(content, filePath, fileStats));

            return {
                path: filePath,
                issues: issues.filter(issue => issue !== null),
                stats: fileStats
            };
        } catch (error) {
            return {
                path: filePath,
                issues: [{
                    type: 'file-error',
                    category: 'general',
                    severity: 'major',
                    line: 1,
                    message: `Erro ao analisar arquivo: ${error.message}`,
                    suggestion: 'Verifique se o arquivo não está corrompido.'
                }],
                stats: {}
            };
        }
    }

    applyCodingStandardsRules(line, lineNumber, lines, index) {
        const issues = [];
        const config = this.rulesEngine.getRulesConfig().codingStandards;
        
        if (!config.enabled) return issues;

        // Regra: Indentação
        if (config.rules.indentation.enabled) {
            const indentationIssue = this.checkIndentation(line, lineNumber);
            if (indentationIssue) {
                issues.push({
                    ...indentationIssue,
                    category: 'codingStandards',
                    severity: config.rules.indentation.severity
                });
            }
        }

        // Regra: Chaves obrigatórias
        if (config.rules.braces.enabled) {
            const braceIssue = this.checkBraces(line, lines, index);
            if (braceIssue) {
                issues.push({
                    ...braceIssue,
                    line: lineNumber,
                    category: 'codingStandards',
                    severity: config.rules.braces.severity
                });
            }
        }

        // Regra: Comprimento de linha
        if (config.rules.lineLength.enabled && line.length > config.rules.lineLength.maxLength) {
            issues.push({
                type: 'line-length',
                category: 'codingStandards',
                severity: config.rules.lineLength.severity,
                line: lineNumber,
                message: `Linha muito longa: ${line.length} caracteres (máximo ${config.rules.lineLength.maxLength})`,
                suggestion: 'Quebre a linha em múltiplas linhas para melhor legibilidade.'
            });
        }

        return issues;
    }

    applyCodeSmellsRules(line, lineNumber, lines, index, fileStats) {
        const issues = [];
        const config = this.rulesEngine.getRulesConfig().codeSmells;
        
        if (!config.enabled) return issues;

        // Regra: Métodos muito longos
        if (config.rules.longMethods.enabled) {
            const methodIssue = this.checkLongMethods(line, lineNumber, fileStats);
            if (methodIssue) {
                issues.push({
                    ...methodIssue,
                    category: 'codeSmells',
                    severity: config.rules.longMethods.severity
                });
            }
        }

        // Regra: Complexidade ciclomática
        if (config.rules.complexMethods.enabled) {
            const complexityIssue = this.checkMethodComplexity(line, lineNumber, lines, index);
            if (complexityIssue) {
                issues.push({
                    ...complexityIssue,
                    category: 'codeSmells',
                    severity: config.rules.complexMethods.severity
                });
            }
        }

        return issues;
    }

    applyProductionReadinessRules(line, lineNumber) {
        const issues = [];
        const config = this.rulesEngine.getRulesConfig().productionReadiness;
        
        if (!config.enabled) return issues;

        const trimmed = line.trim();

        // Regra: Código de debug
        if (config.rules.debugCode.enabled) {
            if (trimmed.includes('System.out.print') || trimmed.includes('printStackTrace()') || trimmed.includes('console.log')) {
                issues.push({
                    type: 'debug-code',
                    category: 'productionReadiness',
                    severity: config.rules.debugCode.severity,
                    line: lineNumber,
                    message: 'Código de debug encontrado',
                    suggestion: 'Use um sistema de logging apropriado para produção.'
                });
            }
        }

        // Regra: Comentários TODO/FIXME
        if (config.rules.todoComments.enabled) {
            if (trimmed.match(/(TODO|FIXME|XXX|HACK|BUG)/i)) {
                issues.push({
                    type: 'todo-comment',
                    category: 'productionReadiness',
                    severity: config.rules.todoComments.severity,
                    line: lineNumber,
                    message: 'Comentário de desenvolvimento encontrado',
                    suggestion: 'Resolva ou remova antes do deploy em produção.'
                });
            }
        }

        // Regra: Valores hardcoded
        if (config.rules.hardcodedValues.enabled) {
            const hardcodedIssue = this.checkHardcodedValues(line, lineNumber);
            if (hardcodedIssue) {
                issues.push({
                    ...hardcodedIssue,
                    category: 'productionReadiness',
                    severity: config.rules.hardcodedValues.severity
                });
            }
        }

        return issues;
    }

    applyPerformanceRules(line, lineNumber, lines, index) {
        const issues = [];
        const config = this.rulesEngine.getRulesConfig().performance;
        
        if (!config.enabled) return issues;

        const trimmed = line.trim();

        // Regra: Concatenação de strings ineficiente
        if (config.rules.stringConcatenation.enabled) {
            if (trimmed.includes('+') && trimmed.includes('"') && this.isInLoop(lines, index)) {
                issues.push({
                    type: 'string-concatenation',
                    category: 'performance',
                    severity: config.rules.stringConcatenation.severity,
                    line: lineNumber,
                    message: 'Concatenação de string ineficiente dentro de loop',
                    suggestion: 'Use StringBuilder para concatenações em loops.'
                });
            }
        }

        return issues;
    }

    applySecurityRules(line, lineNumber) {
        const issues = [];
        const config = this.rulesEngine.getRulesConfig().security;
        
        if (!config.enabled) return issues;

        const trimmed = line.trim();

        // Regra: Possível SQL Injection
        if (config.rules.sqlInjection.enabled) {
            if (trimmed.includes('SELECT') && trimmed.includes('+') && (trimmed.includes('"') || trimmed.includes("'"))) {
                issues.push({
                    type: 'sql-injection',
                    category: 'security',
                    severity: config.rules.sqlInjection.severity,
                    line: lineNumber,
                    message: 'Possível vulnerabilidade de SQL Injection',
                    suggestion: 'Use PreparedStatement para consultas SQL.'
                });
            }
        }

        // Regra: Senhas hardcoded
        if (config.rules.hardcodedPasswords.enabled) {
            if (trimmed.match(/(password|senha|pwd)\s*=\s*["|'].+["|']/i)) {
                issues.push({
                    type: 'hardcoded-password',
                    category: 'security',
                    severity: config.rules.hardcodedPasswords.severity,
                    line: lineNumber,
                    message: 'Senha hardcoded detectada',
                    suggestion: 'Use variáveis de ambiente ou cofres de senhas.'
                });
            }
        }

        return issues;
    }

    // Métodos auxiliares expandidos
    analyzeFileStructure(content, lines) {
        return {
            totalLines: lines.length,
            methodCount: (content.match(/\b(public|private|protected)\s+[\w<>\[\]]+\s+\w+\s*\(/g) || []).length,
            classCount: (content.match(/\bclass\s+\w+/g) || []).length,
            imports: (content.match(/^import\s+/gm) || []).length
        };
    }

    checkHardcodedValues(line, lineNumber) {
        const trimmed = line.trim();
        
        // Detectar números mágicos (exceto 0, 1, -1)
        const magicNumbers = trimmed.match(/\b(?!0\b|1\b|-1\b)\d{2,}\b/g);
        if (magicNumbers && !trimmed.includes('//')) {
            return {
                type: 'magic-number',
                line: lineNumber,
                message: `Número mágico detectado: ${magicNumbers[0]}`,
                suggestion: 'Use constantes nomeadas para valores numéricos específicos.'
            };
        }

        return null;
    }

    checkLongMethods(line, lineNumber, fileStats) {
        // Implementação simplificada - detectar métodos longos
        if (line.includes('public') && line.includes('(') && line.includes(')')) {
            if (fileStats.totalLines > 200) { // Método aproximado
                return {
                    type: 'long-method',
                    line: lineNumber,
                    message: 'Método possivelmente muito longo',
                    suggestion: 'Considere quebrar este método em métodos menores.'
                };
            }
        }
        return null;
    }

    checkMethodComplexity(line, lineNumber, lines, index) {
        // Contar estruturas condicionais
        const complexityKeywords = ['if', 'else if', 'for', 'while', 'switch', 'case', 'catch'];
        const trimmed = line.trim();
        
        if (complexityKeywords.some(keyword => trimmed.startsWith(keyword))) {
            // Implementação simplificada
            return null; // Expandir conforme necessário
        }
        
        return null;
    }

    isInLoop(lines, currentIndex) {
        // Verificar se está dentro de um loop
        for (let i = Math.max(0, currentIndex - 20); i < currentIndex; i++) {
            if (lines[i].trim().match(/\b(for|while)\s*\(/)) {
                return true;
            }
        }
        return false;
    }

    calculateSummaryMetrics(results) {
        const totalIssues = results.totalIssues;
        const blockerIssues = results.issuesBySeverity.blocker;
        const criticalIssues = results.issuesBySeverity.critical;
        
        // Calcular dívida técnica estimada (em horas)
        const debtHours = (blockerIssues * 2) + (criticalIssues * 1) + (results.issuesBySeverity.major * 0.5);
        
        return {
            duplicatedCodeBlocks: 0, // Implementar depois
            averageMethodComplexity: 0, // Implementar depois
            technicalDebt: `${Math.round(debtHours)}h ${Math.round((debtHours % 1) * 60)}min`,
            qualityGate: blockerIssues === 0 && criticalIssues < 5 ? 'PASSED' : 'FAILED'
        };
    }

    // Métodos existentes mantidos
    checkIndentation(line, lineNumber) {
        if (line.trim().length === 0) return null;

        if (line.includes('\t') && line.match(/^ +/)) {
            return {
                type: 'indentation',
                line: lineNumber,
                message: 'Mistura de tabs e espaços para indentação detectada.',
                suggestion: 'Use apenas espaços ou apenas tabs para indentação.'
            };
        }

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

    checkBraces(line, lines, index) {
        const trimmed = line.trim();
        
        if (trimmed.match(/^(if|else if|else|while|for)\s*\(.*\)\s*$/) || trimmed.match(/^(else)\s*$/)) {
            const nextLineIndex = index + 1;
            if (nextLineIndex < lines.length) {
                const nextLine = lines[nextLineIndex].trim();
                if (!nextLine.startsWith('{') && nextLine.length > 0 && !nextLine.startsWith('//')) {
                    return {
                        type: 'braces',
                        message: `Estrutura de controle sem chaves: ${trimmed}`,
                        suggestion: 'Sempre use chaves {} para estruturas de controle.'
                    };
                }
            }
        }

        return null;
    }

    analyzeFileLevel(content, filePath, fileStats) {
        const issues = [];
        const config = this.rulesEngine.getRulesConfig();

        // Verificar se classe é muito grande
        if (config.codeSmells.enabled && config.codeSmells.rules.largeClasses.enabled) {
            if (fileStats.totalLines > config.codeSmells.rules.largeClasses.maxLines) {
                issues.push({
                    type: 'large-class',
                    category: 'codeSmells',
                    severity: config.codeSmells.rules.largeClasses.severity,
                    line: 1,
                    message: `Classe muito grande: ${fileStats.totalLines} linhas`,
                    suggestion: 'Considere dividir esta classe em classes menores.'
                });
            }
        }

        return issues;
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
}

module.exports = AdvancedJavaAnalyzer;