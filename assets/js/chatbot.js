/**
 * AI Chatbot Widget Integration
 * Supports integration with Claude AI (Anthropic) and other AI assistants
 */

(function() {
    'use strict';
    
    // Configuration
    const CHATBOT_CONFIG = {
        enabled: true,
        provider: 'claude', // 'claude', 'openai', 'custom'
        apiKey: '', // Set your API key here or via environment variable
        apiEndpoint: 'https://api.anthropic.com/v1/messages',
        model: 'claude-3-sonnet-20240229',
        theme: 'light',
        position: 'bottom-right', // 'bottom-right', 'bottom-left'
        greeting: 'Hi! I\'m an AI assistant. How can I help you today?',
        placeholder: 'Type your message...',
        buttonText: 'Chat with AI',
    };
    
    // State management
    let chatState = {
        isOpen: false,
        isInitialized: false,
        conversationHistory: [],
        isProcessing: false
    };
    
    /**
     * Initialize the chatbot widget
     */
    function initChatbot() {
        if (!CHATBOT_CONFIG.enabled) {
            console.log('Chatbot is disabled in configuration');
            return;
        }
        
        if (chatState.isInitialized) {
            return;
        }
        
        // Create chatbot UI
        createChatbotUI();
        
        // Add event listeners
        setupEventListeners();
        
        chatState.isInitialized = true;
        
        // Check if API key is configured
        if (!CHATBOT_CONFIG.apiKey) {
            console.warn('Chatbot API key not configured. Please set CHATBOT_CONFIG.apiKey');
            displayConfigurationWarning();
        }
    }
    
    /**
     * Create the chatbot UI elements
     */
    function createChatbotUI() {
        // Create chatbot container
        const chatbotContainer = document.createElement('div');
        chatbotContainer.id = 'ai-chatbot-container';
        chatbotContainer.className = `chatbot-container ${CHATBOT_CONFIG.position}`;
        
        chatbotContainer.innerHTML = `
            <div class="chatbot-button" id="chatbot-toggle">
                <svg class="chatbot-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8 9.5C8 8.67157 8.67157 8 9.5 8C10.3284 8 11 8.67157 11 9.5C11 10.3284 10.3284 11 9.5 11C8.67157 11 8 10.3284 8 9.5Z" fill="currentColor"/>
                    <path d="M14.5 8C13.6716 8 13 8.67157 13 9.5C13 10.3284 13.6716 11 14.5 11C15.3284 11 16 10.3284 16 9.5C16 8.67157 15.3284 8 14.5 8Z" fill="currentColor"/>
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M12 2C6.47715 2 2 6.47715 2 12C2 13.8214 2.48697 15.5291 3.33782 17C3.42021 17.1585 3.45242 17.3385 3.4297 17.5164L3.03867 21.0595C2.95819 21.863 3.63873 22.5435 4.44227 22.4631L7.98538 22.072C8.16333 22.0492 8.3433 22.0815 8.50179 22.1638C9.97282 22.9997 11.6758 23.5 13.5 23.5C19.0228 23.5 23.5 19.0228 23.5 13.5C23.5 7.97715 19.0228 3.5 13.5 3.5C12.6758 3.5 11.8728 3.59973 11.1018 3.78617C10.9152 3.02847 10.5993 2.32101 10.1776 1.68938C10.7523 1.5638 11.3431 1.5 11.9458 1.5C18.0228 1.5 23 6.47715 23 12C23 17.5228 18.0228 22 12 22C10.1786 22 8.47127 21.513 7 20.6622C6.84151 20.5798 6.66154 20.5476 6.48359 20.5704L2.94048 20.9614C2.13694 21.0419 1.45641 20.3614 1.53688 19.5578L1.92791 16.0147C1.95063 15.8367 1.91842 15.6568 1.83603 15.4983C0.985134 13.9727 0.5 12.2651 0.5 10.5C0.5 4.42287 5.47715 -0.5 12 -0.5C12.6027 -0.5 13.1935 -0.436199 13.7682 -0.311756C13.3465 0.319869 13.0306 1.02733 12.8588 1.78503C12.5773 1.59973 12.2758 1.5 11.9458 1.5Z" fill="currentColor"/>
                    <path d="M8.5 14.5C8.22386 14.5 8 14.7239 8 15C8 15.2761 8.22386 15.5 8.5 15.5H15.5C15.7761 15.5 16 15.2761 16 15C16 14.7239 15.7761 14.5 15.5 14.5H8.5Z" fill="currentColor"/>
                </svg>
                <span class="chatbot-button-text">${CHATBOT_CONFIG.buttonText}</span>
                <span class="chatbot-close-icon">✕</span>
            </div>
            
            <div class="chatbot-window" id="chatbot-window">
                <div class="chatbot-header">
                    <div class="chatbot-header-info">
                        <div class="chatbot-avatar">
                            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <circle cx="12" cy="12" r="10" fill="url(#gradient)"/>
                                <defs>
                                    <linearGradient id="gradient" x1="0" y1="0" x2="24" y2="24">
                                        <stop offset="0%" stop-color="#667eea"/>
                                        <stop offset="100%" stop-color="#764ba2"/>
                                    </linearGradient>
                                </defs>
                            </svg>
                        </div>
                        <div class="chatbot-title">
                            <h3>AI Assistant</h3>
                            <p class="chatbot-status">
                                <span class="status-indicator"></span>
                                ${CHATBOT_CONFIG.apiKey ? 'Online' : 'Not Configured'}
                            </p>
                        </div>
                    </div>
                    <button class="chatbot-minimize" id="chatbot-minimize" aria-label="Minimize chat">
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M5 12H19" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                        </svg>
                    </button>
                </div>
                
                <div class="chatbot-messages" id="chatbot-messages">
                    <div class="chatbot-message bot-message">
                        <div class="message-avatar">
                            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <circle cx="12" cy="12" r="10" fill="url(#gradient2)"/>
                                <defs>
                                    <linearGradient id="gradient2" x1="0" y1="0" x2="24" y2="24">
                                        <stop offset="0%" stop-color="#667eea"/>
                                        <stop offset="100%" stop-color="#764ba2"/>
                                    </linearGradient>
                                </defs>
                            </svg>
                        </div>
                        <div class="message-content">
                            <p>${CHATBOT_CONFIG.greeting}</p>
                        </div>
                    </div>
                </div>
                
                <div class="chatbot-input-area">
                    <div class="chatbot-input-wrapper">
                        <textarea 
                            id="chatbot-input" 
                            class="chatbot-input" 
                            placeholder="${CHATBOT_CONFIG.placeholder}"
                            rows="1"
                        ></textarea>
                        <button 
                            id="chatbot-send" 
                            class="chatbot-send-button" 
                            aria-label="Send message"
                            ${!CHATBOT_CONFIG.apiKey ? 'disabled' : ''}
                        >
                            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M22 2L11 13" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                        </button>
                    </div>
                    ${!CHATBOT_CONFIG.apiKey ? '<p class="chatbot-warning">⚠️ API key not configured. Please configure in chatbot.js</p>' : ''}
                </div>
            </div>
        `;
        
        document.body.appendChild(chatbotContainer);
    }
    
    /**
     * Display configuration warning message
     */
    function displayConfigurationWarning() {
        const messagesContainer = document.getElementById('chatbot-messages');
        if (messagesContainer) {
            const warningMessage = document.createElement('div');
            warningMessage.className = 'chatbot-message bot-message warning-message';
            warningMessage.innerHTML = `
                <div class="message-avatar">⚠️</div>
                <div class="message-content">
                    <p><strong>Configuration Required</strong></p>
                    <p>To use the AI chatbot, you need to:</p>
                    <ol>
                        <li>Obtain an API key from your AI provider (e.g., Anthropic for Claude)</li>
                        <li>Set the API key in <code>assets/js/chatbot.js</code></li>
                        <li>Configure the appropriate provider and model</li>
                    </ol>
                    <p>Visit <a href="https://www.anthropic.com/" target="_blank">Anthropic</a> to get your API key.</p>
                </div>
            `;
            messagesContainer.appendChild(warningMessage);
        }
    }
    
    /**
     * Setup event listeners
     */
    function setupEventListeners() {
        const toggleButton = document.getElementById('chatbot-toggle');
        const minimizeButton = document.getElementById('chatbot-minimize');
        const sendButton = document.getElementById('chatbot-send');
        const input = document.getElementById('chatbot-input');
        
        if (toggleButton) {
            toggleButton.addEventListener('click', toggleChatbot);
        }
        
        if (minimizeButton) {
            minimizeButton.addEventListener('click', toggleChatbot);
        }
        
        if (sendButton) {
            sendButton.addEventListener('click', sendMessage);
        }
        
        if (input) {
            input.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage();
                }
                
                // Auto-resize textarea
                autoResizeTextarea(input);
            });
            
            input.addEventListener('input', () => autoResizeTextarea(input));
        }
    }
    
    /**
     * Auto-resize textarea based on content
     */
    function autoResizeTextarea(textarea) {
        textarea.style.height = 'auto';
        textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
    }
    
    /**
     * Toggle chatbot window
     */
    function toggleChatbot() {
        chatState.isOpen = !chatState.isOpen;
        const container = document.getElementById('ai-chatbot-container');
        
        if (chatState.isOpen) {
            container.classList.add('open');
            // Focus input when opened
            setTimeout(() => {
                const input = document.getElementById('chatbot-input');
                if (input) input.focus();
            }, 300);
        } else {
            container.classList.remove('open');
        }
    }
    
    /**
     * Send a message
     */
    async function sendMessage() {
        const input = document.getElementById('chatbot-input');
        const message = input.value.trim();
        
        if (!message || chatState.isProcessing) {
            return;
        }
        
        if (!CHATBOT_CONFIG.apiKey) {
            addBotMessage('Please configure your API key first. Check the configuration instructions above.');
            return;
        }
        
        // Add user message to UI
        addUserMessage(message);
        
        // Clear input
        input.value = '';
        autoResizeTextarea(input);
        
        // Add to conversation history
        chatState.conversationHistory.push({
            role: 'user',
            content: message
        });
        
        // Show typing indicator
        showTypingIndicator();
        
        try {
            chatState.isProcessing = true;
            
            // Call API
            const response = await callAIAPI(message);
            
            // Remove typing indicator
            removeTypingIndicator();
            
            // Add bot response
            addBotMessage(response);
            
            // Add to conversation history
            chatState.conversationHistory.push({
                role: 'assistant',
                content: response
            });
            
        } catch (error) {
            removeTypingIndicator();
            console.error('Error calling AI API:', error);
            addBotMessage('Looks like something went wrong! Please check your API configuration and try again. Error: ' + error.message);
        } finally {
            chatState.isProcessing = false;
        }
    }
    
    /**
     * Call AI API
     */
    async function callAIAPI(message) {
        if (CHATBOT_CONFIG.provider === 'claude') {
            return await callClaudeAPI(message);
        } else {
            throw new Error('Unsupported AI provider: ' + CHATBOT_CONFIG.provider);
        }
    }
    
    /**
     * Call Claude (Anthropic) API
     */
    async function callClaudeAPI(message) {
        const response = await fetch(CHATBOT_CONFIG.apiEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': CHATBOT_CONFIG.apiKey,
                'anthropic-version': '2023-06-01'
            },
            body: JSON.stringify({
                model: CHATBOT_CONFIG.model,
                max_tokens: 1024,
                messages: [
                    {
                        role: 'user',
                        content: message
                    }
                ]
            })
        });
        
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(`API Error (${response.status}): ${errorData.error?.message || response.statusText}`);
        }
        
        const data = await response.json();
        return data.content[0].text;
    }
    
    /**
     * Add user message to chat
     */
    function addUserMessage(message) {
        const messagesContainer = document.getElementById('chatbot-messages');
        const messageElement = document.createElement('div');
        messageElement.className = 'chatbot-message user-message';
        messageElement.innerHTML = `
            <div class="message-content">
                <p>${escapeHtml(message)}</p>
            </div>
        `;
        messagesContainer.appendChild(messageElement);
        scrollToBottom();
    }
    
    /**
     * Add bot message to chat
     */
    function addBotMessage(message) {
        const messagesContainer = document.getElementById('chatbot-messages');
        const messageElement = document.createElement('div');
        messageElement.className = 'chatbot-message bot-message';
        messageElement.innerHTML = `
            <div class="message-avatar">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="12" r="10" fill="url(#gradient3)"/>
                    <defs>
                        <linearGradient id="gradient3" x1="0" y1="0" x2="24" y2="24">
                            <stop offset="0%" stop-color="#667eea"/>
                            <stop offset="100%" stop-color="#764ba2"/>
                        </linearGradient>
                    </defs>
                </svg>
            </div>
            <div class="message-content">
                <p>${escapeHtml(message)}</p>
            </div>
        `;
        messagesContainer.appendChild(messageElement);
        scrollToBottom();
    }
    
    /**
     * Show typing indicator
     */
    function showTypingIndicator() {
        const messagesContainer = document.getElementById('chatbot-messages');
        const typingElement = document.createElement('div');
        typingElement.id = 'typing-indicator';
        typingElement.className = 'chatbot-message bot-message typing-indicator';
        typingElement.innerHTML = `
            <div class="message-avatar">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="12" r="10" fill="url(#gradient4)"/>
                    <defs>
                        <linearGradient id="gradient4" x1="0" y1="0" x2="24" y2="24">
                            <stop offset="0%" stop-color="#667eea"/>
                            <stop offset="100%" stop-color="#764ba2"/>
                        </linearGradient>
                    </defs>
                </svg>
            </div>
            <div class="message-content">
                <div class="typing-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>
        `;
        messagesContainer.appendChild(typingElement);
        scrollToBottom();
    }
    
    /**
     * Remove typing indicator
     */
    function removeTypingIndicator() {
        const typingIndicator = document.getElementById('typing-indicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }
    
    /**
     * Scroll chat to bottom
     */
    function scrollToBottom() {
        const messagesContainer = document.getElementById('chatbot-messages');
        if (messagesContainer) {
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }
    }
    
    /**
     * Escape HTML to prevent XSS
     */
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initChatbot);
    } else {
        initChatbot();
    }
    
})();
