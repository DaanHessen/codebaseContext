import shared from './components/_shared.css';
import exclusions from './components/_exclusions.css';
import progress from './components/_progress.css';
import settings from './components/_settings.css';
import chat from './components/_chat.css';

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

export const styles = `
${baseStyles}
${shared}
${exclusions}
${progress}
${settings}
${chat}
`; 