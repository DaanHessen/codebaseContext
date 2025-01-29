export class TabController {
  static init() {
    document.querySelectorAll('.tab').forEach(tab => {
      tab.addEventListener('click', () => {
        const tabName = tab.getAttribute('data-tab');
        if (!tabName) return;

        // Update active states
        document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));

        tab.classList.add('active');
        const content = document.querySelector(`.tab-content[data-tab="${tabName}"]`);
        if (content) {
          content.classList.add('active');
        }
      });
    });
  }
} 