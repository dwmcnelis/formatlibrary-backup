const { AuthorizationCode } = require('simple-oauth2')
const axios = require('axios')

const discordResponse = (options) => {
	const { clientId, clientSecret, redirectUrl, scope, authorizeUrl, tokenUrl, userinfoUrl, guildsUrl } = options
	// console.log('middleware.discordResponse: clientId: ', clientId)
	// console.log('middleware.discordResponse: clientSecret: ', clientSecret)
	// console.log('middleware.discordResponse: redirectUrl: ', redirectUrl)
	// console.log('middleware.discordResponse: authorizeUrl: ', authorizeUrl)
	// console.log('middleware.discordResponse: tokenUrl: ', tokenUrl)
	// console.log('middleware.discordResponse: userinfoUrl: ', userinfoUrl)

	const authorize_url = new URL(authorizeUrl)
	const authorizeHost = authorize_url.origin
	const authorizePath = authorize_url.pathname
	// console.log('middleware.oauth2Authorize: authorizeHost: ', authorizeHost)
	// console.log('middleware.oauth2Authorize: authorizePath: ', authorizePath)
	const token_url = new URL(tokenUrl)
	const tokenHost = token_url.origin
	const tokenPath = token_url.pathname
	// console.log('middleware.oauth2Authorize: tokenHost: ', tokenHost)
	// console.log('middleware.oauth2Authorize: tokenPath: ', tokenPath)

	return async (req, res, next) => {
		// console.log('middleware.discordResponse:')

		// console.log('middleware.discordResponse: query:', req.query)
		const { state, code } = req.query
		// console.log('middleware.discordResponse: state: ', state)
		// console.log('middleware.discordResponse: code: ', code)

		// console.log('middleware.discordResponse: session:', req.session)
		const { state: sessionState, returnTo } = req.session
		// console.log('middleware.discordResponse: sessionState: ', sessionState)
		// console.log('middleware.discordResponse: returnTo: ', returnTo)
		// req.session = null

		const tokenParams = {
			code,
			redirect_uri: redirectUrl,
			scope,
		}

		const client = new AuthorizationCode({
			client: {
				id: clientId,
				secret: clientSecret,
			},
			auth: {
				authorizeHost,
				authorizePath,
				tokenHost,
				tokenPath,
			},
		})

		let tokenResponse
		try {
			tokenResponse = await client.getToken(tokenParams)
		} catch (error) {
			console.error('middleware.discordResponse: error: ', error.message)
		}
		// console.log('middleware.discordResponse: tokenResponse: ', tokenResponse)
		const accessToken = tokenResponse.token.access_token
		console.log('middleware.discordResponse: accessToken: ', accessToken)

		let userinfo
		try {
			userinfo = await axios.get(userinfoUrl, {
				headers: {
					Accept: 'application/json',
					Authorization: `Bearer ${accessToken}`,
				},
			})
		} catch (error) {
			console.error('middleware.discordResponse: error: ', error.message)
		}
		console.log('middleware.discordResponse: userinfo: ', userinfo.data)

		const { email, username } = userinfo.data
		console.log('middleware.discordResponse: email: ', email)
		console.log('middleware.discordResponse: username: ', username)

		let guilds
		try {
			guilds = await axios.get(guildsUrl, {
				headers: {
					Accept: 'application/json',
					Authorization: `Bearer ${accessToken}`,
				},
			})
		} catch (error) {
			console.log('middleware.discordResponse: error: ', error.message)
		}
		console.log('middleware.discordResponse: guilds: ', guilds.data)

		// res.cookie('id', idToken, {
		// 	maxAge: 15 * 60 * 1000 // 15 minutes
		// })

		res.redirect(returnTo)

		next()
	}
}

module.exports = discordResponse
