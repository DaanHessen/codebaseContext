import { ExclusionsTab } from '../components/Exclusions/ExclusionsTab';
import { SettingsTab } from '../components/Settings/SettingsTab';
import { ProgressBar } from '../components/Shared/ProgressBar';
import { Notification } from '../components/Shared/Notification';
import { GenerateButton } from '../components/Shared/Button';

export class WebviewController {
    static renderBaseHTML(nonce: string, styles: string, scripts: string): string {
        return `<!DOCTYPE html>
        <html lang="en">
            ${this.head(styles)}
            ${this.body(nonce, scripts)}
        </html>`;
    }

    private static head(styles: string): string {
        return `
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Codebase Context Generator</title>
            <style>${styles}</style>
        </head>`;
    }

    private static body(nonce: string, scripts: string): string {
        return `
        <body>
            <div class="container">
                ${this.tabs()}
                <div class="content">
                    ${ExclusionsTab.render([], [])}
                    ${SettingsTab.render()}
                    ${ProgressBar.render()}
                    ${Notification.render()}
                    ${GenerateButton.render()}
                </div>
            </div>
            <script nonce="${nonce}">${scripts}</script>
        </body>`;
    }

    private static tabs(): string {
        return `
        <div class="tabs">
            <button class="tab active" data-tab="exclusions">Exclusions</button>
            <button class="tab" data-tab="settings">Settings</button>
        </div>`;
    }
} 