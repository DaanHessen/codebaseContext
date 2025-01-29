export class ProgressController {
  private static progressFill: HTMLElement | null = null;
  private static progressStatus: HTMLElement | null = null;
  private static progressContainer: HTMLElement | null = null;
  private static generateBtn: HTMLButtonElement | null = null;

  static initialize() {
    this.progressFill = document.getElementById('progressFill');
    this.progressStatus = document.getElementById('progressStatus');
    this.progressContainer = document.getElementById('progressContainer');
    this.generateBtn = document.getElementById('generateBtn') as HTMLButtonElement;

    if (this.generateBtn) {
      this.generateBtn.addEventListener('click', () => {
        this.showProgress();
        this.generateBtn!.disabled = true;
        window.postMessage({ type: 'generate' }, '*');
      });
    }
  }

  static update(value: number, status: string) {
    if (this.progressFill) {
      this.progressFill.style.width = `${value}%`;
    }
    if (this.progressStatus) {
      this.progressStatus.textContent = status;
    }
    
    if (value === 100) {
      setTimeout(() => this.hideProgress(), 2000);
    }
  }

  private static showProgress() {
    if (this.progressContainer) {
      this.progressContainer.style.display = 'block';
      this.update(0, 'Starting...');
    }
  }

  private static hideProgress() {
    if (this.progressContainer) {
      this.progressContainer.style.display = 'none';
    }
    if (this.generateBtn) {
      this.generateBtn.disabled = false;
    }
  }
} 