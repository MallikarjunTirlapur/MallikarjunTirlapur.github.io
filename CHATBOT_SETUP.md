# AI Chatbot Integration - Setup Guide

This website now includes an AI chatbot widget that can integrate with Claude (Anthropic) and other AI services.

## Features

- 🤖 AI-powered chat assistant
- 🎨 Modern, responsive design
- 🌓 Dark mode support
- 💬 Real-time conversations
- 🔒 Secure API integration
- 📱 Mobile-friendly interface

## Quick Start

### 1. Get Your API Key

To use the chatbot with Claude (Anthropic):

1. Visit [Anthropic](https://www.anthropic.com/)
2. Sign up for an account
3. Subscribe to Claude Pro+ or API access
4. Generate your API key from the dashboard

### 2. Configure the Chatbot

Edit `/assets/js/chatbot.js` and update the configuration:

```javascript
const CHATBOT_CONFIG = {
    enabled: true,
    provider: 'claude',
    apiKey: 'YOUR_API_KEY_HERE', // Replace with your actual API key
    apiEndpoint: 'https://api.anthropic.com/v1/messages',
    model: 'claude-3-sonnet-20240229',
    // ... other settings
};
```

**Important Security Note:** 
- The current implementation stores the API key in the JavaScript file
- For production use, implement a backend proxy to handle API calls securely
- Never commit your actual API key to version control
- Consider using environment variables or a secrets manager

### 3. Test the Chatbot

1. Open your website in a browser
2. Click the chatbot button in the bottom-right corner
3. Type a message and press Enter or click Send
4. The AI assistant will respond to your query

## Configuration Options

### Basic Settings

| Option | Description | Default |
|--------|-------------|---------|
| `enabled` | Enable/disable the chatbot | `true` |
| `provider` | AI provider ('claude', 'openai', 'custom') | `'claude'` |
| `apiKey` | Your API key | `''` |
| `model` | AI model to use | `'claude-3-sonnet-20240229'` |
| `theme` | Widget theme ('light', 'dark') | `'light'` |
| `position` | Widget position ('bottom-right', 'bottom-left') | `'bottom-right'` |

### Customization

You can customize the chatbot appearance by modifying `/assets/css/chatbot.css`:

- Colors and gradients
- Button styles
- Message bubble designs
- Animation effects
- Responsive breakpoints

## Troubleshooting

### "Looks like something went wrong!"

This error typically occurs when:

1. **API Key Not Configured**: Make sure you've set your API key in `chatbot.js`
2. **Invalid API Key**: Verify your API key is correct and active
3. **API Quota Exceeded**: Check your API usage limits
4. **Network Issues**: Ensure you have internet connectivity
5. **CORS Issues**: If using a custom endpoint, configure CORS properly

### Configuration Warning Message

If you see a warning about configuration:

1. Open `/assets/js/chatbot.js`
2. Find the `CHATBOT_CONFIG` object
3. Set your `apiKey` value
4. Save and reload the page

### API Provider Issues

**For Claude (Anthropic):**
- Ensure you have an active subscription (Pro+ or API access)
- Verify your API key has the necessary permissions
- Check the [Anthropic Status Page](https://status.anthropic.com/)

## Security Best Practices

### Production Deployment

For a production website, implement these security measures:

1. **Backend Proxy**: Create a server-side endpoint to handle API calls
2. **Environment Variables**: Store API keys securely
3. **Rate Limiting**: Implement rate limiting to prevent abuse
4. **User Authentication**: Add user authentication if needed
5. **Input Validation**: Sanitize user inputs
6. **HTTPS Only**: Ensure your site uses HTTPS

### Example Backend Proxy (Node.js/Express)

```javascript
// server.js
const express = require('express');
const app = express();

app.post('/api/chat', async (req, res) => {
    const { message } = req.body;
    
    // Call Anthropic API with your secure API key
    const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-api-key': process.env.ANTHROPIC_API_KEY,
            'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
            model: 'claude-3-sonnet-20240229',
            max_tokens: 1024,
            messages: [{ role: 'user', content: message }]
        })
    });
    
    const data = await response.json();
    res.json(data);
});

app.listen(3000);
```

Then update `chatbot.js` to call your backend:

```javascript
async function callClaudeAPI(message) {
    const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message })
    });
    
    const data = await response.json();
    return data.content[0].text;
}
```

## Supported AI Providers

### Current Support
- ✅ Claude (Anthropic) - Fully supported

### Planned Support
- 🔄 OpenAI GPT - Coming soon
- 🔄 Custom endpoints - Coming soon

## API Costs

Be aware of API usage costs:

- **Claude Pro+**: Subscription-based with API access
- **Claude API**: Pay-per-token pricing
- Monitor your usage in the Anthropic dashboard

## Customizing the Chat Experience

### Personality and Behavior

You can customize the assistant's personality by modifying the system prompt in `callClaudeAPI()`:

```javascript
body: JSON.stringify({
    model: CHATBOT_CONFIG.model,
    max_tokens: 1024,
    system: "You are a helpful assistant for Mallikarjun Tirlapur's portfolio website...",
    messages: [{ role: 'user', content: message }]
})
```

### Adding Context

To make the assistant more helpful for your portfolio:

```javascript
system: `You are an AI assistant on Mallikarjun Tirlapur's portfolio website. 
He is a Senior Staff Embedded Software Developer with 12+ years of experience 
specializing in JavaCard Operating Systems and secure embedded solutions. 
Help visitors learn more about his work, projects, and expertise.`
```

## Browser Support

The chatbot supports all modern browsers:
- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## Performance

The chatbot is optimized for performance:
- Lazy loading of resources
- Minimal impact on page load
- Efficient API calls
- Responsive animations

## Accessibility

The chatbot includes accessibility features:
- Keyboard navigation support
- Screen reader compatible
- Focus indicators
- ARIA labels
- High contrast support

## Support

If you encounter issues:

1. Check the browser console for error messages
2. Verify your API key configuration
3. Review the Anthropic API documentation
4. Check your API usage and quotas

## License

This chatbot integration is part of the personal portfolio website.

## Credits

- Chatbot design inspired by modern UI/UX practices
- Integrates with Anthropic's Claude AI
- Built with vanilla JavaScript and CSS

---

Last updated: February 2026
