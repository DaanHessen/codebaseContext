import sharedCss from './components/_shared.css';
import exclusionsCss from './components/_exclusions.css';
import progressCss from './components/_progress.css';

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
${sharedCss}
${exclusionsCss}
${progressCss}
`; 