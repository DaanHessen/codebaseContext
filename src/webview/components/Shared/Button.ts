export class GenerateButton {
  static render(): string {
    return `
      <div class="button-container">
        <button id="generateBtn" class="generate-button">
          Generate Context
        </button>
        <button id="cancelBtn" class="cancel-button" style="display: none;">
          Cancel Generation
        </button>
      </div>
    `;
  }
} 