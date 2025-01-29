import { ExclusionList } from "./ExclusionList";

export class ExclusionsTab {
  static render(projectExclusions: string[], globalExclusions: string[]): string {
    return `
      <div class="tab-content" data-tab="exclusions">
        ${this.renderSection('project', projectExclusions)}
        ${this.renderSection('global', globalExclusions)}
      </div>
    `;
  }

  private static renderSection(type: 'project'|'global', exclusions: string[]): string {
    const title = type === 'project' ? 'Project' : 'Global';
    const description = type === 'project' 
      ? 'Patterns that apply to the current project only'
      : 'Patterns that apply to all projects';

    return `
      <div class="section">
        <div class="section-header">${title} Exclusions</div>
        <div class="section-description">${description}</div>
        <div class="section-content">
          <div class="add-exclusion">
            <input type="text" 
              id="new${this.capitalize(type)}Pattern" 
              placeholder="Add exclusion pattern..."
              class="exclusion-input">
          </div>
          <div id="${type}ExclusionList" class="exclusion-list">
            ${exclusions.map(pattern => ExclusionList.renderItem(pattern, type)).join('')}
          </div>
        </div>
      </div>
    `;
  }

  private static capitalize(s: string): string {
    return s.charAt(0).toUpperCase() + s.slice(1);
  }
} 