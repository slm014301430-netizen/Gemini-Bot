const mineflayer = require('mineflayer')
const express = require('express')
const app = express()

// --- WEB SERVER FOR RENDER ---
const PORT = process.env.PORT || 3000
app.get('/', (req, res) => res.send('Bot is running!'))
app.listen(PORT, () => console.log(`Web server listening on port ${PORT}`))

// --- BOT CONFIGURATION ---
const botOptions = {
  host: 'Kudo_1316.aternos.me',
  port: 42916,
  username: 'KudoBot_AFK',
  version: '1.21.1'
}

let bot
let moveInterval

function createBot() {
  bot = mineflayer.createBot(botOptions)

  bot.on('login', () => {
    console.log('Bot has logged in!')
    bot.chat('I am connected and ready to AFK!')
    startAntiAfk()
  })

  // --- RESOURCE PACK HANDLER ---
  // This part is vital if "Require Resource Pack" is ON in Aternos
  bot.on('resourcePack', (url, hash) => {
    console.log('Server requested resource pack. Accepting...')
    bot.acceptResourcePack()
  })

  bot.on('end', (reason) => {
    console.log(`Bot disconnected: ${reason}`)
    clearInterval(moveInterval)
    console.log('Reconnecting in 30 seconds...')
    setTimeout(createBot, 30000)
  })

  bot.on('error', (err) => console.log(`Error: ${err.message}`))
  bot.on('kicked', (reason) => console.log(`Kicked for: ${reason}`))
}

function startAntiAfk() {
  if (moveInterval) clearInterval(moveInterval)

  moveInterval = setInterval(() => {
    if (!bot || !bot.entity) return

    try {
      // Randomly look around
      const randomYaw = Math.floor(Math.random() * Math.PI * 2)
      const randomPitch = (Math.floor(Math.random() * 200) - 100) / 100 
      bot.look(randomYaw, randomPitch)
      
      // Short step forward or back
      const dir = Math.random() > 0.5 ? 'forward' : 'back'
      bot.setControlState(dir, true)
      setTimeout(() => {
        if (bot && bot.setControlState) bot.setControlState(dir, false)
      }, 500)
      
    } catch (err) {
      console.log('AFK Movement skipped (lag):', err.message)
    }
  }, 10000) // Runs every 10 seconds
}

// Global safety nets
process.on('uncaughtException', (err) => console.log('Caught exception: ', err))
process.on('unhandledRejection', (reason) => console.log('Unhandled Rejection: ', reason))

createBot()
