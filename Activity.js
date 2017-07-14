const Immutable = require('immutable')

module.exports = class Activity {
	constructor(name) {
		this.name = name
		this.actions = {}
	}

	on(action, callback) {
		this.actions[action] = callback
	}

	checkRedirect(text) {
		let action = this.actions[text]
		return action && Array.isArray(action) && action
	}

	dispatch(action, args) {
		this.actions[action].apply(this, args)
	}

	get keyboards() {
		let actions = Immutable.Map(this.actions)
		let keyboards = []
		actions.forEach((value, key) => {
			if (Array.isArray(value)) {
				keyboards.push(key)
			}
		})
		if (!keyboards.length) {
			return false
		}
		return [keyboards]
	}
}
