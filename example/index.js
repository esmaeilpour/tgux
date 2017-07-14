const Tgux = require('../')
const TOKEN = ''
const bot = new Tgux(TOKEN, {polling: true})

bot.createActivity('start', (activity) => {

	activity.on('home', (msg) => {
		console.log('> start > home', msg.text)

		const opts = {
			reply_markup: JSON.stringify({
				keyboard: activity.keyboards,
				resize_keyboard: true,
				one_time_keyboard: true
			})
		}
		bot.sendMessage(msg.chat.id, 'hello', opts)
	})

	activity.on('1️⃣ Help', ['help', 'home'])

	activity.on('0️⃣ Price', ['price', 'home'])

	activity.on('📋 Form', ['form', 'home'])

})

bot.createActivity('help', (activity) => {

	activity.on('home', (msg, history) => {
		console.log('> help > home', msg.text)

		const opts = {
			reply_markup: JSON.stringify({
				keyboard: activity.keyboards,
				resize_keyboard: true,
			})
		}
		bot.sendMessage(msg.chat.id, 'help', opts)

		history.forward(['price', 'home'])
	})

	activity.on('back', ['start', 'home'])
})


bot.createActivity('price', (activity) => {

	activity.on('home', (msg, history) => {
		console.log('> price > home', msg.text)

		const opts = {
			reply_markup: JSON.stringify({
				keyboard: activity.keyboards,
				resize_keyboard: true,
			})
		}
		bot.sendMessage(msg.chat.id, 'price', opts)
	})

	activity.on('back', ['start', 'home'])

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

		
		bot.sendMessage(msg.chat.id, `register success\n${params.name}\n${params.city}\n${params.phone}`)

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
			return bot.sendMessage(msg.chat.id, 'name?', opts)
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
			return bot.sendMessage(msg.chat.id, 'city?', opts)
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
			return bot.sendMessage(msg.chat.id, 'phone?', opts)
		}

		return history.forward(['form', 'home'], Object.assign(params, {phone: msg.text}))
	})

	activity.on('back', ['getCity', 'home'])
})