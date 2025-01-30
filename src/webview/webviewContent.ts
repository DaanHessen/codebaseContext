import * as vscode from 'vscode';
import { WebviewView } from './views/WebviewView';
import { getNonce } from '../utils/getNonce';
import { styles } from './styles/index';
import { DEFAULT_HEADER_TEMPLATE } from '../utils/defaultConfig';

export function getWebviewContent(
  webview: vscode.Webview, 
  extensionUri: vscode.Uri,
  config: {
    projectExclusions: string[],
    globalExclusions: string[],
    headerTemplate: string
  }
): string {
  const nonce = getNonce();
  const scriptUri = webview.asWebviewUri(
    vscode.Uri.joinPath(extensionUri, 'dist', 'webview', 'scripts', 'scripts.js')
  );
  
  return WebviewView.render(
    webview,
    config.projectExclusions,
    config.globalExclusions,
    config.headerTemplate || DEFAULT_HEADER_TEMPLATE,
    nonce,
    styles,
    scriptUri
  );
}