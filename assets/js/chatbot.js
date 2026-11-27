/**
 * DJC AI Assistant Chatbot Widget (Vanilla JavaScript)
 * Supports Nepali, Roman Nepali, and English with server-side proxy API.
 */
document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  const STORAGE_KEY = 'djc_ai_chat_history';

  // Inject Chat Widget HTML into body
  const chatWrapper = document.createElement('div');
  chatWrapper.id = 'djcChatWidgetRoot';
  chatWrapper.innerHTML = `
    <!-- Floating Chat Toggle Button -->
    <button type="button" class="djc-chat-toggle-btn" id="djcChatToggle" aria-label="Open DJC AI Assistant">
      <span class="djc-chat-toggle-tooltip">Chat with AI Assistant</span>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
      </svg>
    </button>

    <!-- Chat Modal Widget -->
    <div class="djc-chat-widget" id="djcChatWidget" role="dialog" aria-label="DJC AI Assistant Chat">
      <div class="djc-chat-header">
        <div class="djc-chat-header-info">
          <div class="djc-chat-avatar">
            DJC
            <span class="djc-chat-status-dot" aria-hidden="true"></span>
          </div>
          <div class="djc-chat-title-group">
            <span class="djc-chat-title">DJC AI Assistant</span>
            <span class="djc-chat-subtitle">Online &bull; Ready to help</span>
          </div>
        </div>
        <div class="djc-chat-header-actions">
          <button type="button" class="djc-chat-action-btn" id="djcChatClear" title="Clear conversation" aria-label="Clear conversation">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="3 6 5 6 21 6"></polyline>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
            </svg>
          </button>
          <button type="button" class="djc-chat-action-btn" id="djcChatClose" title="Close chat" aria-label="Close chat">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
      </div>

      <div class="djc-chat-body" id="djcChatBody">
        <!-- Messages appended dynamically -->
      </div>

      <div class="djc-chat-suggestions" id="djcChatSuggestions">
        <button type="button" class="djc-chat-suggestion-chip" data-prompt="I need a website.">I need a website.</button>
        <button type="button" class="djc-chat-suggestion-chip" data-prompt="Website for my business.">Website for my business.</button>
        <button type="button" class="djc-chat-suggestion-chip" data-prompt="I want an online store.">I want an online store.</button>
        <button type="button" class="djc-chat-suggestion-chip" data-prompt="What services do you offer?">What services do you offer?</button>
        <button type="button" class="djc-chat-suggestion-chip" data-prompt="How much does a website cost?">How much does a website cost?</button>
        <button type="button" class="djc-chat-suggestion-chip" data-prompt="Contact the developer.">Contact the developer.</button>
      </div>

      <div class="djc-chat-footer">
        <div class="djc-chat-input-row">
          <textarea
            id="djcChatInput"
            class="djc-chat-input"
            rows="1"
            placeholder="Type your message in Nepali, Roman Nepali, or English..."
            aria-label="Type your message"
          ></textarea>
          <button type="button" class="djc-chat-send-btn" id="djcChatSend" aria-label="Send message">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <line x1="22" y1="2" x2="11" y2="13"></line>
              <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
          </button>
        </div>
        <div class="djc-chat-disclaimer">
          AI can make mistakes. Verify important project details with Divya.
        </div>
      </div>
    </div>
  `;
  document.body.appendChild(chatWrapper);

  const toggleBtn = document.getElementById('djcChatToggle');
  const widget = document.getElementById('djcChatWidget');
  const closeBtn = document.getElementById('djcChatClose');
  const clearBtn = document.getElementById('djcChatClear');
  const chatBody = document.getElementById('djcChatBody');
  const chatInput = document.getElementById('djcChatInput');
  const sendBtn = document.getElementById('djcChatSend');
  const suggestions = document.getElementById('djcChatSuggestions');

  let messages = [];

  const defaultWelcome = {
    sender: 'assistant',
    text: "Namaste! 🙏 I'm DJC AI Assistant, representing Divya Jyoti Chaudhary (DJC Developer). How can I help you with your website project today?",
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  };

  const loadHistory = () => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        messages = JSON.parse(saved);
      }
    } catch (e) {}

    if (messages.length === 0) {
      messages.push(defaultWelcome);
      saveHistory();
    }
    renderMessages();
  };

  const saveHistory = () => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    } catch (e) {}
  };

  const renderMessages = () => {
    chatBody.innerHTML = '';
    messages.forEach((msg, idx) => {
      const msgDiv = document.createElement('div');
      msgDiv.className = `djc-chat-message ${msg.sender}`;
      
      const bubble = document.createElement('div');
      bubble.className = 'djc-chat-bubble';
      bubble.innerHTML = `<p>${escapeHtml(msg.text).replace(/\n/g, '<br>')}</p>`;

      const footer = document.createElement('div');
      footer.className = 'djc-chat-msg-footer';
      footer.innerHTML = `
        <span>${msg.time || ''}</span>
        ${msg.sender === 'assistant' ? `<button type="button" class="djc-chat-copy-btn" data-index="${idx}">Copy</button>` : ''}
      `;

      msgDiv.appendChild(bubble);
      msgDiv.appendChild(footer);
      chatBody.appendChild(msgDiv);
    });

    chatBody.scrollTop = chatBody.scrollHeight;

    chatBody.querySelectorAll('.djc-chat-copy-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const idx = btn.getAttribute('data-index');
        const textToCopy = messages[idx]?.text || '';
        navigator.clipboard.writeText(textToCopy).then(() => {
          btn.textContent = 'Copied!';
          setTimeout(() => { btn.textContent = 'Copy'; }, 2000);
        });
      });
    });
  };

  const escapeHtml = (str) =>
    String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

  const appendTypingIndicator = () => {
    const typingDiv = document.createElement('div');
    typingDiv.className = 'djc-chat-message assistant';
    typingDiv.id = 'djcTypingIndicator';
    typingDiv.innerHTML = `
      <div class="djc-chat-typing">
        <div class="djc-chat-typing-dot"></div>
        <div class="djc-chat-typing-dot"></div>
        <div class="djc-chat-typing-dot"></div>
      </div>
    `;
    chatBody.appendChild(typingDiv);
    chatBody.scrollTop = chatBody.scrollHeight;
  };

  const removeTypingIndicator = () => {
    const typingDiv = document.getElementById('djcTypingIndicator');
    if (typingDiv) typingDiv.remove();
  };

  const sendUserMessage = async (text) => {
    if (!text || !text.trim()) return;
    const userText = text.trim();
    chatInput.value = '';
    chatInput.style.height = 'auto';

    messages.push({
      sender: 'user',
      text: userText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    });
    saveHistory();
    renderMessages();

    appendTypingIndicator();

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userText }),
      });
      const data = await res.json();
      removeTypingIndicator();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to connect to AI assistant.');
      }

      messages.push({
        sender: 'assistant',
        text: data.reply,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      });
      saveHistory();
      renderMessages();
    } catch (err) {
      removeTypingIndicator();
      messages.push({
        sender: 'assistant',
        text: `Sorry, I'm having trouble connecting right now. (${err.message}). You can also reach Divya directly via WhatsApp (+977-9812345678) or the contact form below!`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      });
      saveHistory();
      renderMessages();
    }
  };

  toggleBtn.addEventListener('click', () => {
    widget.classList.toggle('active');
    if (widget.classList.contains('active')) {
      chatInput.focus();
    }
  });

  closeBtn.addEventListener('click', () => {
    widget.classList.remove('active');
  });

  clearBtn.addEventListener('click', () => {
    messages = [defaultWelcome];
    saveHistory();
    renderMessages();
  });

  sendBtn.addEventListener('click', () => {
    sendUserMessage(chatInput.value);
  });

  chatInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendUserMessage(chatInput.value);
    }
  });

  chatInput.addEventListener('input', () => {
    chatInput.style.height = 'auto';
    chatInput.style.height = `${Math.min(chatInput.scrollHeight, 80)}px`;
  });

  suggestions.querySelectorAll('.djc-chat-suggestion-chip').forEach((chip) => {
    chip.addEventListener('click', () => {
      const prompt = chip.getAttribute('data-prompt');
      if (prompt) sendUserMessage(prompt);
    });
  });

  loadHistory();
});
