import * as vscode from 'vscode';
import * as fs from 'fs/promises';
import * as path from 'path';
import { getFileTree } from './utils/fileTree';
import { shouldExcludeFile, formatCode } from './utils/helpers';

interface ContextOptions {
    excludePatterns: string[];
    maxFileSizeKB: number;
    headerTemplate: string;
    useRelativePaths: boolean;
    onProgress?: (progress: number, status: string) => void;
}

export async function generateContext(
    workspacePath: string,
    options: ContextOptions,
    cancellationToken?: vscode.CancellationToken
): Promise<string> {
    const {
        excludePatterns,
        maxFileSizeKB,
        headerTemplate,
        useRelativePaths,
        onProgress
    } = options;

    // Get file tree first
    const fileTree = await getFileTree(workspacePath, excludePatterns);

    // Get all files
    const files = await getAllFiles(workspacePath, excludePatterns, progress => {
        onProgress?.(progress * 0.3, 'Scanning files...');
    }, cancellationToken);

    // Process files
    let processedFiles = 0;
    const totalFiles = files.length;
    const contents: string[] = [];

    for (const file of files) {
        // Check for cancellation
        if (cancellationToken?.isCancellationRequested) {
            throw new vscode.CancellationError();
        }

        try {
            const stats = await fs.stat(file);
            const fileSizeKB = stats.size / 1024;

            if (fileSizeKB > maxFileSizeKB) {
                const displayPath = useRelativePaths ? path.relative(workspacePath, file) : file;
                contents.push(`\n### ${displayPath}\nFile exceeds size limit (${Math.round(fileSizeKB)}KB > ${maxFileSizeKB}KB)`);
                continue;
            }

            const content = await fs.readFile(file, 'utf-8');
            const displayPath = useRelativePaths ? path.relative(workspacePath, file) : file;
            const extension = path.extname(file).slice(1);
            contents.push(`\n### ${displayPath}\n\`\`\`${extension}\n${content}\n\`\`\``);

            processedFiles++;
            onProgress?.(0.3 + (processedFiles / totalFiles * 0.7), `Processing files (${processedFiles}/${totalFiles})...`);
        } catch (error) {
            console.error(`Error processing file ${file}:`, error);
            const displayPath = useRelativePaths ? path.relative(workspacePath, file) : file;
            contents.push(`\n### ${displayPath}\nError: Failed to read file`);
        }
    }

    // Combine all content sections
    const contentSection = contents.join('\n');

    // Generate header with all components
    return generateHeader(headerTemplate, workspacePath, useRelativePaths, fileTree, contentSection);
}

function generateHeader(
    template: string, 
    workspacePath: string, 
    useRelativePaths: boolean,
    fileTree: string,
    content: string
): string {
    const projectName = path.basename(workspacePath);
    const date = new Date().toISOString();
    const displayPath = useRelativePaths ? '.' : workspacePath;

    // Replace all template variables
    return template
        .replace('{projectName}', projectName)
        .replace('{date}', date)
        .replace('{workspacePath}', displayPath)
        .replace('{fileTree}', fileTree)
        .replace('{content}', content);
}

async function getAllFiles(
    dir: string,
    excludePatterns: string[],
    onProgress?: (scanned: number) => void,
    cancellationToken?: vscode.CancellationToken
): Promise<string[]> {
    const files: string[] = [];
    let scanned = 0;

    async function scan(directory: string): Promise<void> {
        // Check for cancellation
        if (cancellationToken?.isCancellationRequested) {
            throw new vscode.CancellationError();
        }

        const entries = await fs.readdir(directory, { withFileTypes: true });
        
        for (const entry of entries) {
            const fullPath = path.join(directory, entry.name);
            scanned++;
            
            if (scanned % 100 === 0) {
                onProgress?.(Math.min(1, scanned / 1000));
            }

            if (shouldExcludeFile(fullPath, excludePatterns)) {
                continue;
            }

            if (entry.isDirectory()) {
                await scan(fullPath);
            } else {
                files.push(fullPath);
            }
        }
    }

    await scan(dir);
    return files.sort();
} 