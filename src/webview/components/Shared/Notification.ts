export class Notification {
  static render(): string {
    return `
      <div id="notification" class="notification" style="display: none;">
        <span id="notificationMessage"></span>
      </div>
    `;
  }

  static show(message: string, type: 'success' | 'error' = 'success'): void {
    const notification = document.getElementById('notification');
    const messageEl = document.getElementById('notificationMessage');
    if (!notification || !messageEl) return;

    messageEl.textContent = message;
    notification.className = `notification ${type}`;
    notification.style.display = 'block';

    setTimeout(() => {
      notification.style.display = 'none';
    }, 3000);
  }
} 