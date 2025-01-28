import * as vscode from 'vscode';
import { getNonce } from '../utils/getNonce';

export function getWebviewContent(webview: vscode.Webview): string {
    if (!webview) {
        throw new Error('Webview is required');
    }

    const nonce = getNonce();
    const cspSource = webview.cspSource;

    // Add error boundary and initialization check
    const errorHandling = `
        window.onerror = function(message, source, lineno, colno, error) {
            console.error('Error:', message, 'at', source, ':', lineno, ':', colno);
            showError(message);
            return false;
        };

        window.onunhandledrejection = function(event) {
            console.error('Unhandled promise rejection:', event.reason);
            showError(event.reason.message || 'An error occurred');
            return false;
        };

        console.log('Webview content initialized');
    `;

    return `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${cspSource} 'unsafe-inline'; script-src 'nonce-${nonce}';">
        <title>Codebase Context Generator</title>
        <style>
            :root {
                --container-padding: 12px;
                --section-spacing: 16px;
            }

            body {
                padding: 0;
                height: 100vh;
                margin: 0;
                color: var(--vscode-foreground);
                font-size: 13px;
                line-height: 1.4;
                display: flex;
                flex-direction: column;
            }

            .container {
                height: 100%;
                display: flex;
                flex-direction: column;
                padding: var(--container-padding);
            }

            input, button, textarea {
                border: 1px solid var(--vscode-input-border);
                color: var(--vscode-input-foreground);
                background-color: var(--vscode-input-background);
                border-radius: 2px;
                padding: 4px 8px;
            }

            textarea {
                resize: vertical;
                min-height: 80px;
                font-family: var(--vscode-editor-font-family);
                font-size: var(--vscode-editor-font-size);
            }

            button {
                background-color: var(--vscode-button-background);
                color: var(--vscode-button-foreground);
                border: none;
                padding: 6px 14px;
                cursor: pointer;
                display: inline-flex;
                align-items: center;
                justify-content: center;
                border-radius: 4px;
                font-weight: 500;
            }

            button:hover {
                background-color: var(--vscode-button-hoverBackground);
            }

            button:disabled {
                opacity: 0.5;
                cursor: not-allowed;
            }

            .section {
                background: var(--vscode-editor-background);
                border-radius: 6px;
                border: 1px solid var(--vscode-panel-border);
                margin-bottom: var(--section-spacing);
                flex-shrink: 0;
            }

            .section-header {
                padding: 8px 12px;
                background: var(--vscode-sideBarSectionHeader-background);
                border-bottom: 1px solid var(--vscode-panel-border);
                border-radius: 6px 6px 0 0;
                font-weight: 600;
                font-size: 11px;
                text-transform: uppercase;
                letter-spacing: 0.5px;
            }

            .section-content {
                padding: 12px;
            }

            .exclusion-list {
                flex: 1;
                overflow-y: auto;
                min-height: 100px;
                max-height: calc(100vh - 400px);
            }

            .exclusion-item {
                display: flex;
                align-items: center;
                padding: 4px 0;
                border-radius: 3px;
            }

            .exclusion-item:hover {
                background-color: var(--vscode-list-hoverBackground);
            }

            .exclusion-item input[type="checkbox"] {
                margin: 0 8px 0 0;
            }

            .exclusion-item span {
                flex: 1;
                margin-right: 8px;
                font-family: var(--vscode-editor-font-family);
            }

            .add-exclusion {
                display: flex;
                gap: 8px;
                margin-bottom: 12px;
            }

            .add-exclusion input {
                flex: 1;
            }

            .progress-container {
                margin-top: auto;
                padding-top: var(--section-spacing);
                display: none;
            }

            .progress-bar {
                width: 100%;
                height: 4px;
                background-color: var(--vscode-progressBar-background);
                border-radius: 2px;
                overflow: hidden;
                margin-bottom: 8px;
            }

            .progress-fill {
                height: 100%;
                width: 0%;
                background-color: var(--vscode-progressBar-foreground);
                transition: width 0.3s ease;
            }

            .progress-status {
                font-size: 11px;
                color: var(--vscode-descriptionForeground);
            }

            .error-message {
                color: var(--vscode-errorForeground);
                margin-top: 8px;
                display: none;
                font-size: 11px;
            }

            .button-container {
                display: flex;
                gap: 8px;
                margin-top: var(--section-spacing);
            }

            .remove-btn {
                padding: 2px 8px;
                font-size: 11px;
                background-color: var(--vscode-errorForeground);
            }

            .remove-btn:hover {
                background-color: var(--vscode-errorForeground);
                opacity: 0.8;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="section">
                <div class="section-header">Header Template</div>
                <div class="section-content">
                    <textarea id="headerTemplate" placeholder="Enter header template..."></textarea>
                </div>
            </div>

            <div class="section" style="flex: 1; display: flex; flex-direction: column;">
                <div class="section-header">Exclusion Patterns</div>
                <div class="section-content" style="flex: 1; display: flex; flex-direction: column;">
                    <div class="add-exclusion">
                        <input type="text" id="newPattern" placeholder="Add new exclusion pattern (e.g., **/*.log)">
                        <button id="addPattern">Add</button>
                    </div>
                    <div class="exclusion-list" id="exclusionList">
                        <!-- Exclusion patterns will be populated here -->
                    </div>
                </div>
            </div>

            <div class="progress-container" id="progressContainer">
                <div class="progress-bar">
                    <div class="progress-fill" id="progressFill"></div>
                </div>
                <div class="progress-status" id="progressStatus">Starting...</div>
            </div>

            <div class="error-message" id="errorMessage"></div>

            <div class="button-container">
                <button id="generateBtn" style="flex: 1;">Generate Context</button>
                <button id="saveConfigBtn">Save Configuration</button>
            </div>
        </div>

        <script nonce="${nonce}">
            ${errorHandling}

            const vscode = acquireVsCodeApi();
            let currentExclusions = [];
            let initialized = false;

            function init() {
                if (initialized) return;
                console.log('Initializing webview');
                
                try {
                    // Initialize
                    vscode.postMessage({ command: 'getConfig' });
                    
                    // Handle messages from the extension
                    window.addEventListener('message', event => {
                        const message = event.data;
                        console.log('Received message:', message.type);

                        try {
                            switch (message.type) {
                                case 'config':
                                    updateUI(message);
                                    break;
                                case 'progress':
                                    updateProgress(message.value, message.status);
                                    break;
                                case 'error':
                                    showError(message.message);
                                    break;
                                default:
                                    console.warn('Unknown message type:', message.type);
                            }
                        } catch (error) {
                            console.error('Error handling message:', error);
                            showError(error.message);
                        }
                    });

                    setupEventListeners();
                    initialized = true;
                    console.log('Webview initialized successfully');
                } catch (error) {
                    console.error('Error during initialization:', error);
                    showError('Failed to initialize: ' + error.message);
                }
            }

            function setupEventListeners() {
                document.getElementById('addPattern').addEventListener('click', () => {
                    const input = document.getElementById('newPattern');
                    const pattern = input.value.trim();
                    
                    if (pattern && !currentExclusions.includes(pattern)) {
                        currentExclusions.push(pattern);
                        updateExclusionList();
                        input.value = '';
                    }
                });

                document.getElementById('newPattern').addEventListener('keypress', (e) => {
                    if (e.key === 'Enter') {
                        document.getElementById('addPattern').click();
                    }
                });

                document.getElementById('generateBtn').addEventListener('click', () => {
                    const headerTemplate = document.getElementById('headerTemplate').value;
                    
                    document.getElementById('progressContainer').style.display = 'block';
                    document.getElementById('errorMessage').style.display = 'none';
                    document.getElementById('generateBtn').disabled = true;

                    vscode.postMessage({
                        command: 'generate',
                        excludePatterns: currentExclusions.filter(
                            (_, i) => document.querySelectorAll('.exclusion-item input[type="checkbox"]')[i].checked
                        ),
                        headerTemplate
                    });
                });

                document.getElementById('saveConfigBtn').addEventListener('click', () => {
                    const headerTemplate = document.getElementById('headerTemplate').value;
                    
                    vscode.postMessage({
                        command: 'saveConfig',
                        config: {
                            excludePatterns: currentExclusions,
                            headerTemplate
                        }
                    });
                });
            }

            function updateUI(config) {
                document.getElementById('headerTemplate').value = config.headerTemplate;
                currentExclusions = config.excludePatterns;
                updateExclusionList();
            }

            function updateExclusionList() {
                const list = document.getElementById('exclusionList');
                list.innerHTML = '';

                currentExclusions.forEach((pattern, index) => {
                    const item = document.createElement('div');
                    item.className = 'exclusion-item';
                    item.innerHTML = \`
                        <input type="checkbox" checked>
                        <span>\${pattern}</span>
                        <button onclick="removeExclusion(\${index})" class="remove-btn">Remove</button>
                    \`;
                    list.appendChild(item);
                });
            }

            function removeExclusion(index) {
                currentExclusions.splice(index, 1);
                updateExclusionList();
            }

            function updateProgress(value, status) {
                document.getElementById('progressFill').style.width = \`\${value}%\`;
                document.getElementById('progressStatus').textContent = status;

                if (value === 100) {
                    setTimeout(() => {
                        document.getElementById('progressContainer').style.display = 'none';
                        document.getElementById('generateBtn').disabled = false;
                    }, 2000);
                }
            }

            function showError(message) {
                const errorElement = document.getElementById('errorMessage');
                errorElement.textContent = message;
                errorElement.style.display = 'block';
                document.getElementById('generateBtn').disabled = false;
            }

            // Initialize the webview
            init();
        </script>
    </body>
    </html>`;
} 