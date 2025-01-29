export function getExclusionsTab(excludedFiles: string[] = []): string {
    return `
        <div class="exclusions-list">
            <h3>PROJECT-SPECIFIC EXCLUSIONS</h3>
            <p class="description">Allows you to exclude files from the context generation process. These exclusions only apply to the current project.</p>
            <div class="add-exclusion">
                <input 
                    type="text" 
                    id="newProjectPattern" 
                    placeholder="Add pattern (e.g., .exe, requirements.txt, /node_modules)"
                >
            </div>
            <div id="projectErrorMessage" class="error-message"></div>
            <div class="scroll-container">
                ${excludedFiles.map(file => `
                    <div class="exclusion-item">
                        <div class="exclusion-controls">
                            <input type="checkbox" class="exclusion-checkbox" checked />
                            <button class="remove-btn" title="Remove pattern"></button>
                        </div>
                        <div class="file-path">${file}</div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
} 