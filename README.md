# tgux
make own telegram bot based on Redux

[![npm version](https://img.shields.io/npm/v/tgux.svg?style=flat-square)](https://www.npmjs.com/package/tgux)
[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://raw.githubusercontent.com/esmaeilpour/tgux/master/LICENSE)

![](https://rawgit.com/esmaeilpour/tgux/master/intro.gif)

## Changelog

- 0.1.0 createActivity

## Documentation

Coming soon...


## Here's an example:

```javascript

var Bot = require('tgux');

var bot = new Bot('TOKEN HERE', {polling: true})

bot.createActivity('start', (activity) => {
  activity.on('home', (msg) => {
    const opts = {
      reply_markup: JSON.stringify({
        keyboard: activity.keyboards,
        resize_keyboard: true,
      })
    }
    bot.sendMessage(msg.chat.id, `hello ${msg.from.first_name}`, opts)
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
