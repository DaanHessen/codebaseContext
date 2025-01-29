export function getGeneralTab(): string {
    return `
        <div class="tab-content active" data-tab="general">
            <div class="section">
                <div class="section-header">Header Template</div>
                <div class="section-description">
                    Define the template that will be used as a header for your code files. 
                    This template will be automatically inserted at the top of each file.
                </div>
                <div class="section-content">
                    <textarea id="headerTemplate" placeholder="Enter header template..."></textarea>
                </div>
            </div>
        </div>
    `;
} 