const co = require('co')
const Redux = require('redux')
const Immutable = require('immutable')
const Tg = require('node-telegram-bot-api')
const debug = require('debug')('tgux:subscribe')

const Reducer = require('./Reducer')
const Activity = require('./Activity')
const History = require('./History')
const CacheHandler = require('./CacheHandler')
const defaultState = require('./DefaultState')

module.exports = class Tgux extends Tg {

    constructor(token, options = {}) {
        super(token, options)

        this.cache = new CacheHandler

        this.stores = {}
        this.activities = {}

        this.on('message', co.wrap(function*(message) {

            let chatId = message.chat.id
            let store = this.stores[chatId]

            if (!store) {
                let initState = yield this.cache.get('State' + chatId)

                if (!initState) {
                    initState = defaultState.set('message', message)
                }

                store = Redux.createStore(Reducer, initState)

                store.subscribe(function() {
                    let state = store.getState().toJS()
                    let {activity, action, message, params, reason} = state

                    debug({activity, action, message: message && message.text, params, reason})

                    if (message) {
                        this.cache.set('State' + message.chat.id, state)
                    }

                    this.activities[activity].dispatch(action, [message, new History(store, reason, params)])

                }.bind(this))

                this.stores[chatId] = store
            }

            if (message.text == '/start') {
                return store.dispatch({type: 'REST', payload: {message}})
            }

            let {activity, action, params} = store.getState().toJS()

            if (action == 'home') {
                let refer = this.activities[activity].checkRedirect(message.text)
                if (refer) {
                    return store.dispatch({type: 'FW', payload: {message, refer, params}})
                }
            }

            store.dispatch({type: 'RECV', payload: {message}})
        }))
    }

    setCacheHandler(handler) {
        this.cache = new handler
    }

    createActivity(name, callback) {
        this.activities[name] = new Activity(name)
        callback(this.activities[name])
    }
}
