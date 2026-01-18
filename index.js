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
let moveInterval // Variable to store the timer so we can stop it later

function createBot() {
  bot = mineflayer.createBot(botOptions)

  bot.on('login', () => {
    console.log('Bot has logged in!')
    bot.chat('I am connected and ready to AFK!')
    startAntiAfk()
  })

  bot.on('end', (reason) => {
    console.log(`Bot disconnected: ${reason}`)
    // STOP the AFK loop so it doesn't crash the code
    clearInterval(moveInterval)
    
    console.log('Reconnecting in 30 seconds...')
    setTimeout(createBot, 30000)
  })

  bot.on('error', (err) => console.log(`Error: ${err.message}`))
  
  // Prevent crash on kick
  bot.on('kicked', console.log)
}

function startAntiAfk() {
  // Clear any existing interval just in case
  if (moveInterval) clearInterval(moveInterval)

  moveInterval = setInterval(() => {
    // Safety check: Only move if bot exists and has a body
    if (!bot || !bot.entity) return

    try {
      const randomYaw = Math.floor(Math.random() * Math.PI * 2)
      const randomPitch = (Math.floor(Math.random() * 200) - 100) / 100 
      bot.look(randomYaw, randomPitch)
      
      const dir = Math.random() > 0.5 ? 'forward' : 'back'
      bot.setControlState(dir, true)
      setTimeout(() => bot?.setControlState(dir, false), 500)
      
    } catch (err) {
      console.log('Movement error (ignoring):', err.message)
    }
  }, 5000) 
}

// Global error handlers to prevent "Exit Status 1"
process.on('uncaughtException', (err) => console.log('Caught exception: ', err))
process.on('unhandledRejection', (reason) => console.log('Unhandled Rejection: ', reason))

createBot()
