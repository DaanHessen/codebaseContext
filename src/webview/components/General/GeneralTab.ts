export class GeneralTab {
  static render(headerTemplate: string): string {
    return `
      <div class="tab-content" data-tab="general">
        <div class="section">
          <div class="section-header">Header Configuration</div>
          <div class="section-content">
            <textarea id="headerTemplate">${headerTemplate}</textarea>
          </div>
        </div>
      </div>
    `;
  }
} 