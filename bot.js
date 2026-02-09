const mineflayer = require('mineflayer')

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms))
}

function oncePromise(emitter, event) {
  return new Promise(resolve => emitter.once(event, resolve))
}

async function runSetup(bot) {
  console.log('Setup başlıyor...')
  await sleep(5000) // sunucu tam yüklenmeden abanmayalım

  bot.chat('/login benbitben')
  await sleep(4000)

  bot.setQuickBarSlot(4)
  await sleep(3000)

  bot.activateItem()

  console.log('Menü bekleniyor...')
  try {
    await oncePromise(bot, 'windowOpen')
    await sleep(1000)
    bot.clickWindow(23, 0, 0)
  } catch {}

  await sleep(4000)
  bot.chat('/afk')
}

async function startBot() {
  console.log('Bot başlatılıyor...')

  const bot = mineflayer.createBot({
    host: 'zurnacraft.net',
    username: 'swordht32',
    version: false,
    keepAlive: true
  })

  bot.once('spawn', async () => {
    console.log('Spawn oldu.')
    try {
      await runSetup(bot)
    } catch (e) {
      console.log('Setup hata:', e.message)
    }
  })

  bot.on('kicked', r => console.log('Kick:', r))
  bot.on('error', e => console.log('Error:', e.message))

  bot.on('end', async (reason) => {
    console.log('Bağlantı kesildi:', reason)
    console.log('5 saniye sonra tekrar bağlanıyor...')
    await sleep(5000)
    startBot()
  })
}

startBot()
