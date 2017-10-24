const Bot = require('../').default

const bot = new Bot(process.env.TOKEN, {polling: true})

bot.createActivity('start', (activity) => {

	activity.on('home', (msg, history) => {
		console.log('> start > home', msg.text)

		history.forward(['form', 'home'])
	})
})

bot.createActivity('form', activity => {
	activity.on('home', (msg, history) => {
		let params = history.params

		if (!params.name) {
			return history.forward(['getName', 'home'], params)
		}

		if (!params.city) {
			return history.forward(['getCity', 'home'], params)
		}

		if (!params.phone) {
			return history.forward(['getPhone', 'home'], params)
		}
		
		bot.sendMessage(msg.chat.id, `Name: ${params.name}\nCity: ${params.city}\nPhone: ${params.phone}`)

		history.forward(['start', 'home'])
	})
})

bot.createActivity('getName', activity => {

	activity.on('home', (msg, history) => {
		let params = history.params

		if (history.reason == 'forward') {
			const opts = {
				reply_markup: JSON.stringify({
					keyboard: [
						[{ text: "Send Contact", request_contact: true }],
						['back']
					],
					resize_keyboard: true,
				})
			}
			return bot.sendMessage(msg.chat.id, `What's your name?`, opts)
		}

		let name
		let phone

		if (msg.contact) {
			name = msg.contact.first_name
			phone = msg.contact.phone_number
		} else if(msg.text) {
			name = msg.text
		} else {
			return history.forward(['home'])
		}

		return history.forward(['form', 'home'], {name, phone})
	})

	activity.on('back', ['start', 'home'])
})

bot.createActivity('getCity', activity => {

	activity.on('home', (msg, history) => {
		let params = history.params

		if (history.reason == 'forward') {
			const opts = {
				reply_markup: JSON.stringify({
					keyboard: activity.keyboards,
					resize_keyboard: true,
				})
			}
			return bot.sendMessage(msg.chat.id, `Where are you from?`, opts)
		}

		return history.forward(['form', 'home'], Object.assign(params, {city: msg.text}))
	})

	activity.on('back', ['getName', 'home'])
})

bot.createActivity('getPhone', activity => {

	activity.on('home', (msg, history) => {
		let params = history.params

		if (history.reason == 'forward') {
			const opts = {
				reply_markup: JSON.stringify({
					keyboard: activity.keyboards,
					resize_keyboard: true,
				})
			}
			return bot.sendMessage(msg.chat.id, `What's your phone number?`, opts)
		}

		return history.forward(['form', 'home'], Object.assign(params, {phone: msg.text}))
	})

	activity.on('back', ['getCity', 'home'])
})