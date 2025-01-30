import * as path from 'path';
import * as vscode from 'vscode';
import minimatch from 'minimatch';

export function shouldExcludeFile(filePath: string, excludePatterns: string[]): boolean {
    const normalizedPath = filePath.replace(/\\/g, '/');
    const fileName = path.basename(normalizedPath);
    
    return excludePatterns.some(pattern => {
        pattern = pattern.replace(/\\/g, '/');
        
        if (!pattern.includes('/')) {
            return minimatch(fileName, pattern, { dot: true });
        }
        
        if (!pattern.endsWith('/**') && !pattern.includes('.')) {
            pattern = `${pattern}/**`;
        }
        
        return minimatch(normalizedPath, pattern, { dot: true });
    });
}

export function formatCode(code: string, language: string): string {
    try {
        const config = vscode.workspace.getConfiguration('editor', { languageId: language });
        const useSpaces = config.get<boolean>('insertSpaces', true);
        const tabSize = config.get<number>('tabSize', 4);
        
        const lines = code.split('\n');
        let indentLevel = 0;
        
        const formattedLines = lines.map(line => {
            const trimmedLine = line.trim();
            
            if (trimmedLine.endsWith('{')) {
                const currentIndent = getIndent(indentLevel, useSpaces, tabSize);
                indentLevel++;
                return currentIndent + trimmedLine;
            } else if (trimmedLine.startsWith('}')) {
                indentLevel = Math.max(0, indentLevel - 1);
                return getIndent(indentLevel, useSpaces, tabSize) + trimmedLine;
            } else {
                return getIndent(indentLevel, useSpaces, tabSize) + trimmedLine;
            }
        });

        return formattedLines.join('\n');
    } catch (error) {
        console.error('Error formatting code:', error);
        return code;
    }
}

function getIndent(level: number, useSpaces: boolean, tabSize: number): string {
    if (useSpaces) {
        return ' '.repeat(level * tabSize);
    }
    return '\t'.repeat(level);
}

export function getLanguageId(fileName: string): string {
    const ext = path.extname(fileName).toLowerCase();
    
    const languageMap: { [key: string]: string } = {
        '.js': 'javascript',
        '.ts': 'typescript',
        '.jsx': 'javascriptreact',
        '.tsx': 'typescriptreact',
        '.py': 'python',
        '.java': 'java',
        '.cpp': 'cpp',
        '.c': 'c',
        '.h': 'c',
        '.hpp': 'cpp',
        '.cs': 'csharp',
        '.go': 'go',
        '.rs': 'rust',
        '.php': 'php',
        '.rb': 'ruby',
        '.swift': 'swift',
        '.kt': 'kotlin',
        '.scala': 'scala',
        '.html': 'html',
        '.css': 'css',
        '.scss': 'scss',
        '.less': 'less',
        '.json': 'json',
        '.xml': 'xml',
        '.yaml': 'yaml',
        '.yml': 'yaml',
        '.md': 'markdown',
        '.sh': 'shellscript',
        '.bash': 'shellscript',
        '.ps1': 'powershell',
        '.sql': 'sql',
        '.vue': 'vue',
        '.svelte': 'svelte',
        '.dart': 'dart',
        '.graphql': 'graphql',
        '.proto': 'protobuf'
    };

    return languageMap[ext] || 'plaintext';
} 