'use strict'

const assert = require('assert')
const should = require('should')

const Immutable = require('immutable')
const Reducer = require('../src/Reducer').default
const defaultState = require('../src/DefaultState').defaultState

describe('Reducer', function() {

  it('should return the initial state', () => {
    Reducer(defaultState, {}).toJS().should.be.deepEqual(defaultState.toJS())
  })

  it('should start activity', () => {
  })
})
