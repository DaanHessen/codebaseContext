import * as fs from 'fs/promises';
import * as path from 'path';
import { formatCode } from './utils/helpers';

interface SelectiveContextOptions {
    maxFileSizeKB: number;
    headerTemplate: string;
    workspacePath: string;
}

export async function generateSelectiveContext(
    files: string[],
    options: SelectiveContextOptions
): Promise<string> {
    const { maxFileSizeKB, headerTemplate, workspacePath } = options;

    // Generate header
    const header = generateHeader(headerTemplate, workspacePath);

    // Generate content for each file
    const fileContents = await Promise.all(
        files.map(async file => {
            try {
                const stats = await fs.stat(file);
                
                // Skip files that are too large
                if (stats.size > maxFileSizeKB * 1024) {
                    return `\n### ${path.relative(workspacePath, file)}\nFile exceeds size limit (${Math.round(stats.size / 1024)}KB > ${maxFileSizeKB}KB)`;
                }

                const content = await fs.readFile(file, 'utf-8');
                const relativePath = path.relative(workspacePath, file);
                const extension = path.extname(file).slice(1);

                return `\n### ${relativePath}\n\`\`\`${extension}\n${content}\n\`\`\``;
            } catch (error) {
                console.error(`Error processing file ${file}:`, error);
                return `\n### ${path.relative(workspacePath, file)}\nError: Failed to read file`;
            }
        })
    );

    // Generate file list
    const fileList = files
        .map(file => `- ${path.relative(workspacePath, file)}`)
        .join('\n');

    // Combine all parts
    return [
        header,
        '\n## Selected Files\n' + fileList,
        '\n## File Contents',
        ...fileContents
    ].join('\n');
}

function generateHeader(template: string, workspacePath: string): string {
    const projectName = path.basename(workspacePath);
    const date = new Date().toISOString();

    return template
        .replace('{projectName}', projectName)
        .replace('{date}', date)
        .replace('{workspacePath}', workspacePath);
} 