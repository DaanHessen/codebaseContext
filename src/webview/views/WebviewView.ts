import { ProgressBar } from '../components/Progress/ProgressBar';
import { ExclusionsTab } from '../components/Exclusions/ExclusionsTab';
import { GeneralTab } from '../components/General/GeneralTab';
import * as vscode from 'vscode';

export class WebviewView {
  static render(
    webview: vscode.Webview,
    projectExclusions: string[],
    globalExclusions: string[],
    headerTemplate: string,
    nonce: string,
    styles: string,
    scriptUri: vscode.Uri
  ): string {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <meta http-equiv="Content-Security-Policy" 
                content="default-src 'none'; style-src ${webview.cspSource} 'unsafe-inline'; script-src 'nonce-${nonce}';">
          <style>
            ${styles}
          </style>
        </head>
        <body>
          <div class="container">
            ${this.renderTabs()}
            <div class="content">
              ${ExclusionsTab.render(projectExclusions, globalExclusions)}
              ${GeneralTab.render(headerTemplate)}
              ${ProgressBar.render()}
              <button id="generateBtn" class="generate-button">Generate Context</button>
            </div>
          </div>
          <script nonce="${nonce}" src="${scriptUri}"></script>
        </body>
      </html>
    `;
  }

  private static renderTabs(): string {
    return `
      <div class="tabs">
        <button class="tab active" data-tab="exclusions">Exclusions</button>
        <button class="tab" data-tab="settings">Settings</button>
      </div>
    `;
  }
} 