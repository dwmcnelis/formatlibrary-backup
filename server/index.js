
const config = require('../config')
const fs = require('fs')
const { resolve } = require('path')
const http = require('http')
const https = require('https')
const path = require('path')
const express = require('express')
const expressLayouts = require('express-ejs-layouts')
const morgan = require('morgan')
const compression = require('compression')
const session = require('cookie-session')
const db = require('./db')
const api = require('./api')
const authX = require('./authX')
const { auth } = require('./routes')
const PORT = config.server.port
const app = express()
module.exports = app
let httpServer
let httpsServer

const createApp = () => {
	console.log('creating App...')
	// logging middleware
	app.use(morgan('dev'))

	// body parsing middleware
	app.use(express.json({ limit: '1mb' }))
	app.use(express.urlencoded({ extended: true, limit: '1mb' }))

	// compression middleware
	app.use(compression())

	// session
	app.use(
		session({
			name: 'session',
			keys: [
				'PP5a_iRGac8uIAmAPPkzohSo7bB_zeYA8-aws8StHRjgpx9A9iU_E73nTfTxqg4y5MTFGcib5T35593QuH_rW9AoBQFv_joIz5fEdIJbebKKxkxB63mo2oxz5_qoNLcNFmqlbEdN2s8FRuSp4opf3I8YRSvWhJdbrz7RyeRCAHQ',
				'p8mGwge6s62W_e16ZHpp9u-GJOm_9BQZEvNo1L6L6hyjqfk9R7Xy1OkHapBEh-PdiFQdL1VtXWzBrml6BOqzpQV1CwdzYtB-8WFFiz29LvNdEhJHIR1ImqRQxkdeeljzBlBqXslZYfpEc0A6qj5zBh_3ndSzYpsXGGjWgN6pqsc',
				'AkbhrDysvMuJsHu4dCl2qqwrDe2hVlWXQBJu6x7XOOTc3dXwkDG4AZd9kgAywtRqYJvdDcQLIUERLEQ8rBfsMxx6yNnn5WXEegAajkAae0ERvhnVoAqGCoNpydCTkumNAqpHUkzPF3LLlOvQOt8dhFVMoad5QZBgHuR8QYRTG7w',
				'a3WwsJD3EibWaK0PQDEjthSlzMXnJudLRqXk6M4HWz9kqWy17u9QQryrezjVTdHMiEC52rEYjajEb_DewUE11tjxIEhuLzWCD6Gi9kHkCmqHQnVJLU3SnaTOKt7Se95bQj7f9V90B3s4wlf6G_DzBis-wiqMpyHBJFpgHEPopxM'
			],
		
			// Cookie Options
			maxAge: 15 * 60 * 1000 // 15 minutes
		})
	)

	// Templates
	app.set('view engine', 'ejs')
	app.use(expressLayouts)
	console.log('views dir: ', resolve(__dirname, './views'))
	app.set('views', resolve(__dirname, './views'))
	app.set('layout', './layout')

	// api routes
	app.use('/api', api)

	// auth routes
	app.use('/auth', auth)

	// authX routes
	app.use('/authX', authX)

	// static file-serving middleware
	app.use(express.static(path.join(__dirname, '..', 'public')))

	// any remaining requests with an extension (.js, .css, etc.) send 404
	// app.use((req, res, next) => {
	// 	if (path.extname(req.path).includes('.js') || 
	// 		path.extname(req.path).includes('.css') || 
	// 		path.extname(req.path).includes('.json') || 
	// 		path.extname(req.path).includes('.md')
	// 	) {
	// 		const err = new Error('Not found')
	// 		err.status = 404
	// 		next(err)
	// 	} else {
	// 		next()
	// 	}
	// })

	// sends index.html
	app.use('*', (req, res) => {
		res.sendFile(path.join(__dirname, '..', 'public/index.html'))
	})

	// error handling endware
	app.use((err, req, res, next) => {
		console.error(err)
		console.error(err.stack)
		res.status(err.status || 500).send(err.message || 'Internal server error.')
	})

	// load key/cert
	const privateKey = fs.existsSync('certs/privkey.pem') ? fs.readFileSync('certs/privkey.pem', 'utf8') : ''
	const certificate = fs.existsSync('certs/fullchain.pem') ? fs.readFileSync('certs/fullchain.pem', 'utf8') : ''
	const credentials = { key: privateKey, cert: certificate }

	// Wrap(proxy) express with http server
	httpServer = http.createServer(app)

	// Wrap(proxy) http server with https server
	httpsServer = https.createServer(credentials, app)

}


const startListening = () => {
	console.log('start Listening...')
	// start listening (and create a 'server' object representing our server)
	// const server = app.listen(PORT, () =>
	// 	console.log(`Mixing it up on port ${PORT}`)
	// )
	if (config.server.https === '1' || config.server.https === 'true') {
		const server = httpsServer.listen(PORT, () =>
			console.log(`Listening on https://${config.server.host ? config.server.host : '0.0.0.0'}:${PORT}`)
		)
	} else {
		const server = httpServer.listen(PORT, () =>
			console.log(`Listening on http://${config.server.host ? config.server.host : '0.0.0.0'}:${PORT}`)
		)
	}
}

const syncDb = () => db.sync()

const bootApp = async () => {
	await syncDb()
	await createApp()
	await startListening()
}

// This evaluates as true when this file is run directly from the command line,
// i.e. when we say 'node server/index.js' (or 'nodemon server/index.js', or 'nodemon server', etc)
// It will evaluate false when this module is required by another module - for example,
// if we wanted to require our app in a test spec
if (require.main === module) {
	bootApp()
} else {
	createApp()
}
