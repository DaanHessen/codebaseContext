import * as fs from 'fs/promises';
import * as path from 'path';
import { shouldExcludeFile } from './helpers';

interface TreeNode {
    name: string;
    children: TreeNode[];
    isFile: boolean;
}

export async function getFileTree(
    rootPath: string,
    excludePatterns: string[]
): Promise<string> {
    const tree = await buildTree(rootPath, excludePatterns);
    return renderTree(tree, '', true);
}

async function buildTree(
    dirPath: string,
    excludePatterns: string[]
): Promise<TreeNode> {
    const name = path.basename(dirPath);
    const children: TreeNode[] = [];
    const entries = await fs.readdir(dirPath, { withFileTypes: true });

    // Sort entries: directories first, then files, both alphabetically
    const sortedEntries = entries.sort((a, b) => {
        if (a.isDirectory() === b.isDirectory()) {
            return a.name.localeCompare(b.name);
        }
        return b.isDirectory() ? 1 : -1;
    });

    for (const entry of sortedEntries) {
        const fullPath = path.join(dirPath, entry.name);
        
        if (shouldExcludeFile(fullPath, excludePatterns)) {
            continue;
        }

        if (entry.isDirectory()) {
            children.push(await buildTree(fullPath, excludePatterns));
        } else {
            children.push({
                name: entry.name,
                children: [],
                isFile: true
            });
        }
    }

    return {
        name,
        children,
        isFile: false
    };
}

function renderTree(
    node: TreeNode,
    prefix: string,
    isLast: boolean
): string {
    const marker = isLast ? '└── ' : '├── ';
    const childPrefix = isLast ? '    ' : '│   ';
    
    let result = prefix + marker + node.name + '\n';

    for (let i = 0; i < node.children.length; i++) {
        const child = node.children[i];
        const isLastChild = i === node.children.length - 1;
        result += renderTree(child, prefix + childPrefix, isLastChild);
    }

    return result;
} 