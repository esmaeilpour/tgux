const Immutable = require('immutable')
const debug = require('debug')('tgux:reducer')

const defaultState = Immutable.fromJS({
    activity: 'start',
    action: 'home',
    message: undefined,
    params: {},
    reason: 'normal',
    referer: {},
})

const reducer = function(state, {type, payload = {}}) {
    debug(type, payload, state)

    switch(type) {
        case 'RECV': {
            let {message} = payload
            return state
                .merge({message, reason: 'normal'})
        }
        case 'BACK': {
            let referer = state.get('referer')
            return state
                .merge(referer)
                .merge({reason: 'back', referer: {}})
        }
        case 'FW': {
            let {message, refer, params} = payload
            let [activity, action] = refer
            let newState = state
                .merge({message, params, reason: 'forward'})
                .update('referer', () => {
                    if (activity == 'start' && action == 'home') {
                        return {}
                    }
                    return {
                        activity: state.get('activity'),
                        action: state.get('action'),
                    }
                })

            if (!action) {
                return newState.merge({action: activity})
            } else {
                return newState.merge({activity, action})
            }
        }

        case 'REST':{
            let {message} = payload
            return defaultState.merge({message})
        }
        default: {
            return state
        }
    }
}

module.exports = {
    reducer,
    defaultState,
}