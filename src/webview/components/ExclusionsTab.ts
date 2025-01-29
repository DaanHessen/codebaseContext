export function getExclusionsTab(excludedFiles: string[] = []): string {
    return `
        <div class="exclusions-list">
            <h3>Automatically Excluded Files (${excludedFiles.length})</h3>
            <div class="scroll-container">
                ${excludedFiles.map(file => `
                    <div class="exclusion-item">
                        <span class="file-icon">📄</span>
                        <span class="file-path">${file}</span>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
} 