const Immutable = require('immutable')
const debug = require('debug')('tgux:history')

module.exports = class History {
    constructor(store, reason = 'normal', params = {}) {
        this.store = store
        this.reason = reason
        this.params = params
    }

    forward(refer, params) {
        debug('Forward', refer)
        let {message} = this.store.getState().toJS()
        this.store.dispatch({type: 'FW', payload: {message, refer, params}})
    }

    back() {
        debug('Back')
        this.store.dispatch({type: 'BACK'})
    }
}
