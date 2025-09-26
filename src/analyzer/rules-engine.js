class RulesEngine {
    constructor() {
        this.ruleCategories = {
            codingStandards: {
                name: 'Padrões de Codificação',
                enabled: true,
                icon: '📐',
                rules: {
                    indentation: { enabled: true, severity: 'major' },
                    braces: { enabled: true, severity: 'major' },
                    lineLength: { enabled: true, severity: 'minor', maxLength: 120 }
                }
            },
            codeSmells: {
                name: 'Code Smells',
                enabled: true,
                icon: '🦨',
                rules: {
                    longMethods: { enabled: true, severity: 'major', maxLines: 30 },
                    complexMethods: { enabled: true, severity: 'major', maxComplexity: 10 },
                    duplicatedCode: { enabled: true, severity: 'minor' },
                    largeClasses: { enabled: true, severity: 'major', maxLines: 200 }
                }
            },
            productionReadiness: {
                name: 'Preparação para Produção',
                enabled: true,
                icon: '🚀',
                rules: {
                    debugCode: { enabled: true, severity: 'blocker' },
                    todoComments: { enabled: true, severity: 'info' },
                    hardcodedValues: { enabled: true, severity: 'major' },
                    exceptionHandling: { enabled: true, severity: 'critical' }
                }
            },
            performance: {
                name: 'Performance',
                enabled: true,
                icon: '⚡',
                rules: {
                    stringConcatenation: { enabled: true, severity: 'minor' },
                    unnecessaryLoops: { enabled: true, severity: 'major' },
                    resourceLeaks: { enabled: true, severity: 'critical' }
                }
            },
            security: {
                name: 'Segurança',
                enabled: true,
                icon: '🔒',
                rules: {
                    sqlInjection: { enabled: true, severity: 'blocker' },
                    hardcodedPasswords: { enabled: true, severity: 'blocker' },
                    unsafeDeserialization: { enabled: true, severity: 'critical' }
                }
            }
        };
    }

    getSeverityLevel(severity) {
        const levels = {
            info: { level: 1, color: '#17a2b8', icon: 'ℹ️' },
            minor: { level: 2, color: '#28a745', icon: '⚠️' },
            major: { level: 3, color: '#ffc107', icon: '⚠️' },
            critical: { level: 4, color: '#fd7e14', icon: '🚨' },
            blocker: { level: 5, color: '#dc3545', icon: '🔴' }
        };
        return levels[severity] || levels.minor;
    }

    getRulesConfig() {
        return this.ruleCategories;
    }

    updateRuleConfig(category, rule, config) {
        if (this.ruleCategories[category] && this.ruleCategories[category].rules[rule]) {
            this.ruleCategories[category].rules[rule] = { ...this.ruleCategories[category].rules[rule], ...config };
        }
    }
}

module.exports = RulesEngine;