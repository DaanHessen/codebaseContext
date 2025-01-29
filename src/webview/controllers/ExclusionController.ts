export class ExclusionController {
  private enabledExclusions = new Map<string, Set<string>>();

  constructor(
    private postMessage: (message: any) => void,
    projectExclusions: string[] = [],
    globalExclusions: string[] = []
  ) {
    this.enabledExclusions.set('project', new Set(projectExclusions));
    this.enabledExclusions.set('global', new Set(globalExclusions));
    this.initializeListeners();
    this.updateUI('project');
    this.updateUI('global');
  }

  private initializeListeners() {
    // Add pattern listeners
    ['project', 'global'].forEach(type => {
      const input = document.getElementById(`new${this.capitalize(type)}Pattern`) as HTMLInputElement;
      if (input) {
        input.addEventListener('keypress', (e) => {
          if (e.key === 'Enter') {
            const pattern = input.value.trim();
            if (pattern) {
              this.handlePatternAdd(type as 'project'|'global', pattern);
              input.value = '';
            }
          }
        });
      }
    });

    // Remove pattern listeners
    document.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;
      if (target.closest('.remove-btn')) {
        const btn = target.closest('.remove-btn') as HTMLElement;
        const pattern = btn.dataset.pattern;
        const item = btn.closest('.exclusion-item') as HTMLElement;
        const type = item.dataset.type as 'project'|'global';
        if (pattern && type) {
          this.handlePatternRemove(type, pattern);
        }
      }
    });

    // Toggle pattern listeners
    document.addEventListener('change', (e) => {
      const target = e.target as HTMLElement;
      if (target.closest('.exclusion-item')) {
        const checkbox = target as HTMLInputElement;
        const item = target.closest('.exclusion-item') as HTMLElement;
        const type = item.dataset.type as 'project'|'global';
        const pattern = checkbox.id.split('_')[1];
        if (pattern && type) {
          this.handlePatternToggle(type, pattern, checkbox.checked);
        }
      }
    });

    // Generate button listener
    const generateBtn = document.getElementById('generateBtn');
    if (generateBtn) {
      generateBtn.addEventListener('click', () => {
        const headerTemplate = (document.getElementById('headerTemplate') as HTMLTextAreaElement)?.value || '';
        this.postMessage({
          command: 'generate',
          projectExclusions: Array.from(this.enabledExclusions.get('project')!),
          globalExclusions: Array.from(this.enabledExclusions.get('global')!),
          headerTemplate
        });
      });
    }
  }

  handlePatternAdd(type: 'project'|'global', pattern: string) {
    if (this.validatePattern(pattern)) {
      const patterns = this.enabledExclusions.get(type)!;
      patterns.add(pattern);
      this.emitUpdate();
      this.updateUI(type);
    }
  }

  handlePatternRemove(type: 'project'|'global', pattern: string) {
    const patterns = this.enabledExclusions.get(type)!;
    patterns.delete(pattern);
    this.emitUpdate();
    this.updateUI(type);
  }

  handlePatternToggle(type: 'project'|'global', pattern: string, enabled: boolean) {
    const patterns = this.enabledExclusions.get(type)!;
    if (enabled) {
      patterns.add(pattern);
    } else {
      patterns.delete(pattern);
    }
    this.emitUpdate();
  }

  private validatePattern(pattern: string): boolean {
    return pattern.length > 0 && /^[^<>:"|?*]+$/.test(pattern);
  }

  private updateUI(type: 'project'|'global') {
    const container = document.getElementById(`${type}ExclusionList`);
    if (container) {
      const patterns = Array.from(this.enabledExclusions.get(type)!);
      container.innerHTML = patterns.map(p => this.renderExclusionItem(p, type)).join('');
    }
  }

  private renderExclusionItem(pattern: string, type: string): string {
    return `
      <div class="exclusion-item" data-type="${type}">
        <input type="checkbox" id="${type}_${pattern}" checked>
        <label for="${type}_${pattern}">${pattern}</label>
        <button class="remove-btn" data-pattern="${pattern}" title="Remove exclusion">×</button>
      </div>
    `;
  }

  private emitUpdate() {
    this.postMessage({
      command: 'saveConfig',
      config: {
        projectExclusions: Array.from(this.enabledExclusions.get('project')!),
        globalExclusions: Array.from(this.enabledExclusions.get('global')!),
        headerTemplate: (document.getElementById('headerTemplate') as HTMLTextAreaElement)?.value || ''
      }
    });
  }

  private capitalize(s: string): string {
    return s.charAt(0).toUpperCase() + s.slice(1);
  }
} 