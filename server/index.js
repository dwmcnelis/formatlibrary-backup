
const fs = require('fs')
const http = require('http')
const https = require('https')
const path = require('path')
const express = require('express')
const morgan = require('morgan')
const compression = require('compression')
const session = require('express-session')
// const passport = require('passport')
const SequelizeStore = require('connect-session-sequelize')(session.Store)
const db = require('./db')
const api = require('./api')
const auth = require('./auth')
const sessionStore = new SequelizeStore({ db })
const onAWS = fs.existsSync('certs/privkey.pem')
const PORT = onAWS ? 443 : 8080
const app = express()
module.exports = app
let httpServer
let httpsServer

// This is a global Mocha hook, used for resource cleanup.
// Otherwise, Mocha v4+ never quits after tests.
if (process.env.NODE_ENV === 'test') {
	after('close the session store', () => sessionStore.stopExpiringSessions())
}

/**
 * In your development environment, you can keep all of your
 * app's secret API keys in a file called `secrets.js`, in your project
 * root. This file is included in the .gitignore - it will NOT be tracked
 * or show up on Github. On your production server, you can add these
 * keys as environment variables, so that they can still be read by the
 * Node process on process.env
 */
if (process.env.NODE_ENV !== 'production') require('../secrets')

// // passport registration
// passport.serializeUser((user, done) => done(null, user.id))

// passport.deserializeUser(async (id, done) => {
//   try {
//     const user = await db.models.user.findByPk(id)
//     done(null, user)
//   } catch (err) {
//     done(err)
//   }
// })

const createApp = () => {
	console.log('creating App...')
	// logging middleware
	app.use(morgan('dev'))

	// body parsing middleware
	app.use(express.json({limit: '1mb'}))
	app.use(express.urlencoded({ extended: true, limit: '1mb'}))

	// compression middleware
	app.use(compression())

	// // session middleware with passport
	// app.use(
	//   session({
	//     secret: process.env.SESSION_SECRET || 'my best friend is Cody',
	//     store: sessionStore,
	//     resave: false,
	//     saveUninitialized: false
	//   })
	// )
	// app.use(passport.initialize())
	// app.use(passport.session())

	// api routes
	app.use('/api', api)

	// auth routes
	app.use('/auth', auth)

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
	if (onAWS) {
		const server = httpsServer.listen(PORT, () =>
			console.log(`Mixing it up on port ${PORT}`)
		)
	} else {
		const server = httpServer.listen(PORT, () =>
			console.log(`Testing things out on port ${PORT}`)
		)
	}
}

const syncDb = () => db.sync()

async function bootApp() {
	await sessionStore.sync()
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
