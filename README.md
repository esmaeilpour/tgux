# tgux

[![Build Status](https://travis-ci.org/esmaeilpour/tgux.png)](https://travis-ci.org/esmaeilpour/tgux)
[![npm version](https://img.shields.io/npm/v/tgux.svg?style=flat-square)](https://www.npmjs.com/package/tgux)
[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://raw.githubusercontent.com/esmaeilpour/tgux/master/LICENSE)

Make own stateful telegram bot based on [Redux](https://github.com/reactjs/redux). Works on top of [node-telegram-bot-api](https://github.com/yagop/node-telegram-bot-api)

Main features:
  - stateful bot
  - activities
  - history (back/forward/params)
  - storage support
  - form implementation

## Install

```bash
npm install --save tgux
```

## Demo
![](https://rawgit.com/esmaeilpour/tgux/master/intro.gif)
* [More Examples][examples]

## Usage

```js
import Tgux from 'tgux'

var bot = new Bot('TOKEN HERE', {polling: true})

bot.createActivity('start', (activity) => {
  activity.on('home', (msg) => {
    const opts = {
      reply_markup: {
        keyboard: activity.keyboards,
        resize_keyboard: true,
      }
    }
    bot.sendMessage(msg.chat.id, `hello ${msg.from.first_name}`, opts)
  })

  activity.on('Help', ['help', 'home'])
})

bot.createActivity('help', (activity) => {
  activity.on('home', (msg, history) => {
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

```

## Custom Cache Handler

```js
var co = require('co');
var redisClient = require('redis').createClient();
var wrapper = require('co-redis');
var redisCo = wrapper(redisClient);

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
```

## License

**The MIT License (MIT)**

Copyright (c) 2017 Esmaeilpour

[examples]:https://github.com/esmaeilpour/tgux/tree/master/examples