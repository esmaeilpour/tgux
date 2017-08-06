const Bot = require('..')
const co = require('co')
const redisClient = require('redis').createClient()
const wrapper = require('co-redis')
const redisCo = wrapper(redisClient)

const bot = new Bot(process.env.TOKEN, {polling: true})

const CacheHandler = class {
  set(key, value) {
    return redisCo.set(key, JSON.stringify(value))
  }

  *get(key) {
    let value = yield redisCo.get(key)
    if (!value) {
      return false
    }
    return JSON.parse(value)
  }
}

bot.setCacheHandler(CacheHandler)

bot.createActivity('start', (activity) => {

  activity.on('home', (msg) => {
    console.log('> start > home', msg.text)

    const opts = {
      reply_markup: {
        keyboard: activity.keyboards,
        resize_keyboard: true,
        one_time_keyboard: true
      }
    }
    bot.sendMessage(msg.chat.id, 'hello', opts)
  })

  activity.on('1️⃣ Help', ['help', 'home'])
})

bot.createActivity('help', (activity) => {

  activity.on('home', (msg, history) => {
    console.log('> help > home', msg.text)

    const opts = {
      reply_markup: {
        keyboard: activity.keyboards,
        resize_keyboard: true,
      }
    }
    bot.sendMessage(msg.chat.id, 'help', opts)

  })

  activity.on('back', ['start', 'home'])
})