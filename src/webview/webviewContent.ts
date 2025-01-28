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
        <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${cspSource} 'unsafe-inline'; img-src ${cspSource} https:; script-src ${cspSource} 'nonce-${nonce}'; font-src ${cspSource};">
        <title>Codebase Context Generator</title>
        <style>
            :root {
                --container-padding: 16px;
                --section-spacing: 20px;
                --tab-height: 36px;
                --description-color: var(--vscode-descriptionForeground);
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

            .description {
                color: var(--description-color);
                font-size: 12px;
                margin: 4px 0 12px 0;
                line-height: 1.4;
            }

            input, button, textarea {
                border: 1px solid var(--vscode-input-border);
                color: var(--vscode-input-foreground);
                background-color: var(--vscode-input-background);
                border-radius: 4px;
                padding: 6px 10px;
                width: 100%;
                box-sizing: border-box;
            }

            textarea {
                resize: vertical;
                min-height: 120px;
                font-family: var(--vscode-editor-font-family);
                font-size: var(--vscode-editor-font-size);
                line-height: 1.5;
            }

            button {
                background-color: var(--vscode-button-background);
                color: var(--vscode-button-foreground);
                border: none;
                padding: 8px 16px;
                cursor: pointer;
                display: inline-flex;
                align-items: center;
                justify-content: center;
                border-radius: 4px;
                font-weight: 500;
                width: auto;
            }

            button:hover {
                background-color: var(--vscode-button-hoverBackground);
            }

            button:disabled {
                opacity: 0.5;
                cursor: not-allowed;
            }

            .tabs {
                display: flex;
                border-bottom: 1px solid var(--vscode-panel-border);
                margin-bottom: var(--section-spacing);
            }

            .tab {
                padding: 8px 16px;
                cursor: pointer;
                background: none;
                border: none;
                color: var(--vscode-foreground);
                border-bottom: 2px solid transparent;
                font-weight: 500;
                opacity: 0.7;
            }

            .tab.active {
                border-bottom-color: var(--vscode-focusBorder);
                opacity: 1;
            }

            .tab-content {
                display: none;
                height: calc(100% - var(--tab-height));
            }

            .tab-content.active {
                display: flex;
                flex-direction: column;
            }

            .section {
                background: var(--vscode-editor-background);
                border-radius: 6px;
                border: 1px solid var(--vscode-panel-border);
                margin-bottom: var(--section-spacing);
                flex-shrink: 0;
            }

            .section-header {
                padding: 10px 14px;
                background: var(--vscode-sideBarSectionHeader-background);
                border-bottom: 1px solid var(--vscode-panel-border);
                border-radius: 6px 6px 0 0;
                font-weight: 600;
                font-size: 12px;
                text-transform: uppercase;
                letter-spacing: 0.5px;
            }

            .section-content {
                padding: 14px;
            }

            .exclusion-container {
                display: flex;
                flex-direction: column;
                gap: var(--section-spacing);
            }

            .exclusion-list {
                flex: 1;
                overflow-y: auto;
                min-height: 100px;
                max-height: calc(100vh - 500px);
            }

            .exclusion-item {
                display: flex;
                align-items: center;
                padding: 6px 8px;
                border-radius: 4px;
                margin-bottom: 4px;
            }

            .exclusion-item:hover {
                background-color: var(--vscode-list-hoverBackground);
            }

            .exclusion-item input[type="checkbox"] {
                margin: 0 8px 0 0;
                width: auto;
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

            .add-exclusion button {
                white-space: nowrap;
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

            .notification {
                position: fixed;
                bottom: 20px;
                right: 20px;
                padding: 10px 16px;
                border-radius: 4px;
                font-size: 12px;
                animation: fadeIn 0.3s ease;
                display: none;
            }

            .notification.success {
                background-color: var(--vscode-notificationsSuccessIcon-foreground);
                color: var(--vscode-editor-background);
            }

            .notification.error {
                background-color: var(--vscode-notificationsErrorIcon-foreground);
                color: var(--vscode-editor-background);
            }

            @keyframes fadeIn {
                from { opacity: 0; transform: translateY(10px); }
                to { opacity: 1; transform: translateY(0); }
            }

            .remove-btn {
                padding: 4px 10px;
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
            <div class="tabs">
                <button class="tab active" data-tab="general">General</button>
                <button class="tab" data-tab="settings">Settings</button>
            </div>

            <div class="tab-content active" data-tab="general">
            <div class="section">
                <div class="section-header">Header Template</div>
                <div class="section-content">
                        <div class="description">Define the template that will be used as a header for your code files. This template will be automatically inserted at the top of each file.</div>
                    <textarea id="headerTemplate" placeholder="Enter header template..."></textarea>
                </div>
            </div>

                <div class="section">
                    <div class="section-header">Project-Specific Exclusions</div>
                    <div class="section-content">
                        <div class="description">Specify patterns to exclude specific files or directories from your current project. These exclusions only apply to this workspace.</div>
                    <div class="add-exclusion">
                            <input type="text" id="newProjectPattern" placeholder="Add new exclusion pattern (e.g., src/tests/**)">
                            <button id="addProjectPattern">Add Pattern</button>
                        </div>
                        <div class="exclusion-list" id="projectExclusionList">
                            <!-- Project-specific exclusion patterns will be populated here -->
                        </div>
                    </div>
                </div>
            </div>

            <div class="tab-content" data-tab="settings">
                <div class="section">
                    <div class="section-header">Global Exclusions</div>
                    <div class="section-content">
                        <div class="description">Define patterns that will be excluded from all projects. These exclusions apply globally across all workspaces.</div>
                        <div class="add-exclusion">
                            <input type="text" id="newGlobalPattern" placeholder="Add new global exclusion pattern (e.g., **/*.log)">
                            <button id="addGlobalPattern">Add Pattern</button>
                        </div>
                        <div class="exclusion-list" id="globalExclusionList">
                            <!-- Global exclusion patterns will be populated here -->
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
                <button id="generateBtn" style="flex: 1;">Generate Context</button>
            </div>
        </div>

        <script nonce="${nonce}">
            ${errorHandling}

            const vscode = acquireVsCodeApi();
            let activeTab = 'general';
            let projectExclusions = [];
            let globalExclusions = [];
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
                                    showNotification(message.message, 'error');
                                    break;
                                case 'saveSuccess':
                                    showNotification('Configuration saved successfully', 'success');
                                    break;
                                default:
                                    console.warn('Unknown message type:', message.type);
                            }
                        } catch (error) {
                            console.error('Error handling message:', error);
                            showNotification(error.message, 'error');
                        }
                    });

                    setupEventListeners();
                    initialized = true;
                    console.log('Webview initialized successfully');
                } catch (error) {
                    console.error('Error during initialization:', error);
                    showNotification('Failed to initialize: ' + error.message, 'error');
                }
            }

            // Tab switching logic
            document.querySelectorAll('.tab').forEach(tab => {
                tab.addEventListener('click', () => {
                    const tabName = tab.dataset.tab;
                    
                    // Update active tab
                    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
                    tab.classList.add('active');
                    
                    // Update active content
                    document.querySelectorAll('.tab-content').forEach(content => {
                        content.classList.remove('active');
                        if (content.dataset.tab === tabName) {
                            content.classList.add('active');
                        }
                    });
                    
                    activeTab = tabName;
                });
            });

            function setupEventListeners() {
                // Project-specific exclusions
                document.getElementById('addProjectPattern').addEventListener('click', () => {
                    const input = document.getElementById('newProjectPattern');
                    const pattern = input.value.trim();
                    
                    if (pattern && !projectExclusions.includes(pattern)) {
                        projectExclusions.push(pattern);
                        updateExclusionList('project');
                        input.value = '';
                        autoSave();
                    }
                });

                document.getElementById('newProjectPattern').addEventListener('keypress', (e) => {
                    if (e.key === 'Enter') {
                        document.getElementById('addProjectPattern').click();
                    }
                });

                // Global exclusions
                document.getElementById('addGlobalPattern').addEventListener('click', () => {
                    const input = document.getElementById('newGlobalPattern');
                    const pattern = input.value.trim();
                    
                    if (pattern && !globalExclusions.includes(pattern)) {
                        globalExclusions.push(pattern);
                        updateExclusionList('global');
                        input.value = '';
                        autoSave();
                    }
                });

                document.getElementById('newGlobalPattern').addEventListener('keypress', (e) => {
                    if (e.key === 'Enter') {
                        document.getElementById('addGlobalPattern').click();
                    }
                });

                document.getElementById('generateBtn').addEventListener('click', () => {
                    const headerTemplate = document.getElementById('headerTemplate').value;
                    
                    document.getElementById('progressContainer').style.display = 'block';
                    document.getElementById('generateBtn').disabled = true;

                    vscode.postMessage({
                        command: 'generate',
                        projectExclusions: getEnabledExclusions('project'),
                        globalExclusions: getEnabledExclusions('global'),
                        headerTemplate
                    });
                });

                // Auto-save for header template
                document.getElementById('headerTemplate').addEventListener('input', () => {
                    autoSave();
                });
            }

            function updateUI(config) {
                document.getElementById('headerTemplate').value = config.headerTemplate || '';
                projectExclusions = config.projectExclusions || [];
                globalExclusions = config.globalExclusions || [];
                updateExclusionList('project');
                updateExclusionList('global');
            }

            function updateExclusionList(type) {
                const list = document.getElementById(type === 'project' ? 'projectExclusionList' : 'globalExclusionList');
                const exclusions = type === 'project' ? projectExclusions : globalExclusions;
                list.innerHTML = '';

                exclusions.forEach((pattern, index) => {
                    const item = document.createElement('div');
                    item.className = 'exclusion-item';
                    item.innerHTML = \`
                        <input type="checkbox" checked>
                        <span>\${pattern}</span>
                        <button class="remove-btn" onclick="removeExclusion('\${type}', \${index})">Remove</button>
                    \`;

                    const checkbox = item.querySelector('input[type="checkbox"]');
                    checkbox.addEventListener('change', () => {
                        autoSave();
                    });

                    list.appendChild(item);
                });
            }

            function removeExclusion(type, index) {
                if (type === 'project') {
                    projectExclusions.splice(index, 1);
                } else {
                    globalExclusions.splice(index, 1);
                }
                updateExclusionList(type);
                autoSave();
            }

            function getEnabledExclusions(type) {
                const list = document.getElementById(type === 'project' ? 'projectExclusionList' : 'globalExclusionList');
                const exclusions = type === 'project' ? projectExclusions : globalExclusions;
                
                return exclusions.filter((_, index) => {
                    const checkbox = list.children[index].querySelector('input[type="checkbox"]');
                    return checkbox.checked;
                });
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

            // Notification system
            function showNotification(message, type = 'success') {
                const notification = document.getElementById('notification');
                notification.textContent = message;
                notification.className = 'notification ' + type;
                notification.style.display = 'block';
                
                setTimeout(() => {
                    notification.style.display = 'none';
                }, 3000);
            }

            // Auto-save functionality
            function autoSave() {
                const config = {
                    headerTemplate: document.getElementById('headerTemplate').value,
                    projectExclusions: projectExclusions,
                    globalExclusions: globalExclusions
                };

                vscode.postMessage({ command: 'saveConfig', config });
            }

            // Initialize the webview
            init();
        </script>
    </body>
    </html>`;
} 