export class ProgressController {
  private static progressFill: HTMLElement | null = null;
  private static progressStatus: HTMLElement | null = null;
  private static progressContainer: HTMLElement | null = null;
  private static generateBtn: HTMLButtonElement | null = null;
  private static cancelBtn: HTMLButtonElement | null = null;
  private static vscode: any;

  static initialize(vscode: any) {
    this.vscode = vscode;
    this.progressFill = document.getElementById('progressFill');
    this.progressStatus = document.getElementById('progressStatus');
    this.progressContainer = document.getElementById('progressContainer');
    this.generateBtn = document.getElementById('generateBtn') as HTMLButtonElement;
    this.cancelBtn = document.getElementById('cancelBtn') as HTMLButtonElement;

    if (!this.progressFill || !this.progressStatus || !this.progressContainer || !this.generateBtn || !this.cancelBtn) {
      console.error('Progress elements not found');
      return;
    }

    // Hide cancel button initially
    this.cancelBtn.style.display = 'none';

    this.generateBtn.addEventListener('click', () => {
      this.showProgress();
    });

    this.cancelBtn.addEventListener('click', () => {
      this.cancelGeneration();
    });
  }

  static update(value: number, status: string) {
    if (!this.progressFill || !this.progressStatus) return;

    // Ensure progress container is visible during updates
    this.showProgress();

    this.progressFill.style.width = `${value}%`;
    this.progressStatus.textContent = status;
    
    if (value >= 100) {
      setTimeout(() => this.hideProgress(), 2000);
    }
  }

  private static showProgress() {
    if (!this.progressContainer || !this.generateBtn || !this.cancelBtn) return;

    this.progressContainer.style.display = 'block';
    this.generateBtn.style.display = 'none';
    this.cancelBtn.style.display = 'block';
  }

  private static hideProgress() {
    if (!this.progressContainer || !this.generateBtn || !this.cancelBtn) return;

    this.progressContainer.style.display = 'none';
    this.generateBtn.style.display = 'block';
    this.cancelBtn.style.display = 'none';
  }

  private static cancelGeneration() {
    if (!this.vscode) return;

    this.vscode.postMessage({
      command: 'cancel'
    });

    this.hideProgress();
  }
} 