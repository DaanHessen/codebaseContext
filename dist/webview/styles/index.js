/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ 19:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.styles = void 0;
// Import CSS files
const _shared_css_1 = __importDefault(__webpack_require__(20));
const _exclusions_css_1 = __importDefault(__webpack_require__(21));
const _progress_css_1 = __importDefault(__webpack_require__(22));
// Base CSS variables
const baseStyles = `
:root {
  --container-padding: 20px;
  --input-padding-vertical: 6px;
  --input-padding-horizontal: 8px;
  --input-margin-vertical: 4px;
  --input-margin-horizontal: 0;
}

body {
  padding: 0;
  margin: 0;
  color: var(--vscode-foreground);
  font-size: var(--vscode-font-size);
  font-weight: var(--vscode-font-weight);
  font-family: var(--vscode-font-family);
  background-color: var(--vscode-editor-background);
}
`;
// Combine all styles
exports.styles = `
${baseStyles}
${_shared_css_1.default}
${_exclusions_css_1.default}
${_progress_css_1.default}
`;


/***/ }),

/***/ 21:
/***/ ((module) => {

module.exports = "/* Exclusions list */\r\n.exclusion-list {\r\n  max-height: 200px;\r\n  overflow-y: auto;\r\n  border: 1px solid var(--vscode-panel-border);\r\n  border-radius: 2px;\r\n  background: var(--vscode-input-background);\r\n  margin-top: 0.5rem;\r\n}\r\n\r\n.exclusion-item {\r\n  display: flex;\r\n  align-items: center;\r\n  padding: 0.4rem 0.6rem;\r\n  border-bottom: 1px solid var(--vscode-panel-border);\r\n  gap: 0.5rem;\r\n  background: var(--vscode-input-background);\r\n}\r\n\r\n.exclusion-item:last-child {\r\n  border-bottom: none;\r\n}\r\n\r\n.exclusion-item input[type=\"checkbox\"] {\r\n  margin: 0;\r\n  width: 16px;\r\n  height: 16px;\r\n}\r\n\r\n.exclusion-item label {\r\n  flex: 1;\r\n  margin: 0;\r\n  cursor: pointer;\r\n  color: var(--vscode-foreground);\r\n  font-size: 0.9em;\r\n}\r\n\r\n.remove-btn {\r\n  background: none;\r\n  border: none;\r\n  color: var(--vscode-errorForeground);\r\n  cursor: pointer;\r\n  padding: 2px 6px;\r\n  opacity: 0.7;\r\n  font-size: 1.1em;\r\n  display: flex;\r\n  align-items: center;\r\n  justify-content: center;\r\n  min-width: 24px;\r\n}\r\n\r\n.remove-btn:hover {\r\n  opacity: 1;\r\n}\r\n\r\n/* Add exclusion input */\r\n.add-exclusion {\r\n  margin-bottom: 0.5rem;\r\n}\r\n\r\n.exclusion-input {\r\n  width: 100%;\r\n  padding: var(--input-padding-vertical) var(--input-padding-horizontal);\r\n  border: 1px solid var(--vscode-input-border);\r\n  background: var(--vscode-input-background);\r\n  color: var(--vscode-input-foreground);\r\n  border-radius: 2px;\r\n  font-size: 0.9em;\r\n}\r\n\r\n/* Original exclusions.css styles below */\r\n.exclusions-list {\r\n  margin-top: 1rem;\r\n}\r\n\r\n.exclusions-list h3 {\r\n  margin: 0 0 1rem 0;\r\n  font-size: 1.1em;\r\n  font-weight: normal;\r\n  color: var(--vscode-foreground);\r\n}\r\n\r\n.exclusions-list .description {\r\n  color: var(--vscode-descriptionForeground);\r\n  font-size: 0.9em;\r\n  margin-bottom: 16px;\r\n}\r\n\r\n.scroll-container {\r\n  max-height: calc(100vh - 400px);\r\n  min-height: 200px;\r\n  overflow-y: auto;\r\n  border: 1px solid var(--vscode-panel-border);\r\n  border-radius: 4px;\r\n  padding: 0.5rem;\r\n  margin-bottom: 16px;\r\n}\r\n\r\n.exclusion-controls {\r\n  display: flex;\r\n  align-items: center;\r\n  gap: 4px;\r\n  min-width: 44px;\r\n}\r\n\r\n.exclusion-item .exclusion-checkbox {\r\n  margin: 0;\r\n  width: 16px;\r\n  height: 16px;\r\n  padding: 0;\r\n}\r\n\r\n.exclusion-item .file-path {\r\n  color: var(--vscode-foreground);\r\n  word-break: break-all;\r\n  text-align: right;\r\n  flex: 1;\r\n  margin-left: auto;\r\n}\r\n\r\n.add-exclusion input {\r\n  width: 100%;\r\n  padding: 6px 10px;\r\n  border: 1px solid var(--vscode-input-border);\r\n  background: var(--vscode-input-background);\r\n  color: var(--vscode-input-foreground);\r\n  border-radius: 4px;\r\n} ";

/***/ }),

/***/ 22:
/***/ ((module) => {

module.exports = "/* Progress bar */\n.progress-container {\n  display: none;\n  margin: 1rem 0;\n}\n\n.progress-bar {\n  width: 100%;\n  height: 4px;\n  background: var(--vscode-progressBar-background);\n  border-radius: 2px;\n  overflow: hidden;\n}\n\n.progress-fill {\n  height: 100%;\n  width: 0;\n  background: var(--vscode-progressBar-foreground);\n  transition: width 0.3s ease;\n}\n\n.progress-status {\n  margin-top: 0.5rem;\n  font-size: 0.9em;\n  color: var(--vscode-descriptionForeground);\n} ";

/***/ }),

/***/ 20:
/***/ ((module) => {

module.exports = "/* Base styles */\r\n:root {\r\n  --container-padding: 20px;\r\n  --input-padding-vertical: 6px;\r\n  --input-padding-horizontal: 8px;\r\n  --input-margin-vertical: 4px;\r\n  --input-margin-horizontal: 0;\r\n}\r\n\r\nbody {\r\n  padding: 0;\r\n  margin: 0;\r\n  color: var(--vscode-foreground);\r\n  font-size: var(--vscode-font-size);\r\n  font-weight: var(--vscode-font-weight);\r\n  font-family: var(--vscode-font-family);\r\n  background-color: var(--vscode-editor-background);\r\n}\r\n\r\n.container {\r\n  padding: var(--container-padding);\r\n  height: 100vh;\r\n  display: flex;\r\n  flex-direction: column;\r\n}\r\n\r\n.content {\r\n  flex: 1;\r\n  overflow-y: auto;\r\n  padding-right: 0.5rem;\r\n}\r\n\r\n/* Tabs */\r\n.tabs {\r\n  display: flex;\r\n  gap: 0.5rem;\r\n  border-bottom: 1px solid var(--vscode-panel-border);\r\n  padding-bottom: 0.5rem;\r\n  margin-bottom: 1rem;\r\n  background: var(--vscode-editor-background);\r\n  position: sticky;\r\n  top: 0;\r\n  z-index: 1;\r\n}\r\n\r\n.tab {\r\n  background: none;\r\n  border: none;\r\n  color: var(--vscode-foreground);\r\n  padding: 0.5rem 1rem;\r\n  cursor: pointer;\r\n  opacity: 0.7;\r\n  border-bottom: 2px solid transparent;\r\n  font-size: inherit;\r\n}\r\n\r\n.tab:hover {\r\n  opacity: 0.9;\r\n}\r\n\r\n.tab.active {\r\n  opacity: 1;\r\n  border-bottom-color: var(--vscode-focusBorder);\r\n}\r\n\r\n/* Content sections */\r\n.tab-content {\r\n  display: none;\r\n}\r\n\r\n.tab-content.active {\r\n  display: block;\r\n}\r\n\r\n.section {\r\n  margin-bottom: 1.5rem;\r\n}\r\n\r\n.section-header {\r\n  font-size: 1.1em;\r\n  font-weight: 600;\r\n  margin-bottom: 0.5rem;\r\n  color: var(--vscode-foreground);\r\n}\r\n\r\n.section-description {\r\n  font-size: 0.9em;\r\n  margin-bottom: 1rem;\r\n  color: var(--vscode-descriptionForeground);\r\n}\r\n\r\n.section-content {\r\n  display: flex;\r\n  flex-direction: column;\r\n  gap: 0.5rem;\r\n}\r\n\r\n/* Form elements */\r\ninput[type=\"text\"],\r\ntextarea {\r\n  width: 100%;\r\n  padding: var(--input-padding-vertical) var(--input-padding-horizontal);\r\n  border: 1px solid var(--vscode-input-border);\r\n  background: var(--vscode-input-background);\r\n  color: var(--vscode-input-foreground);\r\n  border-radius: 2px;\r\n}\r\n\r\ntextarea {\r\n  min-height: 100px;\r\n  resize: vertical;\r\n}\r\n\r\n/* Generate button */\r\n.generate-button {\r\n  width: 100%;\r\n  background: var(--vscode-button-background);\r\n  color: var(--vscode-button-foreground);\r\n  border: none;\r\n  padding: 0.6rem 1rem;\r\n  border-radius: 2px;\r\n  cursor: pointer;\r\n  font-size: 1em;\r\n  margin-top: 1rem;\r\n  text-align: center;\r\n}\r\n\r\n.generate-button:hover {\r\n  background: var(--vscode-button-hoverBackground);\r\n}\r\n\r\n.generate-button:disabled {\r\n  opacity: 0.5;\r\n  cursor: not-allowed;\r\n} ";

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
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__(19);
/******/ 	module.exports = __webpack_exports__;
/******/ 	
/******/ })()
;
//# sourceMappingURL=index.js.map