# tgux
make own telegram bot based on Redux


[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://raw.githubusercontent.com/esmaeilpour/tgux/master/LICENSE)

## Changelog

- 0.1.0 createActivity

## Documentation

Comming soon...


## Here's an example:

```javascript

var Bot = require('tgux');

var bot = new Bot({
  token: 'TOKEN HERE'
})

bot.createActivity('start', (activity) => {
  activity.on('home', (msg) => {
    const opts = {
      reply_markup: JSON.stringify({
        keyboard: activity.keyboards,
        resize_keyboard: true,
      })
    }
    bot.sendMessage(msg.chat.id, 'hello', opts)
  })

  activity.on('Help', ['help', 'home'])
})

bot.createActivity('help', (activity) => {
  activity.on('home', (msg, history) => {
    const opts = {
      reply_markup: JSON.stringify({
        keyboard: activity.keyboards,
        resize_keyboard: true,
      })
    }
    bot.sendMessage(msg.chat.id, 'help', opts)
  })

  activity.on('back', ['start', 'home'])
})

```
