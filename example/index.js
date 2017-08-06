const Bot = require('../')

const bot = new Bot(process.env.TOKEN, {polling: true})

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
