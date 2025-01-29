export class ProgressBar {
  static render(): string {
    return `
      <div id="progressContainer" class="progress-container" style="display: none;">
        <div class="progress-bar">
          <div id="progressFill" class="progress-fill" style="width: 0%"></div>
        </div>
        <div id="progressStatus" class="progress-status">Starting...</div>
      </div>
    `;
  }
} 