import {
  createStore
} from 'redux'
import Immutable from 'immutable'
import TelegramBot from 'node-telegram-bot-api'
import Debug from 'debug'

import Reducer, {defaultState} from './Reducer'
import Activity from './Activity'
import History from './History'
import CacheHandler from './CacheHandler'

const debug = Debug('tgux:subscriber')

export default class extends TelegramBot {

  constructor(token, options = {}) {
    super(token, options)

    this.cache = new CacheHandler

    this.stores = {}
    this.activities = {}

    this.on('message', async(message) => {

      let chatId = message.chat.id
      let store = this.stores[chatId]

      if (!store) {
        let initState = await this.cache.get('State' + chatId)

        if (!initState) {
          initState = defaultState.set('message', message)
        }

        store = createStore(Reducer, initState)

        store.subscribe(function () {
          let state = store.getState().toJS()
          let {
            activity,
            action,
            message,
            params,
            reason
          } = state

          debug({
            activity,
            action,
            message: message && message.text,
            params,
            reason
          })

          if (message) {
            this.cache.set('State' + message.chat.id, state)
          }

          this.activities[activity].dispatch(action, [message, new History(store, reason, params)])

        }.bind(this))

        this.stores[chatId] = store
      }

      if (message.text == '/start') {
        return store.dispatch({
          type: 'REST',
          payload: {
            message
          }
        })
      }

      let {
        activity,
        action,
        params
      } = store.getState().toJS()

      if (action == 'home') {
        let refer = this.activities[activity].checkRedirect(message.text)
        if (refer) {
          return store.dispatch({
            type: 'FW',
            payload: {
              message,
              refer,
              params
            }
          })
        }
      }

      store.dispatch({
        type: 'RECV',
        payload: {
          message
        }
      })
    })
  }

  setCacheHandler(handler) {
    if (typeof handler == 'function') {
      handler = new handler
    }
    this.cache = handler
  }

  createActivity(name, callback) {
    this.activities[name] = new Activity(name)
    callback(this.activities[name])
  }

  forwardChatId(chatId, refer, params = {}) {
    let store = this.stores[chatId]
    if (!store) {
      return false
    }
    let {
      message
    } = store.getState().toJS()
    return store.dispatch({
      type: 'FW',
      payload: {
        message,
        refer,
        params
      }
    })
  }
}
