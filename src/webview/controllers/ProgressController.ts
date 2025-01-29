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

    if (!this.progressFill || !this.progressStatus || !this.progressContainer || !this.generateBtn) {
      console.error('Progress elements not found');
      return;
    }

    this.generateBtn.addEventListener('click', () => {
      this.showProgress();
    });
  }

  static update(value: number, status: string) {
    if (!this.progressFill || !this.progressStatus) return;

    this.progressFill.style.width = `${value}%`;
    this.progressStatus.textContent = status;
    
    if (value >= 100) {
      setTimeout(() => this.hideProgress(), 2000);
    }
  }

  private static showProgress() {
    if (!this.progressContainer || !this.generateBtn) return;

    this.progressContainer.style.display = 'block';
    this.generateBtn.disabled = true;
    this.update(0, 'Starting...');
  }

  private static hideProgress() {
    if (!this.progressContainer || !this.generateBtn) return;

    this.progressContainer.style.display = 'none';
    this.generateBtn.disabled = false;
  }
} 