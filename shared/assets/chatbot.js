(function() {
  // Prevent duplicate widget insertion
  if (document.getElementById('custom-ai-chat-container')) return;

  const CHATBOT_API_URL = "https://nodejs-production-b88e.up.railway.app/chat"; // YOUR RAILWAY BACKEND URL

  /*** 1. Create HTML structure ***/
  const container = document.createElement('div');
  container.id = 'custom-ai-chat-container';
  container.innerHTML = `
    <div id="custom-chat-icon">
      <img src="assets/phoenix.svg" alt="Open Chat" />
    </div>
    <div id="custom-chat-window" class="custom-chat-hidden">
      <div id="custom-chat-header">
        <span>AI Assistant</span>
        <button id="custom-chat-close" aria-label="Close chat">×</button>
      </div>
      <div id="custom-chat-messages"></div>
      <div id="custom-chat-input-area">
        <input type="text" id="custom-chat-input" placeholder="Ask something..." aria-label="Chat input"/>
        <button id="custom-chat-send" aria-label="Send message">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" width="20px" height="20px"><title>Send</title><path d="M0 0h24v24H0z" fill="none"/><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
        </button>
      </div>
    </div>
  `;
  document.body.appendChild(container);

  /*** 2. Inject CSS styles for the widget ***/
  // Styles are injected directly into the head to keep the widget self-contained.
  const style = document.createElement('style');
  style.textContent = `
    #custom-ai-chat-container * { box-sizing: border-box; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; }
    .custom-chat-hidden { display: none !important; }
    #custom-chat-icon {
      position: fixed;
      bottom: 20px;
      right: 20px;
      width: 60px; /* Increased size for the new icon */
      height: 60px; /* Increased size for the new icon */
      background-color: #FFFFFF; /* White background */
      color: white;
      border-radius: 50%;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      border: 3px solid #000033; /* Bolder Brand Navy Outline */
      z-index: 2147483646; /* High z-index */
      transition: transform 0.2s ease-out;
    }
    #custom-chat-icon img {
        width: 75%; /* Adjust as needed to center the orange part */
        height: 75%; /* Adjust as needed to center the orange part */
        object-fit: contain;
        transform: translateY(3px); /* Nudge icon down slightly */
    }
    #custom-chat-icon:hover { transform: scale(1.1); }
    #custom-chat-window {
      position: fixed;
      bottom: 20px;
      right: 20px;
      width: 350px;
      height: 500px;
      max-width: calc(100vw - 40px);
      max-height: calc(100vh - 40px);
      background: #ffffff;
      border: 1px solid #e0e0e0;
      border-radius: 12px;
      box-shadow: 0 8px 24px rgba(0,0,0,0.15);
      display: flex;
      flex-direction: column;
      z-index: 2147483647; /* Higher z-index */
      overflow: hidden; /* Ensures children respect border-radius */
      transition: opacity 0.3s ease, transform 0.3s ease;
      opacity: 0;
      transform: translateY(20px);
    }
    #custom-chat-window.custom-chat-visible {
        opacity: 1;
        transform: translateY(0);
    }
    #custom-chat-header {
      background: #f8f8f8;
      color: #333;
      padding: 12px 15px;
      border-bottom: 1px solid #e0e0e0;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-weight: 600;
    }
    #custom-chat-close {
      background: none; border: none; color: #888; font-size: 24px;
      cursor: pointer; line-height: 1; padding: 0 5px;
    }
    #custom-chat-close:hover { color: #333; }
    #custom-chat-messages {
      flex: 1; padding: 15px; overflow-y: auto; background: #ffffff;
      display: flex; flex-direction: column;
    }
    .custom-chat-msg {
      margin-bottom: 10px; padding: 8px 12px; border-radius: 18px;
      max-width: 80%; line-height: 1.4; word-wrap: break-word;
      font-size: 14px;
    }
    .custom-chat-msg.custom-chat-user {
      align-self: flex-end; background: #007AFF; color: white;
      border-bottom-right-radius: 4px;
    }
    .custom-chat-msg.custom-chat-bot, .custom-chat-msg.custom-chat-thinking, .custom-chat-msg.custom-chat-error {
      align-self: flex-start; background: #f0f0f0; color: #333;
      border-bottom-left-radius: 4px;
    }
    .custom-chat-msg.custom-chat-thinking { font-style: italic; color: #777; }
    .custom-chat-msg.custom-chat-error { background: #ffebee; color: #c62828; }

    #custom-chat-input-area {
      border-top: 1px solid #e0e0e0; padding: 10px; background: #f8f8f8;
      display: flex; align-items: center; gap: 10px;
    }
    #custom-chat-input {
      flex: 1; padding: 10px; font-size: 14px; border: 1px solid #ccc;
      border-radius: 20px; outline: none;
    }
    #custom-chat-input:focus { border-color: #007AFF; }
    #custom-chat-send {
      background: #007AFF; color: white; border: none; border-radius: 50%;
      width: 40px; height: 40px; display: flex; align-items: center;
      justify-content: center; cursor: pointer;
    }
    #custom-chat-send:disabled { background: #cccccc; cursor: not-allowed; }
    #custom-chat-send svg { margin-left: 2px; } /* Fine-tune icon position */
  `;
  document.head.appendChild(style);

  /*** 3. DOM Element References ***/
  const chatIcon      = document.getElementById('custom-chat-icon');
  const chatWindow    = document.getElementById('custom-chat-window');
  const chatHeader    = document.getElementById('custom-chat-header');
  const closeButton   = document.getElementById('custom-chat-close');
  const messagesDiv   = document.getElementById('custom-chat-messages');
  const inputField    = document.getElementById('custom-chat-input');
  const sendButton    = document.getElementById('custom-chat-send');

  /*** 4. Chat State & Helper Functions ***/
  let conversationHistory = [];
  let isChatOpen = false;
  let thinkingMessageElement = null;

  function scrollToBottom() {
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
  }

  function addMessageToUI(role, text) {
    const msgDiv = document.createElement('div');
    msgDiv.classList.add('custom-chat-msg', `custom-chat-${role}`); // e.g., custom-chat-user
    msgDiv.textContent = text;
    messagesDiv.appendChild(msgDiv);
    scrollToBottom();
    return msgDiv; // Return the element if we need to modify it (e.g., for "thinking...")
  }

  function saveState() {
    sessionStorage.setItem('customChatHistory', JSON.stringify(conversationHistory));
    sessionStorage.setItem('customChatOpen', isChatOpen ? 'true' : 'false');
  }

  function loadState() {
    const savedHistory = sessionStorage.getItem('customChatHistory');
    if (savedHistory) {
      conversationHistory = JSON.parse(savedHistory);
      conversationHistory.forEach(msg => addMessageToUI(msg.role, msg.text));
    } else {
       addMessageToUI('bot', 'Hello! How can I assist you today?'); // Initial greeting
       conversationHistory = [{role: 'bot', text: 'Hello! How can I assist you today?'}]; // Add to history
    }

    const savedIsOpen = sessionStorage.getItem('customChatOpen');
    if (savedIsOpen === 'true') {
      openChatWindow();
    } else {
      closeChatWindow(); // Ensures icon is visible if chat was closed
    }
  }

  function openChatWindow() {
    isChatOpen = true;
    chatWindow.classList.remove('custom-chat-hidden');
    chatWindow.classList.add('custom-chat-visible');
    chatIcon.classList.add('custom-chat-hidden');
    inputField.focus();
    scrollToBottom(); // In case there's an initial greeting
    saveState();
  }

  function closeChatWindow() {
    isChatOpen = false;
    chatWindow.classList.add('custom-chat-hidden');
    chatWindow.classList.remove('custom-chat-visible');
    chatIcon.classList.remove('custom-chat-hidden');
    saveState();
  }

  /*** 5. Event Handlers ***/
  chatIcon.addEventListener('click', openChatWindow);
  closeButton.addEventListener('click', closeChatWindow);

  async function handleSendMessage() {
    const userText = inputField.value.trim();
    if (!userText) return;

    addMessageToUI('user', userText);
    conversationHistory.push({ role: 'user', text: userText });
    // saveState() is called in the finally block

    inputField.value = '';
    sendButton.disabled = true;

    thinkingMessageElement = addMessageToUI('thinking', 'AI is thinking...');

    try {
      const response = await fetch(CHATBOT_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userText, history: conversationHistory.slice(0, -2) }) // Send message + relevant history
      });

      if (thinkingMessageElement) {
        messagesDiv.removeChild(thinkingMessageElement);
        thinkingMessageElement = null;
      }

      if (!response.ok) {
        const errorData = await response.text(); // Or .json() if backend sends structured errors
        throw new Error(`API Error ${response.status}: ${errorData}`);
      }

      const data = await response.json();
      const botReply = data.reply || "Sorry, I couldn't process that.";
      
      addMessageToUI('bot', botReply);
      conversationHistory.push({ role: 'bot', text: botReply });

    } catch (error) {
      console.error('Chatbot API Error:', error);
      if (thinkingMessageElement) { // Ensure thinking message is removed on error too
        messagesDiv.removeChild(thinkingMessageElement);
        thinkingMessageElement = null;
      }
      const errorMessage = error instanceof TypeError
        ? 'Oops! A network error occurred. Please check your connection and try again.'
        : 'Oops! Something went wrong. Please try again.';
      addMessageToUI('error', errorMessage);
      // No need to add this error to conversationHistory to be resent, but good for UI
    } finally {
      sendButton.disabled = false;
      inputField.focus();
      saveState(); // Save bot response / final state
    }
  }

  sendButton.addEventListener('click', handleSendMessage);
  inputField.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSendMessage();
    }
  });

  /*** 6. Initial Load ***/
  loadState();

})();
