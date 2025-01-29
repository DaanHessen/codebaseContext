export function getSettingsTab(): string {
    return `
        <div class="tab-content" data-tab="settings">
            <div class="section">
                <div class="section-header">Configuration</div>
                <div class="section-description">
                    Configure how the context is generated and what information to include.
                </div>
                <div class="section-content">
                    <div class="setting-item">
                        <div class="setting-label">
                            <label for="headerTemplate">Header Template</label>
                            <div class="setting-description">Define the template that will be used as a header for your code files.</div>
                        </div>
                        <div class="setting-control">
                            <textarea id="headerTemplate" placeholder="Enter header template..."></textarea>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
} 