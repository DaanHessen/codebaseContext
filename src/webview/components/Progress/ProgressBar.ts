export class ProgressBar {
  static render(): string {
    return `
      <div id="progressContainer" class="progress-container">
        <div class="progress-bar">
          <div id="progressFill" class="progress-fill"></div>
        </div>
        <div id="progressStatus" class="progress-status">Ready to generate</div>
      </div>
    `;
  }
} 