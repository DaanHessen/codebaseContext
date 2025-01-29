import * as vscode from 'vscode';
import { getNonce } from '../utils/getNonce';

export function getWebviewContent(webview: vscode.Webview): string {
    if (!webview) {
        throw new Error('Webview is required');
    }

    const nonce = getNonce();
    const cspSource = webview.cspSource;

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

    const styles = `
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
        }

        .container {
            height: 100%;
            display: flex;
            flex-direction: column;
            padding: var(--container-padding);
            position: relative;
            padding-bottom: calc(var(--container-padding) + 48px); /* Space for fixed button */
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
            min-height: 400px;
            max-height: 800px;
            font-family: var(--vscode-editor-font-family);
            font-size: var(--vscode-editor-font-size);
            line-height: 1.5;
            margin-bottom: 16px;
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
            background: var(--vscode-tab-activeBackground);
        }

        .tab {
            padding: 8px 16px;
            cursor: pointer;
            background: none;
            border: none;
            color: var(--vscode-tab-inactiveForeground);
            border-bottom: 2px solid transparent;
            font-weight: 500;
            opacity: 0.7;
            transition: all 0.2s;
        }

        .tab:hover {
            opacity: 0.9;
            background: var(--vscode-tab-hoverBackground);
        }

        .tab.active {
            color: var(--vscode-tab-activeForeground);
            background: var(--vscode-tab-activeBackground);
            border-bottom-color: var(--vscode-focusBorder);
            opacity: 1;
        }

        .tab-content {
            display: none;
            height: calc(100% - var(--tab-height));
            overflow-y: auto;
            padding-bottom: 60px; /* Space for fixed button */
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
            max-height: 200px;
            border: 1px solid var(--vscode-input-border);
            border-radius: 4px;
            background: var(--vscode-input-background);
            margin-bottom: 12px;
        }

        .exclusion-item {
            display: flex;
            align-items: center;
            padding: 6px 8px;
            border-radius: 4px;
            margin-bottom: 4px;
            background: var(--vscode-input-background);
        }

        .exclusion-item:not(:last-child) {
            border-bottom: 1px solid var(--vscode-panel-border);
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

        .button-container {
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            padding: var(--container-padding);
            background: var(--vscode-editor-background);
            border-top: 1px solid var(--vscode-panel-border);
            z-index: 100;
            display: flex;
            justify-content: center;
            backdrop-filter: blur(10px);
        }

        .button-container button {
            min-width: 200px;
            background: var(--vscode-button-prominentBackground);
            color: var(--vscode-button-prominentForeground);
        }

        .button-container button:hover {
            background: var(--vscode-button-prominentHoverBackground);
        }

        .add-exclusion {
            display: flex;
            gap: 8px;
            margin-bottom: 12px;
            align-items: center;
        }

        .add-exclusion input {
            flex: 1;
            height: 32px;
        }

        .file-picker-btn {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            height: 32px;
            padding: 0 12px;
            white-space: nowrap;
            background: var(--vscode-button-background) !important;
            color: var(--vscode-button-foreground) !important;
            border: none;
            font-size: 12px;
            font-weight: 500;
            border-radius: 4px;
            cursor: pointer;
            min-width: 120px;
            justify-content: center;
        }

        .file-picker-btn:hover {
            background: var(--vscode-button-hoverBackground) !important;
        }

        .file-picker-btn i {
            font-size: 14px;
            margin-right: 4px;
        }

        .file-picker-btn:disabled {
            opacity: 0.6;
            cursor: not-allowed;
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
            padding: 4px 8px;
            font-size: 11px;
            background: none;
            border: none;
            color: var(--vscode-errorForeground);
            opacity: 0.7;
            transition: all 0.2s;
            display: flex;
            align-items: center;
            justify-content: center;
            min-width: 24px;
            height: 24px;
            border-radius: 4px;
        }

        .remove-btn:hover {
            opacity: 1;
            background: var(--vscode-errorForeground);
            color: var(--vscode-editor-background);
        }

        .codicon {
            font-size: 14px;
        }

        .icon {
            width: 16px;
            height: 16px;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            font-family: codicon;
            font-size: 14px;
        }

        .icon-close::before {
            content: "\\ea76";
            font-family: codicon;
        }

        .section-description {
            color: var(--vscode-descriptionForeground);
            font-size: 12px;
            margin: 8px 0;
            line-height: 1.4;
            padding: 0 14px;
        }

        .error-message {
            color: var(--vscode-errorForeground);
            background-color: var(--vscode-inputValidation-errorBackground);
            border: 1px solid var(--vscode-inputValidation-errorBorder);
            padding: 8px;
            margin: 8px 0;
            border-radius: 4px;
            display: none;
        }

        .info-message {
            color: var(--vscode-notificationsInfoIcon-foreground);
            background-color: var(--vscode-notifications-background);
            border: 1px solid var(--vscode-notificationsInfoIcon-foreground);
            padding: 8px;
            margin: 8px 0;
            border-radius: 4px;
            font-style: italic;
        }

        .setting-item {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            padding: 8px 0;
            border-bottom: 1px solid var(--vscode-panel-border);
        }

        .setting-item:last-child {
            border-bottom: none;
        }

        .setting-label {
            flex: 1;
            padding-right: 16px;
        }

        .setting-label label {
            font-weight: 500;
            margin-bottom: 4px;
            display: block;
        }

        .setting-description {
            font-size: 12px;
            color: var(--vscode-descriptionForeground);
            margin-top: 4px;
        }

        .setting-control {
            flex: 0 0 auto;
            display: flex;
            align-items: center;
        }

        .setting-control input[type="checkbox"] {
            width: auto;
            margin: 0;
        }
    `;

    const html = `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${cspSource} 'unsafe-inline'; img-src ${cspSource} https:; script-src ${cspSource} 'nonce-${nonce}'; font-src ${cspSource} 'self' data:;">
        <title>Codebase Context Generator</title>
        <style>${styles}</style>
    </head>
    <body>
        <div class="container">
            <div class="tabs">
                <button class="tab" data-tab="exclusions">Exclusions</button>
                <button class="tab active" data-tab="general">General</button>
                <button class="tab" data-tab="settings">Settings</button>
            </div>

            <div class="tab-content" data-tab="exclusions">
                <div class="section">
                    <div class="section-header">Project-Specific Exclusions</div>
                    <div class="section-description">
                        Specify patterns to exclude specific files or directories from your current project. 
                        These exclusions only apply to this workspace.
                    </div>
                    <div class="section-content">
                        <div class="add-exclusion">
                            <input type="text" id="newProjectPattern" placeholder="Add new exclusion pattern (e.g., src/tests/**) and press Enter">
                            <button class="file-picker-btn" id="projectFilePicker">
                                <i class="codicon codicon-file-add"></i>
                                Select Files
                            </button>
                        </div>
                        <div class="exclusion-list" id="projectExclusionList"></div>
                        <div id="projectErrorMessage" class="error-message"></div>
                    </div>
                </div>

                <div class="section">
                    <div class="section-header">Global Exclusions</div>
                    <div class="section-description">
                        Define patterns that will be excluded from all projects. 
                        These exclusions apply globally across all workspaces.
                    </div>
                    <div class="section-content">
                        <div class="add-exclusion">
                            <input type="text" id="newGlobalPattern" placeholder="Add new global exclusion pattern (e.g., **/*.log) and press Enter">
                            <button class="file-picker-btn" id="globalFilePicker">
                                <i class="codicon codicon-file-add"></i>
                                Select Files
                            </button>
                        </div>
                        <div class="exclusion-list" id="globalExclusionList"></div>
                        <div id="globalErrorMessage" class="error-message"></div>
                    </div>
                </div>
            </div>

            <div class="tab-content active" data-tab="general">
                <div class="section">
                    <div class="section-header">Header Template</div>
                    <div class="section-description">
                        Define the template that will be used as a header for your code files. 
                        This template will be automatically inserted at the top of each file.
                    </div>
                    <div class="section-content">
                        <textarea id="headerTemplate" placeholder="Enter header template..."></textarea>
                    </div>
                </div>
            </div>

            <div class="tab-content" data-tab="settings">
                <div class="section">
                    <div class="section-header">Settings</div>
                    <div class="section-description">
                        Configure additional settings for the extension.
                    </div>
                    <div class="section-content">
                        <div class="setting-item">
                            <div class="setting-label">
                                <label for="useRelativePaths">Use Relative Paths</label>
                                <div class="setting-description">Use relative paths instead of absolute paths in the generated context</div>
                            </div>
                            <div class="setting-control">
                                <input type="checkbox" id="useRelativePaths">
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
                    vscode.postMessage({ command: 'getConfig' });
                    
                    window.addEventListener('message', event => {
                        const message = event.data;
                        console.log('Received message:', message.type);

                        try {
                            switch (message.type) {
                                case 'config':
                                    updateUI(message);
                                    break;
                                case 'filesPicked':
                                    if (Array.isArray(message.files)) {
                                        message.files.forEach(file => {
                                            if (message.isGlobal) {
                                                addGlobalExclusion(file);
                                            } else {
                                                addProjectExclusion(file);
                                            }
                                        });
                                    }
                                    break;
                                case 'progress':
                                    updateProgress(message.value, message.status);
                                    break;
                                case 'error':
                                    const errorType = message.isGlobal ? 'global' : 'project';
                                    showError(message.message, errorType);
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

            function setupEventListeners() {
                document.getElementById('projectFilePicker').addEventListener('click', () => {
                    vscode.postMessage({ command: 'openFilePicker', isGlobal: false });
                });

                document.getElementById('globalFilePicker').addEventListener('click', () => {
                    vscode.postMessage({ command: 'openFilePicker', isGlobal: true });
                });

                document.getElementById('newProjectPattern').addEventListener('keypress', (e) => {
                    if (e.key === 'Enter') {
                        const input = document.getElementById('newProjectPattern');
                        const pattern = input.value.trim();
                        
                        if (pattern && !projectExclusions.includes(pattern)) {
                            addProjectExclusion(pattern);
                        }
                    }
                });

                document.getElementById('newGlobalPattern').addEventListener('keypress', (e) => {
                    if (e.key === 'Enter') {
                        const input = document.getElementById('newGlobalPattern');
                        const pattern = input.value.trim();
                        
                        if (pattern && !globalExclusions.includes(pattern)) {
                            addGlobalExclusion(pattern);
                        }
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

                document.getElementById('headerTemplate').addEventListener('input', () => {
                    autoSave();
                });

                document.getElementById('useRelativePaths').addEventListener('change', (e) => {
                    autoSave();
                });

                document.querySelectorAll('.tab').forEach(tab => {
                    tab.addEventListener('click', () => {
                        const tabName = tab.dataset.tab;
                        
                        document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
                        tab.classList.add('active');
                        
                        document.querySelectorAll('.tab-content').forEach(content => {
                            content.classList.remove('active');
                            if (content.dataset.tab === tabName) {
                                content.classList.add('active');
                            }
                        });
                        
                        activeTab = tabName;
                    });
                });
            }

            function updateUI(config) {
                document.getElementById('headerTemplate').value = config.headerTemplate || '';
                document.getElementById('useRelativePaths').checked = config.useRelativePaths ?? true;
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
                        <button class="remove-btn" onclick="removeExclusion('\${type}', \${index})" aria-label="Remove exclusion">
                            <i class="codicon codicon-close"></i>
                        </button>
                    \`;

                    const checkbox = item.querySelector('input[type="checkbox"]');
                    const removeBtn = item.querySelector('.remove-btn');
                    
                    checkbox.addEventListener('change', () => {
                        autoSave();
                    });

                    removeBtn.addEventListener('click', (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        removeExclusion(type, index);
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

            function showNotification(message, type = 'success') {
                const notification = document.getElementById('notification');
                notification.textContent = message;
                notification.className = 'notification ' + type;
                notification.style.display = 'block';
                
                setTimeout(() => {
                    notification.style.display = 'none';
                }, 3000);
            }

            function autoSave() {
                const config = {
                    headerTemplate: document.getElementById('headerTemplate').value,
                    projectExclusions: projectExclusions,
                    globalExclusions: globalExclusions,
                    useRelativePaths: document.getElementById('useRelativePaths').checked
                };

                vscode.postMessage({ command: 'saveConfig', config });
            }

            function addProjectExclusion(pattern) {
                if (!pattern || projectExclusions.includes(pattern)) return;
                
                projectExclusions.push(pattern);
                updateExclusionList('project');
                document.getElementById('newProjectPattern').value = '';
                autoSave();
            }

            function addGlobalExclusion(pattern) {
                if (!pattern || globalExclusions.includes(pattern)) return;
                
                globalExclusions.push(pattern);
                updateExclusionList('global');
                document.getElementById('newGlobalPattern').value = '';
                autoSave();
            }

            function showError(message, type = 'project') {
                const errorElement = document.getElementById(\`\${type}ErrorMessage\`);
                if (errorElement) {
                    errorElement.textContent = message;
                    errorElement.style.display = 'block';
                    setTimeout(() => {
                        errorElement.style.display = 'none';
                    }, 5000);
                } else {
                    console.error(\`Error element not found for type: \${type}\`);
                    showNotification(message, 'error');
                }
            }

            init();
        </script>
    </body>
    </html>`;

    return html;
} 