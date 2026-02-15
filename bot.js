const mineflayer = require('mineflayer');
const fs = require('fs');
const path = require('path');

// Webhook URL'ini buraya ekle
const WEBHOOK_URL = 'https://discord.com/api/webhooks/1472512420596682868/VroXQPP1o6aXYevIiYFc25jmjVxPYNEyQR40B269IJDvMQY6OM3XdPfoEVphZu--bMrO'; // Discord webhook URL'ini buraya yapıştır

// Chat loglarını kaydetmek için dosya
const logFile = path.join(__dirname, 'chat_logs.txt');

// Bot yapılandırması
const bot = mineflayer.createBot({
  host: 'zurnacraft.net', // Sunucu adresini buraya yaz
  port: 25565, // Port numarası (varsayılan 25565)
  username: 'swordht3',
  version: '1.21', // Sürümü sunucuya göre ayarla (1.21.8 yerine 1.21 kullan)
  auth: 'offline' // Cracked sunucu için
});

// Discord webhook'a mesaj gönderme fonksiyonu
async function sendToWebhook(message) {
  if (WEBHOOK_URL === 'WEBHOOK_URL_BURAYA') return;
  
  try {
    const https = require('https');
    const url = require('url');
    const webhookUrl = new URL(WEBHOOK_URL);
    
    const data = JSON.stringify({
      content: message,
      username: 'Minecraft Bot Logger'
    });
    
    const options = {
      hostname: webhookUrl.hostname,
      path: webhookUrl.pathname + webhookUrl.search,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
      }
    };
    
    const req = https.request(options, (res) => {});
    req.on('error', (error) => {
      console.error('Webhook hatası:', error);
    });
    req.write(data);
    req.end();
  } catch (error) {
    console.error('Webhook gönderim hatası:', error);
  }
}

// Chat loglarını kaydet
function logChat(message) {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] ${message}\n`;
  
  fs.appendFileSync(logFile, logMessage);
  console.log(logMessage.trim());
  
  // Webhook'a da gönder
  sendToWebhook(`[${timestamp}] ${message}`);
}

// Bot spawn olduğunda
bot.once('spawn', () => {
  console.log('Bot sunucuya bağlandı!');
  logChat('Bot sunucuya bağlandı');
  
  // 3 saniye bekle ve login yap
  setTimeout(() => {
    bot.chat('/login benbitben');
    console.log('Login komutu gönderildi');
    logChat('Login komutu gönderildi: /login benbitben');
    
    // 3 saniye sonra envanter işlemlerini yap
    setTimeout(async () => {
      try {
        // 5. slotu seç (index 4, çünkü 0'dan başlar)
        bot.setQuickBarSlot(4);
        console.log('5. slot seçildi');
        logChat('Envanter 5. slot seçildi');
        
        // 3 saniye bekle
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        // Sağ tık (eşyayı kullan)
        bot.activateItem();
        console.log('Sağ tık yapıldı');
        logChat('5. slottaki eşya kullanıldı (sağ tık)');
        
        // 3 saniye bekle menünün açılması için
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        // Açılan pencerede 24. slota tıkla
        const window = bot.currentWindow;
        if (window) {
          // Slot 24'e tıkla (index 23)
          await bot.clickWindow(23, 0, 0);
          console.log('24. slot tıklandı');
          logChat('Açılan pencerede 24. slot tıklandı');
          
          // 3 saniye bekle
          await new Promise(resolve => setTimeout(resolve, 3000));
          
          // Pencereyi kapat
          bot.closeWindow(window);
        }
        
        // 3 saniye sonra AFK yap
        setTimeout(() => {
          bot.chat('/afk');
          console.log('AFK komutu gönderildi');
          logChat('AFK komutu gönderildi: /afk');
        }, 3000);
        
      } catch (error) {
        console.error('Envanter işlemi hatası:', error);
        logChat(`HATA: Envanter işlemi - ${error.message}`);
      }
    }, 3000);
    
  }, 3000);
});

// Chat mesajlarını dinle ve kaydet
bot.on('message', (message) => {
  const chatMessage = message.toString();
  logChat(`CHAT: ${chatMessage}`);
});

// Whisper mesajlarını dinle
bot.on('whisper', (username, message) => {
  logChat(`WHISPER [${username}]: ${message}`);
});

// Kick edilirse
bot.on('kicked', (reason) => {
  console.log('Bot kicklendi:', reason);
  logChat(`Bot sunucudan kicklendi: ${reason}`);
});

// Hata durumunda
bot.on('error', (err) => {
  console.error('Bot hatası:', err);
  logChat(`HATA: ${err.message}`);
});

// Bağlantı sonlandığında
bot.on('end', () => {
  console.log('Bot bağlantısı kesildi');
  logChat('Bot bağlantısı sonlandı');
});

console.log('Bot başlatılıyor...');
logChat('Bot başlatılıyor...');
