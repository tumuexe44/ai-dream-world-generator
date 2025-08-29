# 🚀 Qoder Otomasyon Workflow Kurulum Rehberi

## 📋 Genel Bakış

Bu rehber, Rüya Dünyası Oluşturucu uygulaması için Qoder platformunda nasıl otomasyon workflow'u oluşturacağınızı adım adım açıklar.

## 🎯 Workflow Adımları

### 1️⃣ Webhook (Trigger) Kurulumu

**Amaç**: HTML formundan gelen verileri almak
**Node Türü**: Webhook Trigger

#### Ayarlar:
- **Method**: POST
- **Authentication**: None (veya ihtiyaca göre)
- **Response Format**: JSON

#### Beklenen Veri Formatı:
```json
{
  "ad": "Emily",
  "renkler": "mor, gece mavisi",
  "mekanlar": "uçan adalar, gizemli orman",
  "atmosfer": "gizemli ve huzurlu",
  "karakterler": "büyülü tilki, ışık saçan kelebekler",
  "detaylar": "parlayan nehirler, yavaşça kayan yıldızlar"
}
```

#### Test Verisi:
Webhook URL'ini aldıktan sonra aşağıdaki curl komutuyla test edebilirsiniz:
```bash
curl -X POST YOUR_WEBHOOK_URL \
  -H "Content-Type: application/json" \
  -d '{
    "ad": "Test User",
    "renkler": "mavi, yeşil",
    "mekanlar": "orman, göl",
    "atmosfer": "huzurlu",
    "karakterler": "unicorn",
    "detaylar": "yıldızlar"
  }'
```

---

### 2️⃣ Function Node (Prompt Oluşturma)

**Amaç**: AI için görsel prompt oluşturmak
**Node Türü**: Function

#### JavaScript Kodu:
```javascript
// Gelen veriyi kontrol et
const inputData = items[0].json;

// Veri doğrulama
if (!inputData.mekanlar || !inputData.karakterler || !inputData.atmosfer || 
    !inputData.renkler || !inputData.detaylar) {
    throw new Error('Eksik form verisi');
}

// AI için optimize edilmiş prompt oluştur
const gorselPrompt = `A highly detailed, surreal dreamscape inspired by ${inputData.mekanlar}, featuring ${inputData.karakterler}, in a ${inputData.atmosfer} mood, with dominant colors ${inputData.renkler}, including special details like ${inputData.detaylar}, cinematic lighting, photorealistic, 8K resolution, fantasy art style, professional digital art`;

// Ek metadata
const metadata = {
    user_name: inputData.ad,
    prompt_created_at: new Date().toISOString(),
    original_data: inputData
};

// Çıktı verisini hazırla
return [{
    json: {
        gorselPrompt: gorselPrompt,
        metadata: metadata,
        ...inputData
    }
}];
```

#### Çıktı Örneği:
```json
{
  "gorselPrompt": "A highly detailed, surreal dreamscape inspired by uçan adalar, gizemli orman, featuring büyülü tilki, ışık saçan kelebekler, in a gizemli ve huzurlu mood, with dominant colors mor, gece mavisi, including special details like parlayan nehirler, yavaşça kayan yıldızlar, cinematic lighting, photorealistic, 8K resolution, fantasy art style, professional digital art",
  "metadata": {...},
  "ad": "Emily",
  "renkler": "mor, gece mavisi"
}
```

---

### 3️⃣ HTTP Request Node (AI Image Generation)

**Amaç**: Prompt'u AI servisine göndermek ve görsel oluşturmak
**Node Türü**: HTTP Request

#### Gemini AI Ayarları:
- **Method**: POST
- **URL**: `https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-001:generateImage?key=YOUR_API_KEY`
- **Headers**:
  ```json
  {
    "Content-Type": "application/json"
  }
  ```

#### Request Body:
```json
{
  "prompt": "{{ $json.gorselPrompt }}",
  "sampleCount": 1,
  "aspectRatio": "1:1",
  "safetySettings": [
    {
      "category": "HARM_CATEGORY_HATE_SPEECH",
      "threshold": "BLOCK_MEDIUM_AND_ABOVE"
    }
  ]
}
```

#### Alternatif - OpenAI DALL-E 3 Ayarları:
- **Method**: POST
- **URL**: `https://api.openai.com/v1/images/generations`
- **Headers**:
  ```json
  {
    "Content-Type": "application/json",
    "Authorization": "Bearer YOUR_OPENAI_API_KEY"
  }
  ```

#### OpenAI Request Body:
```json
{
  "model": "dall-e-3",
  "prompt": "{{ $json.gorselPrompt }}",
  "n": 1,
  "size": "1024x1024",
  "quality": "standard",
  "response_format": "url"
}
```

#### Beklenen Response (Gemini):
```json
{
  "candidates": [
    {
      "imageUri": "https://storage.googleapis.com/your-bucket/generated-image.png"
    }
  ]
}
```

#### Beklenen Response (OpenAI):
```json
{
  "data": [
    {
      "url": "https://oaidalleapiprodscus.blob.core.windows.net/private/image.png"
    }
  ]
}
```

---

### 4️⃣ Function Node (Response Formatla)

**Amaç**: API yanıtını standardize etmek
**Node Türü**: Function

#### Gemini için JavaScript Kodu:
```javascript
const aiResponse = items[0].json;
const originalData = items[1].json; // Önceki step'ten gelen veri

let imageUrl = '';

// Gemini response format
if (aiResponse.candidates && aiResponse.candidates[0] && aiResponse.candidates[0].imageUri) {
    imageUrl = aiResponse.candidates[0].imageUri;
}
// OpenAI response format
else if (aiResponse.data && aiResponse.data[0] && aiResponse.data[0].url) {
    imageUrl = aiResponse.data[0].url;
}
else {
    throw new Error('AI servisinden görsel alınamadı');
}

// Success response hazırla
const successResponse = {
    success: true,
    image_url: imageUrl,
    user_name: originalData.ad,
    prompt_used: originalData.gorselPrompt,
    generated_at: new Date().toISOString(),
    metadata: originalData.metadata || {}
};

return [{
    json: successResponse
}];
```

---

### 5️⃣ Response Node (Webhook Reply)

**Amaç**: HTML sayfasına sonucu geri göndermek
**Node Türü**: Respond to Webhook

#### Ayarlar:
- **Response Code**: 200
- **Response Headers**:
  ```json
  {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type"
  }
  ```

#### Response Body:
```json
{
  "success": {{ $json.success }},
  "image_url": "{{ $json.image_url }}",
  "user_name": "{{ $json.user_name }}",
  "generated_at": "{{ $json.generated_at }}"
}
```

---

## 🔧 Hata Yönetimi

### Error Handling Function Node
Her major step'ten sonra hata kontrolü ekleyin:

```javascript
// Hata durumunu kontrol et
if (!items[0] || !items[0].json) {
    return [{
        json: {
            success: false,
            error: 'Veri bulunamadı',
            error_code: 'NO_DATA'
        }
    }];
}

// API hatası kontrolü
if (items[0].json.error) {
    return [{
        json: {
            success: false,
            error: items[0].json.error.message || 'AI servisi hatası',
            error_code: 'AI_SERVICE_ERROR'
        }
    }];
}

// Rate limit kontrolü
if (items[0].statusCode === 429) {
    return [{
        json: {
            success: false,
            error: 'Çok fazla istek. Lütfen bekleyin.',
            error_code: 'RATE_LIMIT'
        }
    }];
}
```

---

## 🧪 Test Senaryoları

### 1. Normal Test
```json
{
  "ad": "Test User",
  "renkler": "mavi, yeşil",
  "mekanlar": "orman, şelale",
  "atmosfer": "huzurlu, büyülü",
  "karakterler": "unicorn, kelebek",
  "detaylar": "gökkuşağı, çiçekler"
}
```

### 2. Türkçe Karakter Testi
```json
{
  "ad": "Özge",
  "renkler": "eflatun, gümüş",
  "mekanlar": "kristal mağara, bulut şehri",
  "atmosfer": "gizemli, büyüleyici",
  "karakterler": "ejder, peri",
  "detaylar": "ışıldayan kristaller, uçan çiçekler"
}
```

### 3. Uzun Metin Testi
```json
{
  "ad": "Maksimum",
  "renkler": "derin mor, altın sarısı, gece mavisi, gümüş",
  "mekanlar": "sonsuz uzay, kristal gezegenler, ışık köprüleri, bulut şehirleri",
  "atmosfer": "büyülü, gizemli, huzur verici, büyüleyici",
  "karakterler": "kozmik ejder, ışık saçan unicorn, kristal kelebekler, yıldız perileri",
  "detaylar": "parlayan nehirler, dans eden yıldızlar, ışıldayan kristaller, büyülü ağaçlar"
}
```

---

## 📊 Monitoring ve Analytics

### Log Function Node
Workflow'un başına ve sonuna log node'ları ekleyin:

```javascript
// Başlangıç log
console.log('Dream generation started:', {
    user: items[0].json.ad,
    timestamp: new Date().toISOString(),
    request_id: Date.now()
});

// Bitiş log
console.log('Dream generation completed:', {
    user: items[0].json.user_name,
    success: items[0].json.success,
    image_url: items[0].json.image_url ? 'Generated' : 'Failed',
    timestamp: new Date().toISOString()
});
```

---

## 🔄 Gelişmiş Özellikler

### 1. Multiple Image Generation
Tek seferde birden fazla görsel oluşturmak için:

```javascript
// Function Node - Multiple Prompts
const variations = [
    `${originalPrompt}, artistic style`,
    `${originalPrompt}, photorealistic style`,
    `${originalPrompt}, cartoon style`
];

const requests = variations.map(prompt => ({
    prompt: prompt,
    size: "1024x1024"
}));

return requests.map((req, index) => ({
    json: req,
    index: index
}));
```

### 2. Email Notification
Görsel oluşturulduktan sonra e-posta gönderimi:

```javascript
// Email Function Node
const emailData = {
    to: items[0].json.email || 'user@example.com',
    subject: `${items[0].json.user_name}, Rüya Dünyanız Hazır! 🌟`,
    html: `
        <h2>Merhaba ${items[0].json.user_name}!</h2>
        <p>Rüya dünyanız başarıyla oluşturuldu.</p>
        <img src="${items[0].json.image_url}" style="max-width: 500px;">
        <p>Rüya detaylarınız:</p>
        <ul>
            <li><strong>Renkler:</strong> ${items[0].json.renkler}</li>
            <li><strong>Mekanlar:</strong> ${items[0].json.mekanlar}</li>
            <li><strong>Atmosfer:</strong> ${items[0].json.atmosfer}</li>
        </ul>
    `
};
```

### 3. Database Storage
Oluşturulan görselleri veritabanında saklamak:

```javascript
// Database Function Node
const dbRecord = {
    user_name: items[0].json.user_name,
    image_url: items[0].json.image_url,
    prompt: items[0].json.gorselPrompt,
    form_data: items[0].json.metadata.original_data,
    created_at: new Date().toISOString(),
    status: 'completed'
};

// HTTP Request to your database API
// POST /api/dreams
```

---

## 🚀 Deployment Checklist

- [ ] Webhook URL'ini HTML dosyasında güncelle
- [ ] AI API anahtarlarını ekle
- [ ] CORS ayarlarını yapılandır
- [ ] Rate limiting ekle
- [ ] Error handling test et
- [ ] Monitoring/logging aktifleştir
- [ ] Production ortamında test et

---

## 🔧 Troubleshooting

### Yaygın Sorunlar:

1. **CORS Error**: Response node'a CORS headers ekleyin
2. **Timeout**: AI request timeout'u artırın (60s)
3. **Rate Limit**: Retry logic ekleyin
4. **Image Load Error**: Image URL'in geçerli olduğunu kontrol edin
5. **Türkçe Karakter**: UTF-8 encoding kontrol edin

---

Bu workflow kurulumu tamamlandığında, kullanıcılarınız web sitesinde form doldurarak AI destekli rüya dünyaları oluşturabilecekler! 🎨✨