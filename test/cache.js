'use strict'

const assert = require('assert')
const should = require('should')

const CacheHandler = require('../src/CacheHandler').default

describe('Cache', function() {
  let handler = new CacheHandler()

  before(done => {
    handler.set('foo', 'bar').then(done)
  })

  it('should work set and get', function() {
    return handler.get('foo').should.eventually.equal('bar')
  })
})
