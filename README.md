# 🌟 AI-Powered Dream World Generator | Yapay Zeka Destekli Rüya Dünyası Oluşturucu

**Gelişmiş AI Agent teknolojisi** ile rüya dünyanızı oluşturun! Türkçe hayal gücünüzü **Gemini AI** ile İngilizce sanata dönüştürür, **DALL-E 3** ile benzersiz görsel sanat eserleri yaratır.

## 🎯 Özellikler

- 🤖 **AI Agent Powered**: Gemini AI ile akıllı prompt oluşturma
- 🎨 **İki Katmanlı AI**: Gemini + DALL-E 3 entegrasyonu
- 🌙 **Türkçe Arayüz**: Tam Türkçe kullanıcı deneyimi
- 📱 **Responsive Tasarım**: Mobil ve masaüstü uyumlu
- ⚡ **Akıllı Çeviri**: AI destekli Türkçe-İngilizce dönüşüm
- 💾 **Görsel İndirme**: Oluşturulan görselleri kaydetme
- 🔄 **Akıllı Hata Yönetimi**: Kullanıcı dostu hata mesajları
- 🎭 **Kişiselleştirilmiş Sonuçlar**: Her kullanıcı için benzersiz promptlar

## 🚀 Hızlı Başlangıç

### 1. Dosyaları İndirin
```bash
git clone [repository-url]
cd dream-world-generator
```

### 2. Web Sunucusu Başlatın
```bash
# Python ile (önerilen)
python -m http.server 8000

# PHP ile
php -S localhost:8000

# Node.js ile
npx http-server
```

### 3. Tarayıcıda Açın
```
http://localhost:8000
```

## 📁 Proje Yapısı

```
dream-world-generator/
├── index.html              # Ana HTML sayfası
├── style.css               # CSS stilleri
├── script.js               # JavaScript fonksiyonları
├── QODER_WORKFLOW_SETUP.md  # Qoder automation rehberi
└── README.md               # Bu dosya
```

## 🔧 Kurulum ve Yapılandırma

### Qoder Webhook Integration

1. **script.js** dosyasını açın
2. `QODER_WEBHOOK_URL` değişkenini güncelleyin:
```javascript
const QODER_WEBHOOK_URL = 'https://your-qoder-webhook-url';
```

3. Qoder workflow'unu kurmak için `QODER_WORKFLOW_SETUP.md` dosyasını takip edin

### Demo Modu

Webhook yapılandırması yapmadan test etmek için:
- Webhook URL'ini değiştirmeyin (`YOUR_QODER_WEBHOOK_URL` olarak bırakın)
- Uygulama otomatik olarak demo görsellerle çalışacak

## 🎨 Kullanım

### 1. Form Doldurma
Kullanıcılar aşağıdaki bilgileri girer:
- **Ad**: Kişisel tanımlama
- **Favori Renkler**: Görsel ton paleti
- **Favori Mekanlar**: Sahne ve ortam
- **Atmosfer**: Duygu ve mood
- **Karakterler**: Figür ve varlıklar
- **Özel Detaylar**: Benzersiz öğeler

### 2. AI İşleme
- Form verileri Qoder webhook'a gönderilir
- AI prompt otomatik oluşturulur
- Gemini/DALL-E ile görsel üretilir
- Sonuç kullanıcıya gösterilir

### 3. Sonuç İşlemleri
- Görseli indirme
- Sosyal medyada paylaşma
- Yeni rüya oluşturma

## 🔌 API Entegrasyonu

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

### Beklenen Response
```json
{
  "success": true,
  "image_url": "https://example.com/generated-image.jpg",
  "user_name": "Emily",
  "generated_at": "2024-01-01T12:00:00Z"
}
```

### Hata Response
```json
{
  "success": false,
  "error": "Hata mesajı",
  "error_code": "ERROR_TYPE"
}
```

## 🎯 Qoder Workflow Adımları

1. **Webhook Trigger**: Form verilerini al
2. **Function Node**: AI prompt oluştur
3. **HTTP Request**: AI servisine gönder
4. **Function Node**: Response formatla
5. **Response Node**: Sonucu geri gönder

Detaylı kurulum için: [QODER_WORKFLOW_SETUP.md](QODER_WORKFLOW_SETUP.md)

## 🎨 Customization

### Stil Değişiklikleri
`style.css` dosyasında:
- Renk paleti değiştirme
- Font family güncelleme
- Responsive breakpoint'ler
- Animation ayarları

### JavaScript Özelleştirme
`script.js` dosyasında:
- Demo görsel listesi
- Timeout süreleri
- Validation kuralları
- Hata mesajları

### HTML Yapısı
`index.html` dosyasında:
- Form alanları ekleme/çıkarma
- Meta etiketleri güncelleme
- SEO optimizasyonu

## 📱 Responsive Özellikler

- **Desktop**: Full form layout
- **Tablet**: Optimized spacing
- **Mobile**: Stacked layout, touch-friendly
- **Accessibility**: Keyboard navigation, screen reader support

## 🔒 Güvenlik

- Form validation (client & server side)
- CORS protection
- Rate limiting (Qoder side)
- Input sanitization
- Error message sanitization

## 📊 Performance

- **Image lazy loading**
- **Progressive enhancement**
- **Optimized CSS/JS**
- **Compressed assets**
- **Caching strategies**

## 🌐 Browser Support

- ✅ Chrome 80+
- ✅ Firefox 75+
- ✅ Safari 13+
- ✅ Edge 80+
- ✅ Mobile browsers

## 🚀 Production Deployment

### Static Hosting
```bash
# Netlify
netlify deploy --prod --dir .

# Vercel
vercel --prod

# GitHub Pages
# Push to gh-pages branch
```

### Environment Variables
```javascript
// Production config
const CONFIG = {
    WEBHOOK_URL: process.env.QODER_WEBHOOK_URL,
    API_TIMEOUT: 30000,
    MAX_RETRIES: 3
};
```

## 📈 Analytics & Monitoring

Önerilen tracking events:
- `dream_form_submit`: Form gönderimi
- `dream_generated`: Başarılı görsel oluşturma
- `dream_download`: Görsel indirme
- `dream_share`: Paylaşım
- `error_occurred`: Hata durumları

## 🛠️ Troubleshooting

### Yaygın Sorunlar

**1. Form gönderilmiyor**
- Console error'ları kontrol edin
- Network tab'da request'i inceleyin
- CORS ayarlarını doğrulayın

**2. Görsel yüklenmiyor**
- Image URL'in geçerli olduğunu kontrol edin
- Network bağlantısını test edin
- Browser cache'i temizleyin

**3. Mobilde görünüm bozuk**
- Viewport meta tag'ini kontrol edin
- CSS media queries'i test edin
- Touch event'leri doğrulayın

## 🤝 Katkıda Bulunma

1. Fork yapın
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Commit yapın (`git commit -m 'Add amazing feature'`)
4. Push edin (`git push origin feature/amazing-feature`)
5. Pull Request açın

## 📝 License

Bu proje MIT License altında lisanslanmıştır. Detaylar için [LICENSE](LICENSE) dosyasına bakın.

## 📞 Destek

- 📧 Email: support@example.com
- 💬 Discord: [Dream Community](#)
- 📚 Docs: [Documentation](#)
- 🐛 Issues: [GitHub Issues](#)

## 🎉 Teşekkürler

- 🤖 AI Technology: Gemini AI / OpenAI DALL-E
- 🔗 Automation: Qoder Platform
- 🎨 Icons: Emoji / Font Awesome
- 📷 Demo Images: Unsplash
- 🎵 Inspiration: Dream community

---

**Hayal gücünüzü gerçeğe dönüştürün! ✨**