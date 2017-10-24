import Debug from 'debug'

const debug = Debug('tgux:cache')

export default class {
  constructor() {
    this.data = {}
  }

  set(key, value) {
    debug('Write', key, value)
    return new Promise(function (resolve) {
      this.data[key] = value
      resolve()
    }.bind(this))
  }

  get(key) {
    debug('Read', key)
    return new Promise(function (resolve) {
      if (key in this.data) {
        return resolve(this.data[key])
      } else {
        return resolve(false)
      }
    }.bind(this))
  }
}
