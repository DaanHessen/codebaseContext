export function getProgressBar(): string {
    return `
        <div class="progress-container" id="progressContainer">
            <div class="progress-bar">
                <div class="progress-fill" id="progressFill"></div>
            </div>
            <div class="progress-status" id="progressStatus">Starting...</div>
        </div>
    `;
} 