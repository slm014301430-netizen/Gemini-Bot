const mineflayer = require('mineflayer')
const express = require('express')
const app = express()

// --- WEB SERVER FOR RENDER ---
const PORT = process.env.PORT || 3000
app.get('/', (req, res) => {
  res.send('Bot is running!')
})
app.listen(PORT, () => {
  console.log(`Web server listening on port ${PORT}`)
})

// --- BOT CONFIGURATION ---
const botOptions = {
  host: 'Kudo_1316.aternos.me',
  port: 42916,
  username: 'KudoBot_AFK',
  version: '1.21.1'
}

let bot

function createBot() {
  bot = mineflayer.createBot(botOptions)

  bot.on('login', () => {
    console.log('Bot has logged in!')
    bot.chat('I am connected and ready to AFK!')
    startAntiAfk()
  })

  bot.on('end', (reason) => {
    console.log(`Bot disconnected: ${reason}`)
    console.log('Reconnecting in 30 seconds...')
    setTimeout(createBot, 30000) // Auto-reconnect
  })

  bot.on('error', (err) => console.log(`Error: ${err.message}`))
  
  // Log chat to console so you can see server chat in Render logs
  bot.on('chat', (username, message) => {
    if (username === bot.username) return
    console.log(`${username}: ${message}`)
  })
}

// --- SOPHISTICATED ANTI-AFK ---
function startAntiAfk() {
  // Randomly look around and tap movement keys
  setInterval(() => {
    const randomYaw = Math.floor(Math.random() * Math.PI * 2)
    const randomPitch = (Math.floor(Math.random() * 200) - 100) / 100 // Slight up/down
    bot.look(randomYaw, randomPitch)
  }, 3000) // Look around every 3 seconds

  setInterval(() => {
    // Random tiny walk to prevent "idle" status
    const dir = Math.random() > 0.5 ? 'forward' : 'back'
    bot.setControlState(dir, true)
    setTimeout(() => {
      bot.setControlState(dir, false)
    }, 500) // Walk for 0.5 seconds
  }, 10000) // Every 10 seconds
}

createBot()
