import Immutable from 'immutable'

export const defaultState = Immutable.fromJS({
  activity: 'start',
  action: 'home',
  message: undefined,
  params: {},
  reason: 'normal',
  referer: {},
})
