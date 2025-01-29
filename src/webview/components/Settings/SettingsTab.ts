export class SettingsTab {
  static render(headerTemplate: string = ''): string {
    return `
      <div class="tab-content" data-tab="settings" style="display: none;">
        <div class="section">
          <div class="section-header">Header Template</div>
          <div class="section-description">
            Define the template that will be used as a header for your code files.
            This template will be automatically inserted at the top of each file.
          </div>
          <div class="section-content">
            <textarea id="headerTemplate" rows="10" placeholder="Enter header template...">${headerTemplate}</textarea>
          </div>
        </div>
      </div>
    `;
  }
} 