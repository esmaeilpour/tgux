'use strict'

const assert = require('assert')
const should = require('should')

const Immutable = require('immutable')
const {reducer, defaultState} = require('../Reducer')

describe('Reducer', function() {

  it('should return the initial state', () => {
    reducer(defaultState, {}).toJS().should.be.deepEqual(defaultState.toJS())
  })

  it('should start activity', () => {
  })
})
