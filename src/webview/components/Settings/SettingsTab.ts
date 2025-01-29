export class SettingsTab {
  static render(headerTemplate: string = ''): string {
    return `
      <div class="tab-content" data-tab="settings">
        <div class="section">
          <div class="section-header">Header Template</div>
          <div class="section-description">
            Template for the generated context header. Available variables:
            <ul class="template-vars">
              <li><code>{projectName}</code> - Name of the current project</li>
              <li><code>{date}</code> - Current date and time</li>
              <li><code>{workspacePath}</code> - Path to the workspace</li>
              <li><code>{fileTree}</code> - Tree structure of the workspace</li>
              <li><code>{content}</code> - Generated file contents</li>
            </ul>
          </div>
          <div class="section-content">
            <textarea id="headerTemplate" 
                      placeholder="Enter header template..." 
                      spellcheck="false" 
                      rows="10">${headerTemplate}</textarea>
          </div>
        </div>
        <div class="section">
          <div class="section-header">Storage Management</div>
          <div class="section-description">
            Reset all settings and exclusions to their default values
          </div>
          <div class="section-content">
            <button id="resetStorageBtn" class="danger-button">Reset Storage</button>
          </div>
        </div>
      </div>
    `;
  }
} 