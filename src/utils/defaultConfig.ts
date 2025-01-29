export const DEFAULT_GLOBAL_EXCLUSIONS = [
    // Dependencies and package management
    'node_modules',
    'vendor',
    'packages',
    'bower_components',
    'jspm_packages',
    
    // Version control
    '.git',
    '.svn',
    '.hg',
    '.bzr',
    
    // Build outputs and caches
    'dist',
    'build',
    'out',
    'bin',
    'obj',
    '.next',
    '.nuxt',
    '.output',
    'target',
    '.cache',
    '__pycache__',
    '.pyc',
    
    // IDE and editor files
    '.idea',
    '.vscode',
    '.vs',
    '.swp',
    '.~',
    
    // Lock files and checksums
    '.lock',
    'package-lock.json',
    'yarn.lock',
    'composer.lock',
    '.sum',
    
    // System files
    '.DS_Store',
    'Thumbs.db',
    
    // License
    'LICENSE*',

    
    // Binary files
    '.exe',
];

export const DEFAULT_HEADER_TEMPLATE = `# {projectName}
Generated on: {date}
Workspace: {workspacePath}

## File Structure
{fileTree}

## Files
{content}`;

export async function resetConfiguration(vscode: any) {
    const config = vscode.workspace.getConfiguration('codebaseContext');
    await config.update('projectExclusions', [], vscode.ConfigurationTarget.Workspace);
    await config.update('globalExclusions', DEFAULT_GLOBAL_EXCLUSIONS, vscode.ConfigurationTarget.Global);
    await config.update('headerTemplate', DEFAULT_HEADER_TEMPLATE, vscode.ConfigurationTarget.Global);
    await config.update('useRelativePaths', true, vscode.ConfigurationTarget.Global);
} 