const mineflayer = require('mineflayer')
const express = require('express')
const app = express()

// --- WEB SERVER FOR RENDER ---
const PORT = process.env.PORT || 3000
app.get('/', (req, res) => res.send('Player is running...'))
app.listen(PORT, () => console.log(`Web server listening on port ${PORT}`))

// --- BOT CONFIGURATION ---
const botOptions = {
  host: 'Kudo_1316.aternos.me',
  port: 42916,
  username: 'ItzKudo', // New human-like name
  version: '1.21.1'
}

let bot

function createBot() {
  bot = mineflayer.createBot(botOptions)

  bot.on('login', () => {
    console.log('Player has logged in!')
    bot.chat('Hello! I am ready to play.')
    
    // Start the "Human" behavior loop
    startHumanBehavior()
  })

  // Accept the server resource pack automatically
  bot.on('resourcePack', (url, hash) => {
    console.log('Accepting resource pack...')
    bot.acceptResourcePack()
  })

  // Log errors and kicks
  bot.on('error', (err) => console.log(`Error: ${err.message}`))
  bot.on('kicked', (reason) => console.log(`Kicked: ${reason}`))

  bot.on('end', (reason) => {
    console.log(`Disconnected: ${reason}`)
    
    // If banned, wait longer (2 minutes) before trying again
    const timeout = reason.toString().includes('banned') ? 120000 : 30000
    
    console.log(`Reconnecting in ${timeout / 1000} seconds...`)
    setTimeout(createBot, timeout)
  })
}

// --- NEW "HUMAN" BEHAVIOR ---
function startHumanBehavior() {
  // Action 1: Look around randomly every 3-6 seconds
  setInterval(() => {
    if (!bot || !bot.entity) return
    const yaw = Math.random() * Math.PI - (0.5 * Math.PI)
    const pitch = Math.random() * Math.PI - (0.5 * Math.PI)
    bot.look(yaw, pitch)
  }, 4000)

  // Action 2: Swing arm (punch) every few seconds
  setInterval(() => {
    if (!bot || !bot.entity) return
    bot.swingArm('right')
  }, 3500)

  // Action 3: Jump and Walk occasionally (Every 12 seconds)
  setInterval(() => {
    if (!bot || !bot.entity) return
    
    // 60% chance to jump
    if (Math.random() > 0.4) {
      bot.setControlState('jump', true)
      bot.setControlState('forward', true)
      
      // Stop jumping/walking after a short burst
      setTimeout(() => {
        if(bot) {
            bot.setControlState('jump', false)
            bot.setControlState('forward', false)
        }
      }, 600)
    }
  }, 12000)
}

// Handle unexpected crashes
process.on('uncaughtException', (err) => console.log('Caught exception: ', err))
process.on('unhandledRejection', (reason) => console.log('Unhandled Rejection: ', reason))

createBot()
