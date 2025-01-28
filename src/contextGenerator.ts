import * as vscode from 'vscode';
import * as fs from 'fs/promises';
import * as path from 'path';
import { getFileTree } from './utils/fileTree';
import { shouldExcludeFile, formatCode } from './utils/helpers';

interface ContextOptions {
    excludePatterns: string[];
    maxFileSizeKB: number;
    headerTemplate: string;
    onProgress?: (progress: number, status: string) => void;
}

export async function generateContext(
    workspacePath: string,
    options: ContextOptions
): Promise<string> {
    const { excludePatterns, maxFileSizeKB, headerTemplate, onProgress } = options;

    try {
        // Generate header
        onProgress?.(0, 'Generating header...');
        const header = generateHeader(headerTemplate, workspacePath);

        // Get all files (with exclusions)
        onProgress?.(10, 'Scanning workspace...');
        const files = await getAllFiles(workspacePath, excludePatterns, (scanned) => {
            onProgress?.(10 + (scanned * 0.2), 'Scanning workspace...');
        });

        // Generate file tree (using already filtered files)
        onProgress?.(30, 'Generating file tree...');
        const fileTree = await getFileTree(workspacePath, excludePatterns);

        // Process files in batches for better performance
        onProgress?.(40, 'Processing files...');
        const batchSize = 10;
        const fileContents: string[] = [];
        const totalFiles = files.length;

        for (let i = 0; i < files.length; i += batchSize) {
            const batch = files.slice(i, i + batchSize);
            const batchResults = await Promise.all(
                batch.map(async (file) => {
                    try {
                        const stats = await fs.stat(file);
                        const relativePath = path.relative(workspacePath, file);

                        // Skip files that are too large
                        if (stats.size > maxFileSizeKB * 1024) {
                            return `\n### ${relativePath}\nFile exceeds size limit (${Math.round(stats.size / 1024)}KB > ${maxFileSizeKB}KB)`;
                        }

                        const content = await fs.readFile(file, 'utf-8');
                        const extension = path.extname(file).slice(1);

                        return `\n### ${relativePath}\n\`\`\`${extension}\n${content}\n\`\`\``;
                    } catch (error) {
                        console.error(`Error processing file ${file}:`, error);
                        return `\n### ${path.relative(workspacePath, file)}\nError: Failed to read file`;
                    }
                })
            );

            fileContents.push(...batchResults);
            const progress = 40 + ((i + batch.length) / totalFiles * 50);
            onProgress?.(progress, `Processing files (${i + batch.length}/${totalFiles})...`);
        }

        onProgress?.(90, 'Finalizing context...');

        // Combine all parts
        const result = [
            header,
            '\n## File Structure\n```\n' + fileTree + '\n```',
            '\n## Files',
            ...fileContents
        ].join('\n');

        onProgress?.(100, 'Complete!');
        return result;
    } catch (error) {
        console.error('Error generating context:', error);
        throw error;
    }
}

async function getAllFiles(
    dir: string,
    excludePatterns: string[],
    onProgress?: (scanned: number) => void
): Promise<string[]> {
    const files: string[] = [];
    let scanned = 0;

    async function scan(directory: string): Promise<void> {
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

function generateHeader(template: string, workspacePath: string): string {
    const projectName = path.basename(workspacePath);
    const date = new Date().toISOString();

    return template
        .replace('{projectName}', projectName)
        .replace('{date}', date)
        .replace('{workspacePath}', workspacePath);
} 