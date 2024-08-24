const http = require('node:http')
const ditto = require('./pokemon/ditto.json')

const desiredPort = process.argv[2] ?? 3000

const processRequest = (req, res) => {
	const { method, url } = req

	switch (method) {
		case 'GET':
			switch (url) {
				case '/pokemon/ditto':
					res.statusCode = 200 // OK
					res.setHeader('Content-Type', 'application/json; charset=utf-8')
					res.end(JSON.stringify(ditto))
					break
				default:
					res.statusCode = 404
					res.end('<h1>404 Not Found</h1>')
					break
			}
			break
		case 'POST':
			switch (url) {
				case '/pokemon':
					let body = ''

					/// Working with chunks...
					req.on('data', (chunk) => {
						body += chunk.toString()
					})

					/// When all body loads
					req.on('end', () => {
						const data = JSON.parse(body)
						res.writeHead(201, {
							'Content-Type': 'application/json: charset=utf-8',
						})
						data.timestamp = Date.now()
						res.end(JSON.stringify(data))
					})
					break
				default:
					break
			}
	}
}

const server = http.createServer(processRequest)

server.listen(desiredPort, () => {
	console.log(`Server listening on port http://localhost:${desiredPort}`)
})
