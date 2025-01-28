import * as vscode from 'vscode';
import { generateContext } from './contextGenerator';
import { getWebviewContent } from './webview/webviewContent';

export function activate(context: vscode.ExtensionContext) {
    console.log('Activating Codebase Context Generator extension');

    // Register the sidebar webview provider
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

            // Handle messages from the webview
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
                }
            });

            // Send initial configuration
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

            await this._postMessage({ type: 'progress', value: 0, status: 'Starting generation...' });

            // Combine project and global exclusions
            const excludePatterns = [...new Set([...projectExclusions, ...globalExclusions])];

            // Save current configuration
            const config = vscode.workspace.getConfiguration('codebaseContext');
            await config.update('projectExclusions', projectExclusions, vscode.ConfigurationTarget.Workspace);
            await config.update('globalExclusions', globalExclusions, vscode.ConfigurationTarget.Global);
            await config.update('headerTemplate', headerTemplate, vscode.ConfigurationTarget.Global);

            await this._postMessage({ type: 'progress', value: 20, status: 'Analyzing workspace...' });

            // Generate context with progress updates
            const context = await generateContext(
                workspaceFolder.uri.fsPath,
                {
                    excludePatterns,
                    maxFileSizeKB: config.get<number>('maxFileSizeKB') || 1024,
                    headerTemplate,
                    onProgress: (progress: number, status: string) => {
                        this._postMessage({ type: 'progress', value: 20 + (progress * 0.8), status });
                    }
                }
            );

            // Create and show output document
            const document = await vscode.workspace.openTextDocument({
                content: context,
                language: 'markdown'
            });
            await vscode.window.showTextDocument(document);

            // Copy to clipboard
            await vscode.env.clipboard.writeText(context);

            await this._postMessage({ type: 'progress', value: 100, status: 'Complete!' });
            vscode.window.showInformationMessage('Context generated and copied to clipboard!');
        } catch (error) {
            console.error('Error generating context:', error);
            vscode.window.showErrorMessage(`Failed to generate context: ${error}`);
            await this._postMessage({ type: 'error', message: `${error}` });
        }
    }

    private async _sendConfig() {
        try {
            console.log('Sending configuration to webview');
            const config = vscode.workspace.getConfiguration('codebaseContext');
            const projectExclusions = config.get<string[]>('projectExclusions') || [];
            const globalExclusions = config.get<string[]>('globalExclusions') || [];
            const headerTemplate = config.get<string>('headerTemplate') || '';

            await this._postMessage({
                type: 'config',
                projectExclusions,
                globalExclusions,
                headerTemplate
            });
            console.log('Configuration sent successfully');
        } catch (error) {
            console.error('Error sending configuration:', error);
            throw error;
        }
    }

    private async _saveConfig(config: { projectExclusions: string[], globalExclusions: string[], headerTemplate: string }) {
        try {
            const configuration = vscode.workspace.getConfiguration('codebaseContext');
            await configuration.update('projectExclusions', config.projectExclusions, vscode.ConfigurationTarget.Workspace);
            await configuration.update('globalExclusions', config.globalExclusions, vscode.ConfigurationTarget.Global);
            await configuration.update('headerTemplate', config.headerTemplate, vscode.ConfigurationTarget.Global);
            await this._postMessage({ type: 'saveSuccess' });
        } catch (error) {
            console.error('Error saving configuration:', error);
            vscode.window.showErrorMessage(`Failed to save configuration: ${error}`);
            await this._postMessage({ type: 'error', message: `Failed to save configuration: ${error}` });
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
            return getWebviewContent(webview);
        } catch (error) {
            console.error('Error generating webview content:', error);
            throw error;
        }
    }
}

export function deactivate() {
    console.log('Deactivating Codebase Context Generator extension');
} 