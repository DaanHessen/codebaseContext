export class TabController {
  static init() {
    // Show initial tab
    const initialTab = document.querySelector('.tab[data-tab="exclusions"]');
    if (initialTab) {
      this.switchTab(initialTab as HTMLElement);
    }

    // Add click handlers
    document.querySelectorAll('.tab').forEach(tab => {
      tab.addEventListener('click', (e) => {
        this.switchTab(e.currentTarget as HTMLElement);
      });
    });
  }

  private static switchTab(tab: HTMLElement) {
    const tabName = tab.getAttribute('data-tab');
    if (!tabName) return;

    // Update active states
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(c => {
      c.classList.remove('active');
      (c as HTMLElement).style.display = 'none';
    });

    // Activate selected tab
    tab.classList.add('active');
    const content = document.querySelector(`.tab-content[data-tab="${tabName}"]`);
    if (content) {
      content.classList.add('active');
      (content as HTMLElement).style.display = 'block';
    }
  }
} 