import * as vscode from 'vscode';
import { generateContext } from './contextGenerator';
import { getWebviewContent } from './webview/webviewContent';
import { DEFAULT_GLOBAL_EXCLUSIONS, DEFAULT_HEADER_TEMPLATE, resetConfiguration } from './utils/defaultConfig';

export async function activate(context: vscode.ExtensionContext) {
    console.log('Activating Codebase Context Generator extension');

    const config = vscode.workspace.getConfiguration('codebaseContext');
    const globalExclusions = config.get<string[]>('globalExclusions');
    
    if (!globalExclusions || globalExclusions.length === 0) {
        try {
            await resetConfiguration(vscode);
            console.log('Default global exclusions initialized');
        } catch (error) {
            console.error('Error initializing default global exclusions:', error);
        }
    }

    const provider = new ContextGeneratorViewProvider(context.extensionUri);
    context.subscriptions.push(
        vscode.window.registerWebviewViewProvider(
            'codebaseContextGenerator',
            provider,
            {
                webviewOptions: {
                    retainContextWhenHidden: true
                }
            }
        )
    );

    console.log('Webview provider registered');
}

class ContextGeneratorViewProvider implements vscode.WebviewViewProvider {
    private _view?: vscode.WebviewView;
    private _cancellationTokenSource?: vscode.CancellationTokenSource;

    constructor(
        private readonly _extensionUri: vscode.Uri,
    ) { }

    public resolveWebviewView(
        webviewView: vscode.WebviewView,
        _context: vscode.WebviewViewResolveContext,
        _token: vscode.CancellationToken,
    ) {
        try {
            console.log('Resolving webview view');
            this._view = webviewView;

            webviewView.webview.options = {
                enableScripts: true,
                localResourceRoots: [this._extensionUri]
            };

            const html = this._getHtmlForWebview(webviewView.webview);
            console.log('Generated HTML for webview');
            webviewView.webview.html = html;

            webviewView.webview.onDidReceiveMessage(async (data) => {
                console.log('Received message from webview:', data.command);
                switch (data.command) {
                    case 'generate': {
                        await this._generateContext(data.projectExclusions, data.globalExclusions, data.headerTemplate);
                        break;
                    }
                    case 'getConfig': {
                        await this._sendConfig();
                        break;
                    }
                    case 'saveConfig': {
                        await this._saveConfig(data.config);
                        break;
                    }
                    case 'openFilePicker': {
                        await this._handleFilePicker(data.isGlobal);
                        break;
                    }
                    case 'cancel': {
                        this._cancelGeneration();
                        break;
                    }
                    case 'resetStorage': {
                        await this._resetStorage();
                        break;
                    }
                }
            });

            this._sendConfig().catch(error => {
                console.error('Error sending initial config:', error);
            });

            console.log('Webview setup complete');
        } catch (error) {
            console.error('Error setting up webview:', error);
            throw error;
        }
    }

    private async _generateContext(projectExclusions: string[], globalExclusions: string[], headerTemplate: string) {
        try {
            const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
            if (!workspaceFolder) {
                throw new Error('No workspace folder found');
            }

            this._cancellationTokenSource = new vscode.CancellationTokenSource();

            await this._postMessage({ type: 'progress', value: 0, status: 'Starting generation...' });

            const excludePatterns = [...new Set([...projectExclusions, ...globalExclusions])];

            const config = vscode.workspace.getConfiguration('codebaseContext');
            await config.update('projectExclusions', projectExclusions, vscode.ConfigurationTarget.Workspace);
            await config.update('globalExclusions', globalExclusions, vscode.ConfigurationTarget.Global);
            await config.update('headerTemplate', headerTemplate, vscode.ConfigurationTarget.Global);

            await this._postMessage({ type: 'progress', value: 20, status: 'Analyzing workspace...' });

            const context = await generateContext(
                workspaceFolder.uri.fsPath,
                {
                    excludePatterns,
                    maxFileSizeKB: config.get<number>('maxFileSizeKB') || 1024,
                    headerTemplate,
                    useRelativePaths: config.get<boolean>('useRelativePaths') ?? true,
                    onProgress: (progress: number, status: string) => {
                        this._postMessage({ type: 'progress', value: 20 + (progress * 0.8), status });
                    }
                },
                this._cancellationTokenSource.token
            );

            const document = await vscode.workspace.openTextDocument({
                content: context,
                language: 'markdown'
            });
            await vscode.window.showTextDocument(document);

            await vscode.env.clipboard.writeText(context);

            await this._postMessage({ type: 'progress', value: 100, status: 'Complete!' });
            vscode.window.showInformationMessage('Context generated and copied to clipboard!');
        } catch (error) {
            if (error instanceof vscode.CancellationError) {
                await this._postMessage({ type: 'cancelled' });
                vscode.window.showInformationMessage('Generation cancelled');
            } else {
                console.error('Error generating context:', error);
                vscode.window.showErrorMessage(`Failed to generate context: ${error}`);
                await this._postMessage({ type: 'error', message: `${error}` });
            }
        } finally {
            this._cancellationTokenSource?.dispose();
            this._cancellationTokenSource = undefined;
        }
    }

    private async _sendConfig() {
        try {
            console.log('Sending configuration to webview');
            const config = vscode.workspace.getConfiguration('codebaseContext');
            const projectExclusions = config.get<string[]>('projectExclusions') || [];
            const globalExclusions = config.get<string[]>('globalExclusions') || [];
            const headerTemplate = config.get<string>('headerTemplate') || '';
            const useRelativePaths = config.get<boolean>('useRelativePaths') ?? true;

            await this._postMessage({
                type: 'config',
                projectExclusions,
                globalExclusions,
                headerTemplate,
                useRelativePaths
            });
            console.log('Configuration sent successfully');
        } catch (error) {
            console.error('Error sending configuration:', error);
            throw error;
        }
    }

    private async _saveConfig(config: { 
        projectExclusions: string[], 
        globalExclusions: string[], 
        headerTemplate: string,
        useRelativePaths: boolean 
    }) {
        try {
            const configuration = vscode.workspace.getConfiguration('codebaseContext');
            await configuration.update('projectExclusions', config.projectExclusions, vscode.ConfigurationTarget.Workspace);
            await configuration.update('globalExclusions', config.globalExclusions, vscode.ConfigurationTarget.Global);
            await configuration.update('headerTemplate', config.headerTemplate, vscode.ConfigurationTarget.Global);
            await configuration.update('useRelativePaths', config.useRelativePaths, vscode.ConfigurationTarget.Global);
            await this._postMessage({ type: 'saveSuccess' });
        } catch (error) {
            console.error('Error saving configuration:', error);
            vscode.window.showErrorMessage(`Failed to save configuration: ${error}`);
            await this._postMessage({ type: 'error', message: `Failed to save configuration: ${error}` });
        }
    }

    private async _handleFilePicker(isGlobal: boolean = false) {
        try {
            const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
            if (!workspaceFolder) {
                throw new Error('No workspace folder found');
            }

            const files = await vscode.window.showOpenDialog({
                canSelectFiles: true,
                canSelectFolders: true,
                canSelectMany: true,
                defaultUri: workspaceFolder.uri,
                openLabel: 'Add to Exclusions',
                title: 'Select Files or Folders to Exclude'
            });

            if (files && files.length > 0) {
                const invalidFiles = files.filter(file => !file.fsPath.startsWith(workspaceFolder.uri.fsPath));
                if (invalidFiles.length > 0) {
                    const invalidPaths = invalidFiles.map(f => f.fsPath).join('\n');
                    throw new Error(`Selected files must be within the workspace:\n${invalidPaths}`);
                }

                const relativePaths = files.map(file => {
                    return vscode.workspace.asRelativePath(file, false);
                });

                const patterns = await Promise.all(relativePaths.map(async path => {
                    try {
                        const uri = vscode.Uri.joinPath(workspaceFolder.uri, path);
                        const stat = await vscode.workspace.fs.stat(uri);
                        if (stat.type & vscode.FileType.Directory) {
                            return `${path}/**`;
                        }
                        return path.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                    } catch (error) {
                        console.error(`Error processing path ${path}:`, error);
                        return path.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                    }
                }));

                await this._postMessage({
                    type: 'filesPicked',
                    files: patterns,
                    isGlobal
                });
            }
        } catch (error) {
            console.error('Error handling file picker:', error);
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            vscode.window.showErrorMessage(`Failed to handle file picker: ${errorMessage}`);
            await this._postMessage({ type: 'error', message: `Failed to handle file picker: ${errorMessage}` });
        }
    }

    private _postMessage(message: any): Thenable<boolean> | undefined {
        try {
            if (this._view) {
                console.log('Posting message to webview:', message.type);
                return this._view.webview.postMessage(message);
            }
            console.warn('No webview available to post message');
            return undefined;
        } catch (error) {
            console.error('Error posting message to webview:', error);
            throw error;
        }
    }

    private _getHtmlForWebview(webview: vscode.Webview) {
        try {
            return getWebviewContent(webview, this._extensionUri, {
                projectExclusions: [], 
                globalExclusions: [],   
                headerTemplate: ''     
            });
        } catch (error) {
            console.error('Error generating webview content:', error);
            throw error;
        }
    }

    private _cancelGeneration() {
        if (this._cancellationTokenSource) {
            this._cancellationTokenSource.cancel();
        }
    }

    private async _resetStorage() {
        try {
            await resetConfiguration(vscode);

            if (this._view) {
                this._view.webview.postMessage({
                    type: 'config',
                    projectExclusions: [],
                    globalExclusions: DEFAULT_GLOBAL_EXCLUSIONS,
                    headerTemplate: DEFAULT_HEADER_TEMPLATE,
                    useRelativePaths: true
                });
            }

            vscode.window.showInformationMessage('Storage reset successfully with default exclusions');
        } catch (error) {
            console.error('Error resetting storage:', error);
            vscode.window.showErrorMessage(`Failed to reset storage: ${error}`);
        }
    }
}

export function deactivate() {
    console.log('Deactivating Codebase Context Generator extension');
} 