export class ExclusionList {
  static renderItem(pattern: string, type: string, isPlaceholder: boolean = false): string {
    const itemClass = isPlaceholder ? 'exclusion-item placeholder' : 'exclusion-item';
    return `
      <div class="${itemClass}" data-type="${type}">
        <input type="checkbox" id="${type}_${pattern}" ${isPlaceholder ? 'disabled' : 'checked'}>
        <label for="${type}_${pattern}">${pattern}</label>
        <button class="remove-btn" data-pattern="${pattern}">
          <span class="codicon codicon-close"></span>
        </button>
      </div>
    `;
  }

  static renderPlaceholders(type: string): string {
    const placeholders = [
      'Add exclusion pattern...',
      'Example: node_modules/**',
      'Example: dist/**',
      'Example: .git/**',
      'Example: *.log'
    ];
    return placeholders.map(pattern => this.renderItem(pattern, type, true)).join('');
  }
} 