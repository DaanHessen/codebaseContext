export class TabController {
  static init() {
    const initialTab = document.querySelector('.tab[data-tab="exclusions"]');
    if (initialTab) {
      this.switchTab(initialTab as HTMLElement);
    }

    document.querySelectorAll('.tab').forEach(tab => {
      tab.addEventListener('click', (e) => {
        this.switchTab(e.currentTarget as HTMLElement);
      });
    });
  }

  private static switchTab(tab: HTMLElement) {
    const tabName = tab.getAttribute('data-tab');
    if (!tabName) return;

    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(c => {
      c.classList.remove('active');
      (c as HTMLElement).style.display = 'none';
    });

    tab.classList.add('active');
    const content = document.querySelector(`.tab-content[data-tab="${tabName}"]`);
    if (content) {
      content.classList.add('active');
      (content as HTMLElement).style.display = 'block';
    }
  }
} 