const debugSet = require('debug')('tgux:cacheWrite')
const debugGet = require('debug')('tgux:cacheRead')

module.exports = class CacheHandler {
    constructor() {
        this.data = {}
    }

    set(key, value) {
        debugSet(key, value)
        return new Promise(function(resolve) {
            this.data[key] = value
            resolve()
        }.bind(this))
    }

    get(key) {
        debugGet(key)
        return new Promise(function(resolve) {
            if (key in this.data) {
                return resolve(this.data[key])
            } else {
                return resolve(false)
            }
        }.bind(this))
    }
}
