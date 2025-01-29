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
            padding-bottom: calc(var(--container-padding) + 48px);
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

        .tab-nav {
            display: flex;
            gap: 1rem;
            margin-bottom: 1.5rem;
            border-bottom: 1px solid var(--vscode-panel-border);
        }

        .tab-btn {
            padding: 0.5rem 1rem;
            border: none;
            background: none;
            color: var(--vscode-foreground);
            cursor: pointer;
            border-bottom: 2px solid transparent;
            margin-bottom: -1px;
        }

        .tab-btn.active {
            border-color: var(--vscode-focusBorder);
            font-weight: 600;
        }

        .tab-content {
            display: none;
            padding: 1rem 0;
        }

        .tab-content.active {
            display: block;
        }

        .exclusions-list {
            margin-top: 1rem;
        }

        .exclusions-list h3 {
            margin: 0 0 1rem 0;
            font-size: 1.1em;
            font-weight: normal;
            color: var(--vscode-foreground);
        }

        .scroll-container {
            max-height: 400px;
            overflow-y: auto;
            border: 1px solid var(--vscode-panel-border);
            border-radius: 4px;
            padding: 0.5rem;
        }

        .exclusion-item {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            padding: 0.25rem 0;
            font-family: var(--vscode-editor-font-family);
            font-size: 0.9em;
        }

        .file-icon {
            opacity: 0.7;
        }

        .file-path {
            color: var(--vscode-foreground);
            word-break: break-all;
        }

        .generate-btn {
            position: fixed;
            bottom: var(--container-padding);
            right: var(--container-padding);
            padding: 8px 12px;
            background: var(--vscode-button-background);
            color: var(--vscode-button-foreground);
            border: none;
            border-radius: 2px;
            cursor: pointer;
        }

        .generate-btn:hover {
            background: var(--vscode-button-hoverBackground);
        }

        .generate-btn:disabled {
            opacity: 0.5;
            cursor: not-allowed;
        }

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

        .exclusion-container {
            display: flex;
            flex-direction: column;
            gap: var(--section-spacing);
        }

        .exclusion-list {
            border: 1px solid var(--vscode-panel-border);
            border-radius: 4px;
            max-height: 200px;
            overflow-y: auto;
        }

        .exclusion-item input[type="checkbox"] {
            margin-right: 8px;
        }

        .exclusion-item span {
            flex: 1;
            margin-right: 8px;
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
            padding: var(--container-padding);
            display: none;
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

        .remove-btn {
            padding: 4px 8px;
            background: none;
            border: none;
            color: var(--vscode-errorForeground);
            cursor: pointer;
            opacity: 0.7;
        }

        .remove-btn:hover {
            opacity: 1;
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

        .error-message {
            color: var(--vscode-errorForeground);
            background: var(--vscode-inputValidation-errorBackground);
            border: 1px solid var(--vscode-inputValidation-errorBorder);
            padding: 8px;
            margin-top: 8px;
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
            padding: 12px 0;
        }

        .setting-label {
            margin-bottom: 8px;
        }

        .setting-label label {
            font-weight: 500;
            display: block;
            margin-bottom: 4px;
        }

        .setting-description {
            font-size: 12px;
            color: var(--vscode-descriptionForeground);
        }

        .setting-control textarea {
            width: 100%;
            min-height: 200px;
            padding: 8px;
            font-family: var(--vscode-editor-font-family);
            font-size: var(--vscode-editor-font-size);
            line-height: 1.5;
            background: var(--vscode-input-background);
            color: var(--vscode-input-foreground);
            border: 1px solid var(--vscode-input-border);
            border-radius: 4px;
            resize: vertical;
        }
    `;
} 