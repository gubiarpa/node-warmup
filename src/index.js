/// Dependencies
const crypto = require('node:crypto')

const express = require('express')

const movies = require('./mock/movies.json')
const { validateMovie } = require('./schemas/movies.schema')

/// Implementation
const app = express()

const PORT = process.env.PORT ?? 2907

app.disable('x-powered-by')
app.use(express.json())

app.get('/', (_, res) => {
	res.json({ message: 'Hola gentita' })
})

app.get('/movies', (req, res) => {
	const { genre } = req.query
	const moviesWithLowerFields = movies.map(({ genre, ..._ }) => {
		return {
			..._,
			genre: genre.map((x) => x.toLocaleLowerCase()),
		}
	})
	if (genre) {
		const lowerGenre = genre.toLocaleLowerCase()
		const filteredMovies = moviesWithLowerFields.filter((x) =>
			x.genre.includes(lowerGenre)
		)
		return res.json(filteredMovies)
	}
	res.json(moviesWithLowerFields)
})

app.get('/movies/:id', (req, res) => {
	console.log(req.params)
	const { id } = req.params
	const movie = movies.find((x) => x.id === id)
	if (movie) return res.json(movie)
	res.status(404).json({ message: 'Not found' })
})

app.post('/movies', (req, res) => {
	const result = validateMovie(req.body)

	if (result.error)
		return res.status(422).json({ error: JSON.parse(result.error.message) })

	const newMovie = {
		id: crypto.randomUUID(),
		...result.data,
	}
	movies.push(newMovie)
	res.status(201).json(newMovie)
})

app.use((_, res) => {
	res.status(404).send('<h1>404 - Not Found</h1>')
})

app.listen(PORT, () => {
	console.log(`Server running on http://localhost:${PORT}`)
})
