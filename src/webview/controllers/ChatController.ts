export class ChatController {
  private static vscode: any;
  private static chatInput: HTMLTextAreaElement | null = null;
  private static modelSelector: HTMLSelectElement | null = null;
  private static chatMessages: HTMLElement | null = null;
  private static sendButton: HTMLButtonElement | null = null;
  private static typingIndicator: HTMLElement | null = null;
  private static thinkingIndicator: HTMLElement | null = null;
  private static thinkingContent: HTMLElement | null = null;

  static initialize(vscode: any) {
    this.vscode = vscode;
    this.chatInput = document.getElementById('chatInput') as HTMLTextAreaElement;
    this.modelSelector = document.getElementById('modelSelector') as HTMLSelectElement;
    this.chatMessages = document.getElementById('chatMessages');
    this.sendButton = document.getElementById('sendMessage') as HTMLButtonElement;
    this.typingIndicator = document.getElementById('typingIndicator');
    this.thinkingIndicator = document.getElementById('thinkingIndicator');
    this.thinkingContent = document.querySelector('#thinkingIndicator .thinking-content');

    if (!this.chatInput || !this.modelSelector || !this.chatMessages || !this.sendButton || 
        !this.typingIndicator || !this.thinkingIndicator || !this.thinkingContent) {
      console.error('Chat elements not found');
      return;
    }

    this.chatInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        this.sendMessage();
      }
    });

    this.sendButton.addEventListener('click', () => {
      this.sendMessage();
    });
  }

  private static sendMessage() {
    if (!this.chatInput || !this.modelSelector || !this.chatMessages || !this.vscode || 
        !this.sendButton || !this.typingIndicator || !this.thinkingIndicator || !this.thinkingContent) return;

    const message = this.chatInput.value.trim();
    if (!message) return;

    this.addMessage('user', message);
    this.chatInput.value = '';
    this.sendButton.disabled = true;

    if (this.modelSelector.value === 'deepseek-reasoner') {
      this.showThinking();
      // Simulate thinking process
      let thoughts = [
        "Analyzing the context...",
        "Considering possible approaches...",
        "Evaluating the best solution...",
        "Formulating response..."
      ];
      let currentThought = 0;
      
      const thinkingInterval = setInterval(() => {
        if (currentThought < thoughts.length) {
          this.updateThinking(thoughts[currentThought]);
          currentThought++;
        } else {
          clearInterval(thinkingInterval);
          this.hideThinking();
          this.showTyping();
          
          // Simulate response after thinking
          setTimeout(() => {
            this.hideTyping();
            this.addMessage('assistant', 'After careful consideration, here is my response...');
          }, 2000);
        }
      }, 1500);
    } else {
      this.showTyping();
      // For now, simulate a response after 2 seconds
      setTimeout(() => {
        this.hideTyping();
        this.addMessage('assistant', 'This is a simulated response. The API integration will be implemented soon.');
      }, 2000);
    }

    this.vscode.postMessage({
      command: 'chat',
      message,
      model: this.modelSelector.value
    });
  }

  private static showThinking() {
    this.thinkingIndicator?.classList.add('visible');
  }

  private static hideThinking() {
    this.thinkingIndicator?.classList.remove('visible');
  }

  private static updateThinking(thought: string) {
    if (this.thinkingContent) {
      this.thinkingContent.textContent = thought;
    }
  }

  private static showTyping() {
    this.typingIndicator?.classList.add('visible');
  }

  private static hideTyping() {
    this.typingIndicator?.classList.remove('visible');
  }

  static addMessage(role: 'user' | 'assistant', content: string) {
    if (!this.chatMessages || !this.sendButton) return;

    const messageDiv = document.createElement('div');
    messageDiv.className = `chat-message ${role}`;
    
    // Convert markdown code blocks to HTML
    const formattedContent = content.replace(/```(\w+)?\n([\s\S]*?)```/g, (_, lang, code) => {
      return `<pre><code class="language-${lang || ''}">${this.escapeHtml(code.trim())}</code></pre>`;
    });
    
    messageDiv.innerHTML = formattedContent;
    this.chatMessages.appendChild(messageDiv);
    this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
    
    if (role === 'assistant') {
      this.sendButton.disabled = false;
    }
  }

  private static escapeHtml(text: string): string {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
} 