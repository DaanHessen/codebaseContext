export class ProgressBar {
  static render(): string {
    return `
      <div class="progress-container">
        <div class="progress-bar">
          <div class="progress-fill"></div>
        </div>
        <div class="progress-status"></div>
      </div>
    `;
  }
} 