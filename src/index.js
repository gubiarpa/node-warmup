const express = require('express')
const app = express()

const ditto = require('./pokemon/ditto.json')

app.disable('x-powered-by')

const PORT = process.env.PORT ?? 3000

app.use((req, _, next) => {
	if (req.method !== 'POST') return next()
	if (req.headers['content-type'] !== 'application/json') return next()

	let body = ''

	req.on('data', (chunk) => {
		body += chunk.toString()
	})

	req.on('end', () => {
		const data = JSON.parse(body)
		data.timestamp = Date.now()

		// Vamos a mutar la request antes de que se procese
		req.body = data

		next()
	})
})

app.get('/', (_, res) => {
	res.json({ message: 'Habla gente' })
})

app.get('/pokemon/ditto', (_, res) => {
	res.json(ditto)
})

app.post('/pokemon', (req, res) => {
	res.status(201).json(req.body)
})

app.use((req, res) => {
	res.status(404).send('<h1>404 - Not Found</h1>')
})

app.listen(PORT, () => {
	console.log(`Server running on http://localhost:${PORT}`)
})
