export class ProgressBar {
  static render(): string {
    return `
      <div class="progress-container" id="progressContainer" style="display: none;">
        <div class="progress-bar">
          <div class="progress-fill" id="progressFill"></div>
        </div>
        <div class="progress-status" id="progressStatus">Starting...</div>
      </div>
    `;
  }
} 