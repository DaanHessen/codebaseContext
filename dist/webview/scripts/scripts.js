/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ 19:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Notification = void 0;
class Notification {
    static render() {
        return `
      <div id="notification" class="notification" style="display: none;">
        <span id="notificationMessage"></span>
      </div>
    `;
    }
    static show(message, type = 'success') {
        const notification = document.getElementById('notification');
        const messageEl = document.getElementById('notificationMessage');
        if (!notification || !messageEl)
            return;
        messageEl.textContent = message;
        notification.className = `notification ${type}`;
        notification.style.display = 'block';
        setTimeout(() => {
            notification.style.display = 'none';
        }, 3000);
    }
}
exports.Notification = Notification;


/***/ }),

/***/ 33:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ChatController = void 0;
class ChatController {
    static initialize(vscode) {
        this.vscode = vscode;
        this.chatInput = document.getElementById('chatInput');
        this.modelSelector = document.getElementById('modelSelector');
        this.chatMessages = document.getElementById('chatMessages');
        this.sendButton = document.getElementById('sendMessage');
        this.typingIndicator = document.getElementById('typingIndicator');
        this.thinkingIndicator = document.getElementById('thinkingIndicator');
        this.thinkingContent = document.querySelector('#thinkingIndicator .thinking-content');
        if (!this.chatInput || !this.modelSelector || !this.chatMessages || !this.sendButton ||
            !this.typingIndicator || !this.thinkingIndicator || !this.thinkingContent) {
            console.error('Chat elements not found');
            return;
        }
        this.chatInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });
        this.sendButton.addEventListener('click', () => {
            this.sendMessage();
        });
    }
    static sendMessage() {
        if (!this.chatInput || !this.modelSelector || !this.chatMessages || !this.vscode ||
            !this.sendButton || !this.typingIndicator || !this.thinkingIndicator || !this.thinkingContent)
            return;
        const message = this.chatInput.value.trim();
        if (!message)
            return;
        this.addMessage('user', message);
        this.chatInput.value = '';
        this.sendButton.disabled = true;
        if (this.modelSelector.value === 'deepseek-reasoner') {
            this.showThinking();
            // Simulate thinking process
            let thoughts = [
                "Analyzing the context...",
                "Considering possible approaches...",
                "Evaluating the best solution...",
                "Formulating response..."
            ];
            let currentThought = 0;
            const thinkingInterval = setInterval(() => {
                if (currentThought < thoughts.length) {
                    this.updateThinking(thoughts[currentThought]);
                    currentThought++;
                }
                else {
                    clearInterval(thinkingInterval);
                    this.hideThinking();
                    this.showTyping();
                    // Simulate response after thinking
                    setTimeout(() => {
                        this.hideTyping();
                        this.addMessage('assistant', 'After careful consideration, here is my response...');
                    }, 2000);
                }
            }, 1500);
        }
        else {
            this.showTyping();
            // For now, simulate a response after 2 seconds
            setTimeout(() => {
                this.hideTyping();
                this.addMessage('assistant', 'This is a simulated response. The API integration will be implemented soon.');
            }, 2000);
        }
        this.vscode.postMessage({
            command: 'chat',
            message,
            model: this.modelSelector.value
        });
    }
    static showThinking() {
        this.thinkingIndicator?.classList.add('visible');
    }
    static hideThinking() {
        this.thinkingIndicator?.classList.remove('visible');
    }
    static updateThinking(thought) {
        if (this.thinkingContent) {
            this.thinkingContent.textContent = thought;
        }
    }
    static showTyping() {
        this.typingIndicator?.classList.add('visible');
    }
    static hideTyping() {
        this.typingIndicator?.classList.remove('visible');
    }
    static addMessage(role, content) {
        if (!this.chatMessages || !this.sendButton)
            return;
        const messageDiv = document.createElement('div');
        messageDiv.className = `chat-message ${role}`;
        // Convert markdown code blocks to HTML
        const formattedContent = content.replace(/```(\w+)?\n([\s\S]*?)```/g, (_, lang, code) => {
            return `<pre><code class="language-${lang || ''}">${this.escapeHtml(code.trim())}</code></pre>`;
        });
        messageDiv.innerHTML = formattedContent;
        this.chatMessages.appendChild(messageDiv);
        this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
        if (role === 'assistant') {
            this.sendButton.disabled = false;
        }
    }
    static escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}
exports.ChatController = ChatController;
ChatController.chatInput = null;
ChatController.modelSelector = null;
ChatController.chatMessages = null;
ChatController.sendButton = null;
ChatController.typingIndicator = null;
ChatController.thinkingIndicator = null;
ChatController.thinkingContent = null;


/***/ }),

/***/ 30:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ExclusionController = void 0;
class ExclusionController {
    constructor(postMessage, projectExclusions = [], globalExclusions = []) {
        this.postMessage = postMessage;
        this.enabledExclusions = new Map();
        this.enabledExclusions.set('project', new Set(projectExclusions));
        this.enabledExclusions.set('global', new Set(globalExclusions));
        this.initializeListeners();
        this.updateUI('project');
        this.updateUI('global');
    }
    getProjectExclusions() {
        return this.enabledExclusions.get('project') || new Set();
    }
    getGlobalExclusions() {
        return this.enabledExclusions.get('global') || new Set();
    }
    setExclusions(type, exclusions) {
        this.enabledExclusions.set(type, new Set(exclusions));
        this.updateUI(type);
    }
    initializeListeners() {
        ['project', 'global'].forEach(type => {
            const input = document.getElementById(`new${this.capitalize(type)}Pattern`);
            if (input) {
                input.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter') {
                        const pattern = input.value.trim();
                        if (pattern) {
                            this.handlePatternAdd(type, pattern);
                            input.value = '';
                        }
                    }
                });
            }
        });
    }
    handlePatternAdd(type, pattern) {
        if (this.validatePattern(pattern)) {
            const patterns = this.enabledExclusions.get(type);
            patterns.add(pattern);
            this.emitUpdate();
            this.updateUI(type);
        }
    }
    handlePatternRemove(type, pattern) {
        const patterns = this.enabledExclusions.get(type);
        patterns.delete(pattern);
        this.emitUpdate();
        this.updateUI(type);
    }
    handlePatternToggle(type, pattern, enabled) {
        const patterns = this.enabledExclusions.get(type);
        if (enabled) {
            patterns.add(pattern);
        }
        else {
            patterns.delete(pattern);
        }
        this.emitUpdate();
    }
    validatePattern(pattern) {
        return pattern.length > 0 && /^[^<>"|?*]+$/.test(pattern);
    }
    updateUI(type) {
        const container = document.getElementById(`${type}ExclusionList`);
        if (!container)
            return;
        container.innerHTML = '';
        const patterns = Array.from(this.enabledExclusions.get(type)).sort();
        patterns.forEach(pattern => {
            const itemDiv = document.createElement('div');
            itemDiv.className = 'exclusion-item';
            itemDiv.dataset.type = type;
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.id = `${type}_${pattern}`;
            checkbox.checked = true;
            checkbox.addEventListener('change', () => {
                this.handlePatternToggle(type, pattern, checkbox.checked);
            });
            const label = document.createElement('label');
            label.htmlFor = `${type}_${pattern}`;
            label.textContent = pattern;
            const removeBtn = document.createElement('button');
            removeBtn.className = 'remove-btn';
            removeBtn.title = 'Remove exclusion';
            removeBtn.dataset.pattern = pattern;
            removeBtn.innerHTML = '×';
            removeBtn.addEventListener('click', () => {
                this.handlePatternRemove(type, pattern);
            });
            itemDiv.appendChild(checkbox);
            itemDiv.appendChild(label);
            itemDiv.appendChild(removeBtn);
            container.appendChild(itemDiv);
        });
    }
    emitUpdate() {
        this.postMessage({
            command: 'saveConfig',
            config: {
                projectExclusions: Array.from(this.enabledExclusions.get('project')),
                globalExclusions: Array.from(this.enabledExclusions.get('global')),
                headerTemplate: document.getElementById('headerTemplate')?.value || ''
            }
        });
    }
    capitalize(s) {
        return s.charAt(0).toUpperCase() + s.slice(1);
    }
}
exports.ExclusionController = ExclusionController;


/***/ }),

/***/ 32:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ProgressController = void 0;
class ProgressController {
    static initialize(vscode) {
        this.vscode = vscode;
        this.progressFill = document.getElementById('progressFill');
        this.progressStatus = document.getElementById('progressStatus');
        this.progressContainer = document.getElementById('progressContainer');
        this.generateBtn = document.getElementById('generateBtn');
        this.cancelBtn = document.getElementById('cancelBtn');
        if (!this.progressFill || !this.progressStatus || !this.progressContainer || !this.generateBtn || !this.cancelBtn) {
            console.error('Progress elements not found');
            return;
        }
        this.cancelBtn.style.display = 'none';
        this.generateBtn.addEventListener('click', () => {
            this.showProgress();
        });
        this.cancelBtn.addEventListener('click', () => {
            this.cancelGeneration();
        });
    }
    static update(value, status) {
        if (!this.progressFill || !this.progressStatus)
            return;
        this.showProgress();
        this.progressFill.style.width = `${value}%`;
        this.progressStatus.textContent = status;
        if (value >= 100) {
            setTimeout(() => this.hideProgress(), 2000);
        }
    }
    static showProgress() {
        if (!this.progressContainer || !this.generateBtn || !this.cancelBtn)
            return;
        this.progressContainer.style.display = 'block';
        this.generateBtn.style.display = 'none';
        this.cancelBtn.style.display = 'block';
    }
    static hideProgress() {
        if (!this.progressContainer || !this.generateBtn || !this.cancelBtn)
            return;
        this.progressContainer.style.display = 'none';
        this.generateBtn.style.display = 'block';
        this.cancelBtn.style.display = 'none';
    }
    static cancelGeneration() {
        if (!this.vscode)
            return;
        this.vscode.postMessage({
            command: 'cancel'
        });
        this.hideProgress();
    }
}
exports.ProgressController = ProgressController;
ProgressController.progressFill = null;
ProgressController.progressStatus = null;
ProgressController.progressContainer = null;
ProgressController.generateBtn = null;
ProgressController.cancelBtn = null;


/***/ }),

/***/ 31:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TabController = void 0;
class TabController {
    static init() {
        const initialTab = document.querySelector('.tab[data-tab="exclusions"]');
        if (initialTab) {
            this.switchTab(initialTab);
        }
        document.querySelectorAll('.tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                this.switchTab(e.currentTarget);
            });
        });
    }
    static switchTab(tab) {
        const tabName = tab.getAttribute('data-tab');
        if (!tabName)
            return;
        document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(c => {
            c.classList.remove('active');
            c.style.display = 'none';
        });
        tab.classList.add('active');
        const content = document.querySelector(`.tab-content[data-tab="${tabName}"]`);
        if (content) {
            content.classList.add('active');
            content.style.display = 'block';
        }
    }
}
exports.TabController = TabController;


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be isolated against other modules in the chunk.
(() => {
var exports = __webpack_exports__;

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getScripts = getScripts;
const ExclusionController_1 = __webpack_require__(30);
const TabController_1 = __webpack_require__(31);
const ProgressController_1 = __webpack_require__(32);
const ChatController_1 = __webpack_require__(33);
const Notification_1 = __webpack_require__(19);
// Default header template
const DEFAULT_HEADER_TEMPLATE = `# {projectName}
Generated on: {date}
Workspace: {workspacePath}

## File Structure
{fileTree}

## Files
{content}`;
const vscode = acquireVsCodeApi();
window.addEventListener('load', () => {
    const state = vscode.getState() || {
        projectExclusions: [],
        globalExclusions: [],
        headerTemplate: DEFAULT_HEADER_TEMPLATE
    };
    TabController_1.TabController.init();
    ProgressController_1.ProgressController.initialize(vscode);
    ChatController_1.ChatController.initialize(vscode);
    const exclusionController = new ExclusionController_1.ExclusionController((msg) => vscode.postMessage(msg), state.projectExclusions, state.globalExclusions);
    window.addEventListener('message', (event) => {
        const message = event.data;
        switch (message.type) {
            case 'updateProgress':
                ProgressController_1.ProgressController.update(message.value, message.status);
                break;
            case 'updateState':
                vscode.setState(message.state);
                break;
            case 'config':
                updateUI(message);
                break;
            case 'progress':
                ProgressController_1.ProgressController.update(message.value, message.status);
                break;
            case 'cancelled':
                ProgressController_1.ProgressController.update(0, 'Cancelled');
                Notification_1.Notification.show('Generation cancelled', 'error');
                break;
            case 'saveSuccess':
                Notification_1.Notification.show('Settings saved successfully');
                break;
            case 'error':
                Notification_1.Notification.show(message.message, 'error');
                break;
            case 'chatResponse':
                ChatController_1.ChatController.addMessage('assistant', message.response);
                break;
        }
    });
    const generateBtn = document.getElementById('generateBtn');
    if (generateBtn) {
        generateBtn.addEventListener('click', () => {
            const headerTemplate = document.getElementById('headerTemplate')?.value || DEFAULT_HEADER_TEMPLATE;
            const projectExclusions = Array.from(exclusionController.getProjectExclusions());
            const globalExclusions = Array.from(exclusionController.getGlobalExclusions());
            vscode.postMessage({
                command: 'generate',
                projectExclusions,
                globalExclusions,
                headerTemplate
            });
        });
    }
    const resetStorageBtn = document.getElementById('resetStorageBtn');
    if (resetStorageBtn) {
        resetStorageBtn.addEventListener('click', () => {
            if (confirm('Are you sure you want to reset all settings and exclusions? This cannot be undone.')) {
                vscode.postMessage({
                    command: 'resetStorage'
                });
            }
        });
    }
    vscode.postMessage({ command: 'getConfig' });
});
function updateUI(config) {
    const headerTemplate = document.getElementById('headerTemplate');
    if (headerTemplate) {
        headerTemplate.value = config.headerTemplate || DEFAULT_HEADER_TEMPLATE;
    }
    const exclusionController = new ExclusionController_1.ExclusionController((msg) => vscode.postMessage(msg), config.projectExclusions || [], config.globalExclusions || []);
    vscode.setState({
        projectExclusions: config.projectExclusions || [],
        globalExclusions: config.globalExclusions || [],
        headerTemplate: config.headerTemplate || DEFAULT_HEADER_TEMPLATE
    });
    if (config.projectExclusions) {
        exclusionController.setExclusions('project', config.projectExclusions);
    }
    if (config.globalExclusions) {
        exclusionController.setExclusions('global', config.globalExclusions);
    }
}
function getScripts() {
    return `
        const exclusionController = new ExclusionController(vscode.postMessage);
        const progressController = new ProgressController();
        
        ${ExclusionController_1.ExclusionController.toString()}
        ${TabController_1.TabController.toString()}
        ${ProgressController_1.ProgressController.toString()}
        let vscode;
        let activeTab = 'exclusions';
        let projectExclusions = [];
        let globalExclusions = [];
        let initialized = false;
        let enabledProjectExclusions = new Set();
        let enabledGlobalExclusions = new Set();

        try {
            vscode = acquireVsCodeApi();
        } catch (error) {
            console.error('Failed to acquire VS Code API:', error);
            throw error;
        }

        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initializeWebview);
        } else {
            initializeWebview();
        }

        function initializeWebview() {
            if (initialized) return;
            
            try {
                window.onerror = function(message, source, lineno, colno, error) {
                    console.error('Error:', message, 'at', source, ':', lineno, ':', colno);
                    showError(message);
                    return false;
                };

                window.addEventListener('message', event => {
                    const message = event.data;
                    try {
                        switch (message.type) {
                            case 'config':
                                updateUI(message.config || message);
                                break;
                            case 'progress':
                                ProgressController.update(message.value, message.status);
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

                initializeTabs();
                setupEventListeners();
                
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
            if (pattern.startsWith('/')) return true; // Folder pattern
            if (pattern.startsWith('.')) return true; // File type pattern
            if (pattern.includes('.')) return true; // Specific file pattern
            return false;
        }

        function setupEventListeners() {
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

            document.getElementById('headerTemplate')?.addEventListener('input', autoSave);
        }

        function updateUI(config) {
            if (document.getElementById('headerTemplate')) {
                document.getElementById('headerTemplate').value = config.headerTemplate || '';
            }
            projectExclusions = config.projectExclusions || [];
            globalExclusions = config.globalExclusions || [];
            
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

        document.addEventListener('DOMContentLoaded', () => {
            ProgressController.initialize();
        });
    `;
}

})();

module.exports = __webpack_exports__;
/******/ })()
;
//# sourceMappingURL=scripts.js.map