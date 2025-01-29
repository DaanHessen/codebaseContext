export function getScripts(): string {
    return `
        let vscode;
        let activeTab = 'exclusions';
        let projectExclusions = [];
        let globalExclusions = [];
        let initialized = false;
        let enabledProjectExclusions = new Set();
        let enabledGlobalExclusions = new Set();

        // Ensure vscode API is available
        try {
            vscode = acquireVsCodeApi();
        } catch (error) {
            console.error('Failed to acquire VS Code API:', error);
            throw error;
        }

        // Initialize as soon as DOM is ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initializeWebview);
        } else {
            initializeWebview();
        }

        function initializeWebview() {
            if (initialized) return;
            
            try {
                // Setup error handlers
                window.onerror = function(message, source, lineno, colno, error) {
                    console.error('Error:', message, 'at', source, ':', lineno, ':', colno);
                    showError(message);
                    return false;
                };

                // Setup message handler
                window.addEventListener('message', event => {
                    const message = event.data;
                    try {
                        switch (message.type) {
                            case 'config':
                                updateUI(message.config || message);
                                break;
                            case 'progress':
                                updateProgress(message.value, message.status);
                                break;
                            case 'error':
                                showError(message.message, message.isGlobal ? 'global' : 'project');
                                break;
                            case 'saveSuccess':
                                showNotification('Configuration saved successfully', 'success');
                                break;
                        }
                    } catch (error) {
                        console.error('Error handling message:', error);
                        showNotification('Error: ' + error.message, 'error');
                    }
                });

                // Initialize UI
                initializeTabs();
                setupEventListeners();
                
                // Request initial configuration
                vscode.postMessage({ command: 'getConfig' });

                initialized = true;
            } catch (error) {
                console.error('Error during initialization:', error);
                showError('Failed to initialize: ' + error.message);
            }
        }

        function initializeTabs() {
            document.querySelectorAll('.tab').forEach(tab => {
                tab.addEventListener('click', () => {
                    const tabName = tab.getAttribute('data-tab');
                    if (!tabName) return;

                    // Update active states
                    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
                    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));

                    tab.classList.add('active');
                    document.querySelector(\`.tab-content[data-tab="\${tabName}"]\`)?.classList.add('active');
                    activeTab = tabName;
                });
            });
        }

        function validatePattern(pattern) {
            pattern = pattern.trim();
            // Pattern must start with / for folders, . for file types, or contain . for specific files
            if (pattern.startsWith('/')) return true; // Folder pattern
            if (pattern.startsWith('.')) return true; // File type pattern
            if (pattern.includes('.')) return true; // Specific file pattern
            return false;
        }

        function setupEventListeners() {
            // Project exclusions input
            document.getElementById('newProjectPattern')?.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    const input = e.target;
                    const pattern = input.value.trim();
                    
                    if (!pattern) {
                        showError('Pattern cannot be empty', 'project');
                        return;
                    }

                    if (!validatePattern(pattern)) {
                        showError('Invalid pattern format. Use /folder_name for folders, .ext for file types, or filename.ext for specific files', 'project');
                        return;
                    }

                    if (!projectExclusions.includes(pattern)) {
                        addProjectExclusion(pattern);
                        enabledProjectExclusions.add(pattern);
                        autoSave();
                    }
                }
            });

            // Global exclusions input
            document.getElementById('newGlobalPattern')?.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    const input = e.target;
                    const pattern = input.value.trim();
                    
                    if (!pattern) {
                        showError('Pattern cannot be empty', 'global');
                        return;
                    }

                    if (!validatePattern(pattern)) {
                        showError('Invalid pattern format. Use /folder_name for folders, .ext for file types, or filename.ext for specific files', 'global');
                        return;
                    }

                    if (!globalExclusions.includes(pattern)) {
                        addGlobalExclusion(pattern);
                        enabledGlobalExclusions.add(pattern);
                        autoSave();
                    }
                }
            });

            // Generate button
            document.getElementById('generateBtn')?.addEventListener('click', () => {
                const headerTemplate = document.getElementById('headerTemplate')?.value || '';
                
                document.getElementById('progressContainer').style.display = 'block';
                document.getElementById('generateBtn').disabled = true;

                vscode.postMessage({
                    command: 'generate',
                    projectExclusions: getEnabledExclusions('project'),
                    globalExclusions: getEnabledExclusions('global'),
                    headerTemplate
                });
            });

            // Header template
            document.getElementById('headerTemplate')?.addEventListener('input', autoSave);
        }

        function updateUI(config) {
            if (document.getElementById('headerTemplate')) {
                document.getElementById('headerTemplate').value = config.headerTemplate || '';
            }
            projectExclusions = config.projectExclusions || [];
            globalExclusions = config.globalExclusions || [];
            
            // Initialize enabled sets with all exclusions
            enabledProjectExclusions = new Set(projectExclusions);
            enabledGlobalExclusions = new Set(globalExclusions);
            
            updateExclusionList('project');
            updateExclusionList('global');
        }

        function updateExclusionList(type) {
            const list = document.getElementById(type === 'project' ? 'projectExclusionList' : 'globalExclusionList');
            if (!list) return;

            const exclusions = type === 'project' ? projectExclusions : globalExclusions;
            const enabledSet = type === 'project' ? enabledProjectExclusions : enabledGlobalExclusions;
            list.innerHTML = '';

            exclusions.forEach((pattern, index) => {
                const item = document.createElement('div');
                item.className = 'exclusion-item';
                item.innerHTML = \`
                    <input type="checkbox" \${enabledSet.has(pattern) ? 'checked' : ''}>
                    <span>\${pattern}</span>
                    <button class="remove-btn" aria-label="Remove exclusion">
                        <i class="codicon codicon-close"></i>
                    </button>
                \`;

                const checkbox = item.querySelector('input[type="checkbox"]');
                const removeBtn = item.querySelector('.remove-btn');
                
                checkbox?.addEventListener('change', (e) => {
                    if (e.target.checked) {
                        if (type === 'project') {
                            enabledProjectExclusions.add(pattern);
                        } else {
                            enabledGlobalExclusions.add(pattern);
                        }
                    } else {
                        if (type === 'project') {
                            enabledProjectExclusions.delete(pattern);
                        } else {
                            enabledGlobalExclusions.delete(pattern);
                        }
                    }
                    autoSave();
                });

                removeBtn?.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    if (type === 'project') {
                        projectExclusions.splice(index, 1);
                        enabledProjectExclusions.delete(pattern);
                    } else {
                        globalExclusions.splice(index, 1);
                        enabledGlobalExclusions.delete(pattern);
                    }
                    updateExclusionList(type);
                    autoSave();
                });

                list.appendChild(item);
            });
        }

        function getEnabledExclusions(type) {
            return type === 'project' 
                ? Array.from(enabledProjectExclusions)
                : Array.from(enabledGlobalExclusions);
        }

        function updateProgress(value, status) {
            const fill = document.getElementById('progressFill');
            const statusEl = document.getElementById('progressStatus');
            if (fill) fill.style.width = \`\${value}%\`;
            if (statusEl) statusEl.textContent = status;

            if (value === 100) {
                setTimeout(() => {
                    const container = document.getElementById('progressContainer');
                    const generateBtn = document.getElementById('generateBtn');
                    if (container) container.style.display = 'none';
                    if (generateBtn) generateBtn.disabled = false;
                }, 2000);
            }
        }

        function showNotification(message, type = 'success') {
            const notification = document.getElementById('notification');
            if (!notification) return;

            notification.textContent = message;
            notification.className = 'notification ' + type;
            notification.style.display = 'block';
            
            setTimeout(() => {
                notification.style.display = 'none';
            }, 3000);
        }

        function autoSave() {
            vscode.postMessage({
                command: 'saveConfig',
                config: {
                    projectExclusions: Array.from(enabledProjectExclusions),
                    globalExclusions: Array.from(enabledGlobalExclusions),
                    headerTemplate: document.getElementById('headerTemplate')?.value || '',
                    useRelativePaths: true
                }
            });
        }

        function showError(message, type = 'project') {
            const errorElement = document.getElementById(type + 'ErrorMessage');
            if (!errorElement) return;

            errorElement.textContent = message;
            errorElement.style.display = 'block';
            
            setTimeout(() => {
                errorElement.style.display = 'none';
            }, 5000);
        }

        function addProjectExclusion(pattern) {
            projectExclusions.push(pattern);
            document.getElementById('newProjectPattern').value = '';
            updateExclusionList('project');
        }

        function addGlobalExclusion(pattern) {
            globalExclusions.push(pattern);
            document.getElementById('newGlobalPattern').value = '';
            updateExclusionList('global');
        }
    `;
} 