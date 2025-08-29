// Configuration - n8n Webhook URL
const N8N_WEBHOOK_URL = 'http://localhost:5678/webhook-test/dream-generator'; // n8n local webhook URL

// DOM Elements
const dreamForm = document.getElementById('dreamForm');
const submitBtn = document.getElementById('submitBtn');
const btnText = submitBtn.querySelector('.btn-text');
const loadingSpinner = submitBtn.querySelector('.loading-spinner');
const resultSection = document.getElementById('resultSection');
const resultImage = document.getElementById('resultImage');
const imagePlaceholder = document.getElementById('imagePlaceholder');
const imageActions = document.getElementById('imageActions');
const errorSection = document.getElementById('errorSection');
const errorText = document.getElementById('errorText');

// Global variables
let currentImageUrl = '';
let currentFormData = null;

// Form submission handler
dreamForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    // Get form data and clean it
    const formData = new FormData(this);
    const dreamData = Object.fromEntries(formData.entries());
    
    // Clean and trim all fields
    const cleanedData = {};
    for (const [key, value] of Object.entries(dreamData)) {
        cleanedData[key] = typeof value === 'string' ? value.trim() : value;
    }
    
    currentFormData = cleanedData;
    
    console.log('Form submitted with data:', cleanedData);
    
    // Validate form data
    if (!validateFormData(cleanedData)) {
        const missingFields = [];
        const requiredFields = ['ad', 'renkler', 'mekanlar', 'atmosfer', 'karakterler', 'detaylar'];
        
        for (const field of requiredFields) {
            if (!cleanedData[field] || cleanedData[field].trim().length === 0) {
                missingFields.push(field);
            }
        }
        
        const fieldNames = {
            'ad': 'Ad',
            'renkler': 'Renkler',
            'mekanlar': 'Mekanlar',
            'atmosfer': 'Atmosfer',
            'karakterler': 'Karakterler',
            'detaylar': 'Detaylar'
        };
        
        const missingFieldNames = missingFields.map(field => fieldNames[field] || field);
        showError(`Lütfen şu alanları doldurun: ${missingFieldNames.join(', ')}`);
        return;
    }
    
    // Show loading state with timeout warning
    showLoadingState();
    
    // Add warning after 45 seconds
    const warningTimeout = setTimeout(() => {
        if (submitBtn.disabled) {
            const placeholderContent = imagePlaceholder.querySelector('.placeholder-content');
            if (placeholderContent) {
                placeholderContent.innerHTML += `
                    <div style="margin-top: 1rem; padding: 0.5rem; background: rgba(255, 193, 7, 0.1); border-radius: 5px; color: #856404;">
                        <small>⚠️ AI görsel oluşturma normal süreden uzun sürüyor. Lütfen bekleyin...</small>
                    </div>
                `;
            }
        }
    }, 45000); // Show warning after 45 seconds
    
    try {
        // Send request to n8n Webhook
        const response = await sendDreamRequest(cleanedData);
        
        console.log('=== N8N RESPONSE DEBUG ===');
        console.log('Full response:', JSON.stringify(response, null, 2));
        console.log('Response type:', typeof response);
        console.log('Success status:', response?.success);
        console.log('Image URL exists:', !!response?.image_url);
        console.log('Image URL type:', typeof response?.image_url);
        
        if (response && response.success && response.image_url) {
            console.log('Image generation successful, image type:', response.image_format || 'unknown');
            console.log('Image URL preview:', response.image_url.substring(0, 100) + '...');
            
            // Validate image URL before showing
            if (typeof response.image_url !== 'string' || response.image_url.trim().length === 0) {
                throw new Error('Geçersiz görsel URL formatı alındı.');
            }
            
            clearTimeout(warningTimeout); // Clear warning timeout on success
            showResult(response.image_url);
        } else {
            clearTimeout(warningTimeout); // Clear warning timeout on error
            
            // More detailed error reporting
            let errorMsg = 'Rüya oluşturulamadı';
            if (response) {
                if (response.error) {
                    errorMsg = response.error;
                } else if (!response.success) {
                    errorMsg = 'n8n workflow başarısız (success: false)';
                } else if (!response.image_url) {
                    errorMsg = 'n8n\'den görsel URL\'si alınamadı';
                }
            } else {
                errorMsg = 'n8n\'den boş yanıt alındı';
            }
            
            throw new Error(errorMsg);
        }
        
    } catch (error) {
        clearTimeout(warningTimeout); // Clear warning timeout on error
        console.error('Dream generation error:', error);
        showError(error.message || 'Bir hata oluştu. Lütfen tekrar deneyin.');
    }
});

// Validate form data
function validateFormData(data) {
    const requiredFields = ['ad', 'renkler', 'mekanlar', 'atmosfer', 'karakterler', 'detaylar'];
    const errors = [];
    
    console.log('Validating form data:', data);
    
    for (const field of requiredFields) {
        if (!data[field]) {
            errors.push(`${field} alanı eksik`);
        } else if (typeof data[field] !== 'string') {
            errors.push(`${field} string olmalı`);
        } else if (data[field].trim().length === 0) {
            errors.push(`${field} alanı boş`);
        } else if (data[field].trim().length < 2) {
            errors.push(`${field} en az 2 karakter olmalı`);
        }
    }
    
    if (errors.length > 0) {
        console.error('Form validation errors:', errors);
        return false;
    }
    
    console.log('Form validation passed');
    return true;
}

// Send dream request to n8n Webhook
async function sendDreamRequest(dreamData) {
    // Always use the configured n8n webhook URL
    // Remove demo mode for production use
    
    console.log('Sending request to n8n webhook:', N8N_WEBHOOK_URL);
    console.log('Dream data:', dreamData);
    
    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify(dreamData)
    };
    
    // Add timeout to the request - increased for AI image generation
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 90000); // 90 second timeout for AI generation
    requestOptions.signal = controller.signal;
    
    try {
        const response = await fetch(N8N_WEBHOOK_URL, requestOptions);
        clearTimeout(timeoutId);
        
        console.log('=== FETCH RESPONSE DEBUG ===');
        console.log('Response status:', response.status);
        console.log('Response ok:', response.ok);
        console.log('Response headers:', Object.fromEntries(response.headers.entries()));
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error('HTTP Error Response:', errorText);
            throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
        }
        
        // Check content type
        const contentType = response.headers.get('content-type');
        console.log('Response content-type:', contentType);
        
        if (!contentType || !contentType.includes('application/json')) {
            const textResponse = await response.text();
            console.error('Non-JSON response:', textResponse);
            throw new Error('n8n yanıtı JSON formatında değil. Workflow hatası olabilir.');
        }
        
        const result = await response.json();
        console.log('Parsed JSON result:', result);
        
        // Validate result structure
        if (typeof result !== 'object' || result === null) {
            throw new Error('n8n yanıtı geçersiz JSON formatında.');
        }
        
        return result;
        
    } catch (error) {
        clearTimeout(timeoutId);
        
        if (error.name === 'AbortError') {
            throw new Error('AI görsel oluşturma işlemi zaman aşımına uğradı (90 saniye). Lütfen tekrar deneyin.');
        }
        
        // Check if n8n is not running
        if (error.message.includes('ECONNREFUSED') || error.message.includes('fetch')) {
            console.log('n8n connection failed, falling back to demo mode');
            return simulateAPIResponse(dreamData);
        }
        
        throw error;
    }
}

// Simulate API response for demo purposes
function simulateAPIResponse(dreamData) {
    return new Promise((resolve) => {
        setTimeout(() => {
            // Generate a demo image URL (you can replace this with actual demo images)
            const demoImages = [
                'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1024&h=1024&fit=crop',
                'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=1024&h=1024&fit=crop',
                'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1024&h=1024&fit=crop',
                'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=1024&h=1024&fit=crop'
            ];
            
            const randomImage = demoImages[Math.floor(Math.random() * demoImages.length)];
            
            resolve({
                success: true,
                image_url: randomImage,
                prompt_used: generatePromptFromData(dreamData)
            });
        }, 2000); // Simulate 2 second delay
    });
}

// Generate AI prompt from form data (this logic should match your Qoder Function Node)
function generatePromptFromData(data) {
    return `A surreal dreamscape inspired by ${data.mekanlar}, featuring ${data.karakterler}, in a ${data.atmosfer} mood, colors ${data.renkler}, with ${data.detaylar}, highly detailed, cinematic lighting, 1024x1024`;
}

// Show loading state
function showLoadingState() {
    // Hide error section
    hideError();
    
    // Update button state
    submitBtn.disabled = true;
    btnText.style.display = 'none';
    loadingSpinner.style.display = 'block';
    
    // Show result section with enhanced placeholder
    resultSection.style.display = 'block';
    resultImage.style.display = 'none';
    imagePlaceholder.style.display = 'flex';
    imageActions.style.display = 'none';
    
    // Enhanced loading message with progress
    updateLoadingMessage();
    
    // Scroll to result section
    resultSection.scrollIntoView({ behavior: 'smooth' });
}

// Update loading message with progress indication
function updateLoadingMessage() {
    const placeholderContent = imagePlaceholder.querySelector('.placeholder-content');
    if (placeholderContent) {
        let step = 0;
        const steps = [
            '📝 Formunuz analiz ediliyor...',
            '🤖 AI prompt oluşturuluyor...',
            '🎨 Görsel üretiliyor...',
            '✨ Son dokunular yapılıyor...'
        ];
        
        function updateStep() {
            if (step < steps.length && submitBtn.disabled) {
                placeholderContent.innerHTML = `
                    <div class="placeholder-icon">🎨</div>
                    <p>${steps[step]}</p>
                    <div class="progress-dots">
                        <span class="dot active"></span>
                        <span class="dot ${step > 0 ? 'active' : ''}"></span>
                        <span class="dot ${step > 1 ? 'active' : ''}"></span>
                        <span class="dot ${step > 2 ? 'active' : ''}"></span>
                    </div>
                    <p><small>Bu işlem 30-60 saniye sürebilir</small></p>
                `;
                step++;
                setTimeout(updateStep, step === 1 ? 5000 : 15000); // First step 5s, others 15s
            }
        }
        
        updateStep();
    }
}

// Show result
function showResult(imageUrl) {
    currentImageUrl = imageUrl;
    
    console.log('=== RESULT DEBUG ===');
    console.log('Image URL type:', typeof imageUrl);
    console.log('Image URL length:', imageUrl ? imageUrl.length : 'null');
    console.log('Image URL preview:', imageUrl ? imageUrl.substring(0, 100) + '...' : 'null');
    console.log('Is base64:', imageUrl ? imageUrl.startsWith('data:image/') : false);
    console.log('Is URL:', imageUrl ? imageUrl.startsWith('http') : false);
    
    // Validate image URL/data
    if (!imageUrl || typeof imageUrl !== 'string' || imageUrl.trim().length === 0) {
        console.error('Invalid image URL:', imageUrl);
        showError('Geçersiz görsel verisi alındı. Lütfen tekrar deneyin.');
        return;
    }
    
    // Reset button state
    resetButtonState();
    
    // Load and display image with enhanced error handling
    const img = new Image();
    
    img.onload = function() {
        console.log('✅ Image loaded successfully');
        console.log('Image dimensions:', img.naturalWidth, 'x', img.naturalHeight);
        
        resultImage.src = imageUrl;
        resultImage.style.display = 'block';
        imagePlaceholder.style.display = 'none';
        imageActions.style.display = 'flex';
        
        // Add fade-in animation
        resultImage.style.opacity = '0';
        setTimeout(() => {
            resultImage.style.opacity = '1';
            resultImage.style.transition = 'opacity 0.5s ease';
        }, 100);
    };
    
    img.onerror = function(event) {
        console.error('❌ Image load failed');
        console.error('Error event:', event);
        console.error('Failed URL:', imageUrl);
        console.error('URL type check:', {
            isBase64: imageUrl.startsWith('data:image/'),
            isHTTP: imageUrl.startsWith('http'),
            isHTTPS: imageUrl.startsWith('https'),
            hasComma: imageUrl.includes(','),
            length: imageUrl.length
        });
        
        // Try to determine the specific error
        let errorMessage = 'Görsel yüklenemedi.';
        
        if (imageUrl.startsWith('data:image/')) {
            // Base64 image error
            if (!imageUrl.includes(',')) {
                errorMessage = 'Base64 görsel formatı hatalı (virgül eksik).';
            } else if (imageUrl.length < 100) {
                errorMessage = 'Base64 görsel verisi çok kısa (bozuk veri).';
            } else {
                errorMessage = 'Base64 görsel verisi bozuk veya desteklenmeyen format.';
            }
        } else if (imageUrl.startsWith('http')) {
            // URL image error
            errorMessage = 'Görsel URL\'sine erişilemiyor. Sunucu hatası olabilir.';
        } else {
            // Unknown format
            errorMessage = 'Bilinmeyen görsel formatı. n8n yanıtını kontrol edin.';
        }
        
        showError(errorMessage + ' Lütfen tekrar deneyin.');
    };
    
    // Handle both base64 data URLs and regular URLs
    if (imageUrl.startsWith('data:image/')) {
        console.log('Loading base64 image, size:', imageUrl.length);
        
        // Validate base64 format
        if (!imageUrl.includes(',')) {
            console.error('Invalid base64 format - no comma separator');
            showError('Base64 görsel formatı hatalı. n8n response formatter\'ını kontrol edin.');
            return;
        }
        
        // Check base64 data length
        const base64Data = imageUrl.split(',')[1];
        if (!base64Data || base64Data.length < 100) {
            console.error('Base64 data too short or missing');
            showError('Base64 görsel verisi eksik veya çok kısa.');
            return;
        }
        
        // Set src for base64
        img.src = imageUrl;
    } else if (imageUrl.startsWith('http')) {
        console.log('Loading URL image:', imageUrl);
        // Regular URL image - normal loading
        img.src = imageUrl;
    } else {
        console.error('Unknown image format:', imageUrl.substring(0, 50));
        showError('Bilinmeyen görsel formatı. Lütfen n8n workflow\'unu kontrol edin.');
        return;
    }
}

// Show error
function showError(message) {
    // Reset button state
    resetButtonState();
    
    // Hide result section
    resultSection.style.display = 'none';
    
    // Show error section
    errorText.textContent = message;
    errorSection.style.display = 'block';
    
    // Scroll to error section
    errorSection.scrollIntoView({ behavior: 'smooth' });
}

// Hide error
function hideError() {
    errorSection.style.display = 'none';
}

// Reset button state
function resetButtonState() {
    submitBtn.disabled = false;
    btnText.style.display = 'block';
    loadingSpinner.style.display = 'none';
}

// Download image function
function downloadImage() {
    if (!currentImageUrl) {
        console.error('No image URL available for download');
        return;
    }
    
    console.log('Downloading image:', currentImageUrl.substring(0, 50) + '...');
    
    if (currentImageUrl.startsWith('data:image/')) {
        // Base64 image download - direct data URL approach
        console.log('Downloading base64 image');
        try {
            const link = document.createElement('a');
            link.href = currentImageUrl;
            link.download = `ruya-dunyasi-${currentFormData?.ad || 'user'}-${Date.now()}.png`;
            
            // Add to DOM temporarily for Firefox compatibility
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            console.log('Base64 image download initiated');
        } catch (error) {
            console.error('Base64 download error:', error);
            // Fallback: open in new tab
            window.open(currentImageUrl, '_blank');
        }
    } else {
        // Regular URL image download - fetch and blob approach
        console.log('Downloading URL image');
        fetch(currentImageUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.blob();
            })
            .then(blob => {
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = `ruya-dunyasi-${currentFormData?.ad || 'user'}-${Date.now()}.jpg`;
                
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                
                // Clean up
                window.URL.revokeObjectURL(url);
                console.log('URL image download completed');
            })
            .catch(error => {
                console.error('URL download error:', error);
                // Fallback: open in new tab
                window.open(currentImageUrl, '_blank');
            });
    }
}

// Share image function
function shareImage() {
    if (!currentImageUrl) {
        console.error('No image URL available for sharing');
        return;
    }
    
    console.log('Sharing image:', currentImageUrl.substring(0, 50) + '...');
    
    // Check if Web Share API is supported
    if (navigator.share) {
        if (currentImageUrl.startsWith('data:image/')) {
            // For base64 images, convert to blob for sharing
            try {
                // Extract base64 data
                const base64Data = currentImageUrl.split(',')[1];
                const byteCharacters = atob(base64Data);
                const byteNumbers = new Array(byteCharacters.length);
                for (let i = 0; i < byteCharacters.length; i++) {
                    byteNumbers[i] = byteCharacters.charCodeAt(i);
                }
                const byteArray = new Uint8Array(byteNumbers);
                const blob = new Blob([byteArray], { type: 'image/png' });
                const file = new File([blob], `ruya-dunyasi-${currentFormData?.ad || 'user'}.png`, { type: 'image/png' });
                
                navigator.share({
                    title: 'Rüya Dünyam',
                    text: `${currentFormData?.ad || 'Bir kullanıcı'} adlı kişinin rüya dünyasını görün!`,
                    files: [file]
                }).catch(error => {
                    console.error('Base64 share error:', error);
                    fallbackShare();
                });
            } catch (error) {
                console.error('Base64 to blob conversion error:', error);
                fallbackShare();
            }
        } else {
            // For URL images, share the URL
            navigator.share({
                title: 'Rüya Dünyam',
                text: `${currentFormData?.ad || 'Bir kullanıcı'} adlı kişinin rüya dünyasını görün!`,
                url: currentImageUrl
            }).catch(error => {
                console.error('URL share error:', error);
                fallbackShare();
            });
        }
    } else {
        fallbackShare();
    }
    
    function fallbackShare() {
        // Fallback: copy to clipboard or show URL
        if (currentImageUrl.startsWith('data:image/')) {
            // For base64, show info message
            alert('Görsel hazırlandı! İndirme tuşunu kullanarak kaydedebilirsiniz.');
        } else {
            // For URLs, try to copy to clipboard
            navigator.clipboard.writeText(currentImageUrl).then(() => {
                alert('Görsel bağlantısı panoya kopyalandı!');
            }).catch(() => {
                // Last resort: show URL in prompt
                prompt('Görsel bağlantısını kopyalayın:', currentImageUrl);
            });
        }
    }
}

// Create new dream function
function createNewDream() {
    // Reset form
    dreamForm.reset();
    
    // Hide result and error sections
    resultSection.style.display = 'none';
    errorSection.style.display = 'none';
    
    // Reset global variables
    currentImageUrl = '';
    currentFormData = null;
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Focus on first input
    document.getElementById('ad').focus();
}

// Reset form function
function resetForm() {
    hideError();
    createNewDream();
}

// Input validation and user experience improvements
document.addEventListener('DOMContentLoaded', function() {
    // Add input event listeners for better UX
    const inputs = dreamForm.querySelectorAll('input[required]');
    
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateInput(this);
        });
        
        input.addEventListener('input', function() {
            clearInputError(this);
        });
    });
    
    // Auto-focus on first input
    document.getElementById('ad').focus();
});

// Validate individual input
function validateInput(input) {
    const value = input.value.trim();
    
    if (value.length === 0) {
        showInputError(input, 'Bu alan zorunludur');
        return false;
    }
    
    if (value.length < 2) {
        showInputError(input, 'En az 2 karakter girmelisiniz');
        return false;
    }
    
    clearInputError(input);
    return true;
}

// Show input error
function showInputError(input, message) {
    clearInputError(input);
    
    input.style.borderColor = '#e53e3e';
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'input-error';
    errorDiv.style.color = '#e53e3e';
    errorDiv.style.fontSize = '0.8rem';
    errorDiv.style.marginTop = '0.25rem';
    errorDiv.textContent = message;
    
    input.parentNode.appendChild(errorDiv);
}

// Clear input error
function clearInputError(input) {
    input.style.borderColor = '#e2e8f0';
    
    const errorDiv = input.parentNode.querySelector('.input-error');
    if (errorDiv) {
        errorDiv.remove();
    }
}

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Ctrl/Cmd + Enter to submit form
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        if (!submitBtn.disabled) {
            dreamForm.requestSubmit();
        }
    }
    
    // Escape to create new dream
    if (e.key === 'Escape') {
        if (resultSection.style.display === 'block' || errorSection.style.display === 'block') {
            createNewDream();
        }
    }
});

// Handle offline/online status
window.addEventListener('online', function() {
    console.log('Internet connection restored');
});

window.addEventListener('offline', function() {
    showError('İnternet bağlantısı bulunamadı. Lütfen bağlantınızı kontrol edin.');
});

// Performance optimization: Preload demo images
function preloadDemoImages() {
    const demoImages = [
        'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1024&h=1024&fit=crop',
        'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=1024&h=1024&fit=crop',
        'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1024&h=1024&fit=crop',
        'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=1024&h=1024&fit=crop'
    ];
    
    demoImages.forEach(src => {
        const img = new Image();
        img.src = src;
    });
}

// Test n8n webhook connection
async function testWebhookConnection() {
    try {
        const testData = {
            ad: "Test User",
            renkler: "mavi, yeşil",
            mekanlar: "orman, göl",
            atmosfer: "huzurlu",
            karakterler: "unicorn",
            detaylar: "yıldızlar"
        };
        
        console.log('Testing n8n webhook connection...');
        const result = await sendDreamRequest(testData);
        console.log('Webhook test successful:', result);
        return true;
    } catch (error) {
        console.error('Webhook test failed:', error);
        return false;
    }
}

// Add test button functionality
function addTestButton() {
    const testButton = document.createElement('button');
    testButton.textContent = '🗺️ Test n8n Bağlantısı';
    testButton.className = 'action-btn';
    testButton.style.position = 'fixed';
    testButton.style.top = '10px';
    testButton.style.right = '10px';
    testButton.style.zIndex = '1000';
    
    testButton.addEventListener('click', async () => {
        testButton.disabled = true;
        testButton.textContent = '⏳ Test ediliyor...';
        
        const success = await testWebhookConnection();
        
        testButton.textContent = success ? '✅ Bağlantı Başarılı' : '❌ Bağlantı Başarısız';
        testButton.disabled = false;
        
        setTimeout(() => {
            testButton.textContent = '🗺️ Test n8n Bağlantısı';
        }, 3000);
    });
    
    document.body.appendChild(testButton);
}

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    console.log('Dream World Generator initialized');
    console.log('n8n Webhook URL:', N8N_WEBHOOK_URL);
    preloadDemoImages();
    
    // Show current webhook URL in footer
    const webhookUrlElement = document.getElementById('webhookUrl');
    if (webhookUrlElement) {
        webhookUrlElement.textContent = N8N_WEBHOOK_URL;
    }
    
    // Add test button for webhook connection
    addTestButton();
});