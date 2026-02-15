
const mineflayer = require('mineflayer')
const readline = require('readline')

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

function startBot() {
  const bot = mineflayer.createBot({
    host: 'zurnacraft.net',
    username: 'swordht32',
    version: false
  })

  bot.once('spawn', async () => {
    console.log('Sunucuya girildi.')
    await sleep(3000)

    bot.chat('/login benbitben')
    console.log('Login atıldı')
    await sleep(3000)

    // 5. slot
    bot.setQuickBarSlot(4)
    console.log('5. slot seçildi.')
    await sleep(3000)

    bot.activateItem()
    bot.swingArm('right')
    console.log('5. slota sağ + sol tık atıldı.')
    await sleep(3000)

    // 24. slot
    try {
      bot.clickWindow(23, 0, 0)
      console.log('24. slota tıklandı.')
    } catch (e) {
      console.log('Pencere yokken tıklama denendi:', e.message)
    }
    await sleep(5000)

    // /afk
    bot.chat("/afk")
    console.log('/afk yazıldı')

    console.log('Konsoldan yaz → oyuna gider 👇')
  })

  rl.removeAllListeners('line')
  rl.on('line', (line) => {
    if (!line) return
    bot.chat(line)
    console.log('[SEN -> OYUN]:', line)
  })

  bot.on('chat', (username, message) => {
    console.log(`[CHAT] ${username}: ${message}`)
  })

  bot.on('message', (jsonMsg) => {
    console.log('[MSG]', jsonMsg.toString())
  })

  bot.on('error', err => {
    console.log('Hata:', err.message)
  })

  bot.on('kicked', reason => {
    console.log('Kick yedi. Sebep:', reason)
  })

  bot.on('end', async (reason) => {
    console.log('Bağlantı kesildi:', reason || 'bilinmiyor')
    console.log('3 saniye sonra yeniden bağlanıyor...')
    await sleep(3000)
    startBot()
  })
}

startBot()
