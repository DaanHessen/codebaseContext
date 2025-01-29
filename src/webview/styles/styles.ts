export function getStyles(): string {
    return `
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
            background: var(--vscode-editor-background);
        }

        .container {
            height: 100%;
            display: flex;
            flex-direction: column;
            padding: var(--container-padding);
            position: relative;
            padding-bottom: calc(var(--container-padding) + 80px);
            max-width: 1200px;
            margin: 0 auto;
        }

        /* Exclusions styles */
        .exclusions-list {
            margin-top: 1rem;
        }

        .exclusions-list h3 {
            margin: 0 0 1rem 0;
            font-size: 1.1em;
            font-weight: normal;
            color: var(--vscode-foreground);
        }

        .exclusions-list .description {
            color: var(--vscode-descriptionForeground);
            font-size: 0.9em;
            margin-bottom: 16px;
        }

        .scroll-container {
            max-height: calc(100vh - 400px);
            min-height: 200px;
            overflow-y: auto;
            border: 1px solid var(--vscode-panel-border);
            border-radius: 4px;
            padding: 0.5rem;
            margin-bottom: 16px;
        }

        .exclusion-item {
            display: flex;
            align-items: center;
            padding: 4px 8px;
            font-family: var(--vscode-editor-font-family);
            font-size: 0.9em;
        }

        .exclusion-controls {
            display: flex;
            align-items: center;
            gap: 4px;
            margin-right: 8px;
        }

        .exclusion-item .exclusion-checkbox {
            margin: 0;
            width: 16px;
            height: 16px;
            padding: 0;
        }

        .exclusion-item .remove-btn {
            background: none;
            border: none;
            width: 16px;
            height: 16px;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            color: var(--vscode-icon-foreground);
            opacity: 0.7;
            padding: 0;
            font-family: codicon;
            font-size: 14px;
            line-height: 1;
        }

        .exclusion-item .remove-btn:hover {
            opacity: 1;
            color: var(--vscode-errorForeground);
        }

        .exclusion-item .remove-btn::before {
            content: "\\eb99";
        }

        .exclusion-item .file-path {
            color: var(--vscode-foreground);
            word-break: break-all;
            flex: 1;
            text-align: left;
        }

        .add-exclusion {
            margin-bottom: 12px;
        }

        .add-exclusion input {
            width: 100%;
            padding: 6px 10px;
            border: 1px solid var(--vscode-input-border);
            background: var(--vscode-input-background);
            color: var(--vscode-input-foreground);
            border-radius: 4px;
        }

        /* Tabs */
        .tabs {
            display: flex;
            gap: 8px;
            margin-bottom: 16px;
            border-bottom: 1px solid var(--vscode-panel-border);
        }

        .tab {
            padding: 8px 16px;
            background: none;
            border: none;
            color: var(--vscode-foreground);
            cursor: pointer;
            border-bottom: 2px solid transparent;
            margin-bottom: -1px;
        }

        .tab.active {
            border-color: var(--vscode-focusBorder);
            font-weight: 500;
        }

        .tab-content {
            display: none;
        }

        .tab-content.active {
            display: block;
        }

        /* Error message */
        .error-message {
            color: var(--vscode-errorForeground);
            font-size: 12px;
            margin: 4px 0;
            display: none;
        }

        .info-message {
            background: var(--vscode-textBlockQuote-background);
            border-left: 4px solid var(--vscode-focusBorder);
            padding: 8px 12px;
            margin: 8px 0;
            font-size: 12px;
            line-height: 1.4;
        }

        /* Common styles */
        .section {
            background: var(--vscode-editor-background);
            border-radius: 6px;
            border: 1px solid var(--vscode-panel-border);
            margin-bottom: var(--section-spacing);
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

        .section-description {
            color: var(--vscode-descriptionForeground);
            font-size: 12px;
            margin: 8px 0;
            line-height: 1.4;
            padding: 0 14px;
        }

        .section-content {
            padding: 14px;
        }

        /* Progress bar */
        .progress-container {
            position: fixed;
            bottom: 80px;
            left: 0;
            right: 0;
            padding: var(--container-padding);
            background: var(--vscode-editor-background);
            display: none;
            z-index: 98;
        }

        .progress-bar {
            width: 100%;
            height: 4px;
            background: var(--vscode-progressBar-background);
            border-radius: 2px;
            overflow: hidden;
        }

        .progress-fill {
            height: 100%;
            width: 0%;
            background: var(--vscode-progressBar-foreground);
            transition: width 0.3s ease;
        }

        .progress-status {
            font-size: 11px;
            color: var(--vscode-descriptionForeground);
            margin-top: 4px;
            text-align: center;
        }

        /* Button container */
        .button-container {
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            padding: var(--container-padding);
            background: var(--vscode-editor-background);
            border-top: 1px solid var(--vscode-panel-border);
            z-index: 99;
            display: flex;
            justify-content: center;
        }

        .generate-button-wrapper {
            width: 100%;
            max-width: 300px;
            background: var(--vscode-editor-background);
            border: 1px solid var(--vscode-panel-border);
            border-radius: 6px;
            padding: 2px;
        }

        .button-container button {
            width: 100%;
            background: var(--vscode-button-background);
            color: var(--vscode-button-foreground);
            border: none;
            padding: 8px 24px;
            border-radius: 4px;
            font-weight: 500;
            cursor: pointer;
        }

        .button-container button:hover {
            background: var(--vscode-button-hoverBackground);
        }

        .button-container button:disabled {
            opacity: 0.5;
            cursor: not-allowed;
        }

        /* Notifications */
        .notification {
            position: fixed;
            bottom: 20px;
            right: 20px;
            padding: 8px 12px;
            border-radius: 4px;
            font-size: 12px;
            display: none;
            z-index: 1000;
        }

        .notification.success {
            background: var(--vscode-notificationsSuccessIcon-foreground);
            color: var(--vscode-editor-background);
        }

        .notification.error {
            background: var(--vscode-notificationsErrorIcon-foreground);
            color: var(--vscode-editor-background);
        }
    `;
} 