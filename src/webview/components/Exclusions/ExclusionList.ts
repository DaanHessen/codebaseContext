export class ExclusionList {
  static renderItem(pattern: string, type: string): string {
    return `
      <div class="exclusion-item" data-type="${type}">
        <input type="checkbox" id="${type}_${pattern}" checked>
        <label for="${type}_${pattern}">${pattern}</label>
        <button class="remove-btn" data-pattern="${pattern}">
          <span class="codicon codicon-close"></span>
        </button>
      </div>
    `;
  }
} 