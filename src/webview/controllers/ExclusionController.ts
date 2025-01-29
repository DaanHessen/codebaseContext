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

  getProjectExclusions(): Set<string> {
    return this.enabledExclusions.get('project') || new Set();
  }

  getGlobalExclusions(): Set<string> {
    return this.enabledExclusions.get('global') || new Set();
  }

  setExclusions(type: 'project' | 'global', exclusions: string[]) {
    this.enabledExclusions.set(type, new Set(exclusions));
    this.updateUI(type);
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

    // Remove pattern listeners are now handled by individual buttons
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
    return pattern.length > 0 && /^[^<>"|?*]+$/.test(pattern);
  }

  private updateUI(type: 'project'|'global') {
    const container = document.getElementById(`${type}ExclusionList`);
    if (!container) return;

    // Clear existing items
    container.innerHTML = '';

    // Add new items
    const patterns = Array.from(this.enabledExclusions.get(type)!).sort();
    patterns.forEach(pattern => {
      const itemDiv = document.createElement('div');
      itemDiv.className = 'exclusion-item';
      itemDiv.dataset.type = type;

      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.id = `${type}_${pattern}`;
      checkbox.checked = true;
      checkbox.addEventListener('change', () => {
        this.handlePatternToggle(type, pattern, checkbox.checked);
      });

      const label = document.createElement('label');
      label.htmlFor = `${type}_${pattern}`;
      label.textContent = pattern;

      const removeBtn = document.createElement('button');
      removeBtn.className = 'remove-btn';
      removeBtn.title = 'Remove exclusion';
      removeBtn.dataset.pattern = pattern;
      removeBtn.innerHTML = '×';
      removeBtn.addEventListener('click', () => {
        this.handlePatternRemove(type, pattern);
      });

      itemDiv.appendChild(checkbox);
      itemDiv.appendChild(label);
      itemDiv.appendChild(removeBtn);
      container.appendChild(itemDiv);
    });
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