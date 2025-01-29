/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ 24:
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
    initializeListeners() {
        // Add pattern listeners
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
        // Remove pattern listeners
        document.addEventListener('click', (e) => {
            const target = e.target;
            if (target.closest('.remove-btn')) {
                const btn = target.closest('.remove-btn');
                const pattern = btn.dataset.pattern;
                const item = btn.closest('.exclusion-item');
                const type = item.dataset.type;
                if (pattern && type) {
                    this.handlePatternRemove(type, pattern);
                }
            }
        });
        // Toggle pattern listeners
        document.addEventListener('change', (e) => {
            const target = e.target;
            if (target.closest('.exclusion-item')) {
                const checkbox = target;
                const item = target.closest('.exclusion-item');
                const type = item.dataset.type;
                const pattern = checkbox.id.split('_')[1];
                if (pattern && type) {
                    this.handlePatternToggle(type, pattern, checkbox.checked);
                }
            }
        });
        // Generate button listener
        const generateBtn = document.getElementById('generateBtn');
        if (generateBtn) {
            generateBtn.addEventListener('click', () => {
                const headerTemplate = document.getElementById('headerTemplate')?.value || '';
                this.postMessage({
                    command: 'generate',
                    projectExclusions: Array.from(this.enabledExclusions.get('project')),
                    globalExclusions: Array.from(this.enabledExclusions.get('global')),
                    headerTemplate
                });
            });
        }
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
        return pattern.length > 0 && /^[^<>:"|?*]+$/.test(pattern);
    }
    updateUI(type) {
        const container = document.getElementById(`${type}ExclusionList`);
        if (container) {
            const patterns = Array.from(this.enabledExclusions.get(type));
            container.innerHTML = patterns.map(p => this.renderExclusionItem(p, type)).join('');
        }
    }
    renderExclusionItem(pattern, type) {
        return `
      <div class="exclusion-item" data-type="${type}">
        <input type="checkbox" id="${type}_${pattern}" checked>
        <label for="${type}_${pattern}">${pattern}</label>
        <button class="remove-btn" data-pattern="${pattern}" title="Remove exclusion">×</button>
      </div>
    `;
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

/***/ 26:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ProgressController = void 0;
class ProgressController {
    static initialize() {
        this.progressFill = document.getElementById('progressFill');
        this.progressStatus = document.getElementById('progressStatus');
        this.progressContainer = document.getElementById('progressContainer');
        this.generateBtn = document.getElementById('generateBtn');
        if (!this.progressFill || !this.progressStatus || !this.progressContainer || !this.generateBtn) {
            console.error('Progress elements not found');
            return;
        }
        this.generateBtn.addEventListener('click', () => {
            this.showProgress();
        });
    }
    static update(value, status) {
        if (!this.progressFill || !this.progressStatus)
            return;
        this.progressFill.style.width = `${value}%`;
        this.progressStatus.textContent = status;
        if (value >= 100) {
            setTimeout(() => this.hideProgress(), 2000);
        }
    }
    static showProgress() {
        if (!this.progressContainer || !this.generateBtn)
            return;
        this.progressContainer.style.display = 'block';
        this.generateBtn.disabled = true;
        this.update(0, 'Starting...');
    }
    static hideProgress() {
        if (!this.progressContainer || !this.generateBtn)
            return;
        this.progressContainer.style.display = 'none';
        this.generateBtn.disabled = false;
    }
}
exports.ProgressController = ProgressController;
ProgressController.progressFill = null;
ProgressController.progressStatus = null;
ProgressController.progressContainer = null;
ProgressController.generateBtn = null;


/***/ }),

/***/ 25:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TabController = void 0;
class TabController {
    static init() {
        document.querySelectorAll('.tab').forEach(tab => {
            tab.addEventListener('click', () => {
                const tabName = tab.getAttribute('data-tab');
                if (!tabName)
                    return;
                // Update active states
                document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
                document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
                tab.classList.add('active');
                const content = document.querySelector(`.tab-content[data-tab="${tabName}"]`);
                if (content) {
                    content.classList.add('active');
                }
            });
        });
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
const ExclusionController_1 = __webpack_require__(24);
const TabController_1 = __webpack_require__(25);
const ProgressController_1 = __webpack_require__(26);
const vscode = acquireVsCodeApi();
// Initialize controllers
window.addEventListener('load', () => {
    const state = vscode.getState() || {
        projectExclusions: [],
        globalExclusions: [],
        headerTemplate: ''
    };
    // Initialize tab switching
    TabController_1.TabController.init();
    // Initialize progress tracking
    ProgressController_1.ProgressController.initialize();
    // Initialize exclusion management
    const exclusionController = new ExclusionController_1.ExclusionController((msg) => vscode.postMessage(msg), state.projectExclusions, state.globalExclusions);
    // Handle messages from extension
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
        }
    });
    // Request initial configuration
    vscode.postMessage({ command: 'getConfig' });
});
function updateUI(config) {
    // Update header template
    const headerTemplate = document.getElementById('headerTemplate');
    if (headerTemplate) {
        headerTemplate.value = config.headerTemplate || '';
    }
    // Update exclusions
    const exclusionController = new ExclusionController_1.ExclusionController((msg) => vscode.postMessage(msg), config.projectExclusions || [], config.globalExclusions || []);
}
function getScripts() {
    return `
        // Initialization code using new controllers
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

        // Add initialization call
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