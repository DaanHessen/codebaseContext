import * as vscode from 'vscode';
import { getNonce } from '../utils/getNonce';
import { getExclusionsTab } from './components/ExclusionsTab';
import { getStyles } from './styles/styles';
import { getScripts } from './scripts/scripts';

export function getWebviewContent(webview: vscode.Webview, extensionUri: vscode.Uri): string {
    if (!webview) {
        throw new Error('Webview is required');
    }

    const nonce = getNonce();
    const cspSource = webview.cspSource;

    return `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${cspSource} 'unsafe-inline'; script-src ${cspSource} 'nonce-${nonce}' 'unsafe-inline'; font-src ${cspSource} 'self' data:; img-src ${cspSource} 'self' data:; connect-src ${cspSource} 'self' https:; frame-src ${cspSource} 'self'; base-uri 'none'; form-action 'none';">
        <title>Codebase Context Generator</title>
        <link href="${webview.asWebviewUri(vscode.Uri.joinPath(extensionUri, 'node_modules', '@vscode/codicons', 'dist', 'codicon.css'))}" rel="stylesheet" />
        <style nonce="${nonce}">
            ${getStyles()}
        </style>
    </head>
    <body>
        <div class="container">
            <div class="tabs">
                <button class="tab active" data-tab="exclusions">Exclusions</button>
                <button class="tab" data-tab="settings">Settings</button>
            </div>

            <div class="tab-content active" data-tab="exclusions">
                <div class="section">
                    <div class="section-header">Project-Specific Exclusions</div>
                    <div class="section-description">
                        These exclusions only apply to the current project.
                    </div>
                    <div class="section-content">
                        <div class="add-exclusion">
                            <input 
                                type="text" 
                                id="newProjectPattern" 
                                placeholder="Add exclusion pattern (e.g., .exe, requirements.txt, /node_modules)"
                            >
                        </div>
                        <div id="projectErrorMessage" class="error-message"></div>
                        <div id="projectExclusionList" class="exclusion-list"></div>
                    </div>
                </div>

                <div class="section">
                    <div class="section-header">Global Exclusions</div>
                    <div class="section-description">
                        Allows you to exclude files from the context generation process. These exclusions apply to all projects.
                    </div>
                    <div class="section-content">
                        <div class="add-exclusion">
                            <input 
                                type="text" 
                                id="newGlobalPattern" 
                                placeholder="Add exclusion pattern (e.g., .exe, requirements.txt, /node_modules)"
                            >
                        </div>
                        <div id="globalErrorMessage" class="error-message"></div>
                        <div id="globalExclusionList" class="exclusion-list"></div>
                    </div>
                </div>
            </div>

            <div class="tab-content" data-tab="settings">
                <div class="section">
                    <div class="section-header">Header Template</div>
                    <div class="section-description">
                        Define the template for file headers. Available parameters:
                        <div class="info-message">
                            {content} - File content placement
                            {date} - Current date
                            {workspacePath} - Project workspace path
                            {fileTree} - Project file tree
                            {fileName} - Current file name
                            {filePath} - Current file path
                        </div>
                    </div>
                    <div class="section-content">
                        <div class="setting-item">
                            <div class="setting-control">
                                <textarea 
                                    id="headerTemplate" 
                                    placeholder="Enter header template..."
                                ></textarea>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="progress-container" id="progressContainer">
                <div class="progress-bar">
                    <div class="progress-fill" id="progressFill"></div>
                </div>
                <div class="progress-status" id="progressStatus">Starting...</div>
            </div>

            <div class="notification" id="notification"></div>

            <div class="button-container">
                <div class="generate-button-wrapper">
                    <button id="generateBtn">Generate Context</button>
                </div>
            </div>
        </div>

        <script nonce="${nonce}">
            ${getScripts()}
        </script>
    </body>
    </html>`;
}