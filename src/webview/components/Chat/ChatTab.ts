export class ChatTab {
  static render(): string {
    return `
      <div class="tab-content" data-tab="chat">
        <div class="chat-container">
          <div class="chat-messages">
            <div id="chatMessages" class="messages-content"></div>
            <div id="typingIndicator" class="typing-indicator">
              <span></span>
              <span></span>
              <span></span>
            </div>
            <div id="thinkingIndicator" class="thinking-indicator">
              <span class="thinking-text">Thinking...</span>
              <span class="thinking-content"></span>
            </div>
          </div>
          <div class="chat-input-container">
            <div class="message-input">
              <textarea 
                id="chatInput"
                class="chat-textarea" 
                placeholder="Type your message here..."
              ></textarea>
            </div>
            <div class="input-footer">
              <select id="modelSelector" class="model-selector" title="Select AI Model">
                <option value="deepseek-reasoner">DeepSeek Reasoner</option>
                <option value="deepseek-chat">DeepSeek Chat</option>
                <option value="deepseek-coder">DeepSeek Coder</option>
              </select>
              <button id="sendMessage" class="send-button">
                <span class="send-icon">➤</span>
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  }
} 