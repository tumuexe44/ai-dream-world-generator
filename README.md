# 🌟 AI-Powered Dream World Generator

Create your dream world with **Advanced AI Agent technology**! It transforms your Turkish imagination into English art with **Gemini AI** and creates unique visual artworks with **DALL-E 3**.

## 🎯 Features

- **AI Agent Powered**: Smart prompt creation with Gemini AI
- 🎨 **Two Layer AI**: Gemini + DALL-E 3 integration
- **Turkish Interface**: Full Turkish user experience
- **Responsive Design**: Mobile and desktop compatible
- **Smart Translation**: AI assisted Turkish-English conversion
- 💾 **Image Download**: Saving created images
- 🔄 **Intelligent Error Management**: User-friendly error messages
- **Personalised Results**: Unique prompts for each user

## 🚀 Quick Start

### 1. Download Files
``bash
git clone [repository-url]
cd dream-world-generator
```

### 2. Start Web Server
``bash
# with Python (recommended)
python -m http.server 8000

# PHP with
php -S localhost:8000

#
npx http-server
 with Node.js

### Open in browser
```
http://localhost:8000
```

## 📁 Project Structure

```
dream-world-generator/
├── index.html # Main HTML page
├── style.css # CSS styles
├── script.js # JavaScript functions
├── QODER_WORKFLOW_SETUP.md # Qoder automation guide
└─── README.md # This file
```

## Installation and Configuration

### Qoder Webhook Integration

1. Open the **script.js** file
2. Update the `QODER_WEBHOOK_URL` variable:
``javascript
const QODER_WEBHOOK_URL = 'https://your-qoder-webhook-url';
```

3. Follow the file `QODER_WORKFLOW_SETUP.md` to install the Qoder workflow


#### Demo Mode
To test without configuring the webhook:
- Do not change the webhook URL (leave it as `YOUR_QODER_WEBHOOK_URL`)
- The application will automatically work with demo images
## 🎨 Use
### 1. Form Filling
Users enter the following information:
- **Name**: Personal Identification
- **Favourite Colours**: Visual tone palette
- **Favourite Venues**: Stage and ambience
- **Atmosphere**: Emotion and mood
- **Characters**: Figures and assets
- **Special Details**: Unique items
### 2. AI Processing
- Form data is sent to the Qoder webhook
- AI prompt is generated automatically
- Image generated with Gemini/DALL-E
- The result is displayed to the user
### 3. Result Transactions
- Download the image
- Sharing on social media
- Creating a new dream
## 🔌 API Integration
### Webhook Endpoint
```http
POST YOUR_WEBHOOK_URL
Content-Type: application/json
{
  "ad": "Emily",
  "renkler": "mor, gece mavisi",
  "mekanlar": "uçan adalar, gizemli orman",
  "atmosfer": "gizemli ve huzurlu",
  "karakterler": "büyülü tilki, ışık saçan kelebekler",
  "detaylar": "parlayan nehirler, yavaşça kayan yıldızlar"
}
```

### Expected response
```json
{
  "success": true,
  "image_url": "https://example.com/generated-image.jpg",
  "user_name": "Emily",
  "generated_at": "2024-01-01T12:00:00Z"
}
```

### Error Response
```json
{
  "success": false,
  "error": "Hata mesajı",
  "error_code": "ERROR_TYPE"
}
```

## 🎯 Qoder Workflow Steps

1. **Webhook Trigger**: Get form data
2. **Function Node**: Generate AI prompt
3. **HTTP Request**: Send to AI service
4. **Function Node**: Response formatla
5. **Response Node**: Send result back

For detailed installation: [QODER_WORKFLOW_SETUP.md](QODER_WORKFLOW_SETUP.md)

## 🎨 Customization

### Style Changes in
`style.css` file:
- Changing the colour palette
- Font family update
- Responsive breakpoints
- Animation settings

### JavaScript Customisation in
`script.js` file:
- Demo image list
- Timeout times
- Validation rules
- Error messages

### HTML Structure at
`index.html` file:
- Add/remove form fields
- Meta tags update
- SEO optimisation

## 📱 Responsive Features

- **Desktop**: Full form layout
- **Tablet**: Optimised spacing
- **Mobile**: Stacked layout, touch-friendly
- **Accessibility**: Keyboard navigation, screen reader support

## 🔒 Security

- Form validation (client & server side)
- CORS protection
- Rate limiting (Qoder side)
- Input sanitisation
- Error message sanitisation

## 📊 Performance

- **Image lazy loading**
- **Progressive improvement**
- **Optimised CSS/JS**
- **Compressed assets**
- **Caching strategies**

## 🌐 Browser Support

- ✅ Chrome 80+
- ✅ Firefox 75+
- ✅ Safari 13+
- ✅ Edge 80+
- ✅ Mobile browsers

## 🚀 Production Distribution

### Static Hosting
``bash
# Netlify
netlify deploy --prod --dir .

# Vercel
vercel --prod

# GitHub Pages
# push to gh-pages branch
``

### Environment Variables
``javascript
// Production configuration
const CONFIG = {
 WEBHOOK_URL: process.env.QODER_WEBHOOK_URL,
 API_TIMEOUT: 30000,
 MAX_RETRIES: 3
};
```

## 📈 Analytics & Monitoring
Recommended tracking events:
- `dream_form_submit`: Form submission
- `dream_generated`: Successful image generation
- `dream_download`: Image download
- `dream_share`: `share`.
- `error_occurred`: Error conditions
## 🛠️ Troubleshooting
### Common Problems
**1. Form not being sent**
- Check console errors
- Review request in the Network tab
- Verify CORS settings

**2. Image not loading**
- Check that the Image URL is valid
- Test network connection
- Clear browser cache
**3. Broken view on mobile**
- Check the viewport meta tag
- Test CSS media queries
- Verify touch events

## 🤝 Contribution
1. Make fork
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit (`git commit -m 'Add amazing feature'`)
4. Push (`go push origin feature/amazing-feature`)
5. Open Pull Request

## 📝 Licence

This project is licensed under the MIT Licence. See the [LICENSE](LICENSE) file for details.

## 📞 Support

- 📧 Email: support@example.com
- 💬 Discord: [Dream Community](#)
- 📚 Docs: [Documentation](#)
- 🐛 Issues: [GitHub Issues](#)

## 🎉 Thank you

- 🤖 AI Technology: Gemini AI / OpenAI DALL-E
- 🔗 Automation: Qoder Platform
- 🎨 Icons: Emoji / Font Awesome
- 📷 Demo Images: Unsplash
- 🎵 Inspiration: Dream community

---

     **Turn your imagination into reality! ✨**
