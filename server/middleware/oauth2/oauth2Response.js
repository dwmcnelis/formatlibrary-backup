const { AuthorizationCode } = require('simple-oauth2')
const axios = require('axios')

const oauth2Response = (options) => {
	const { clientId, clientSecret, redirectUrl, scope, authorizeUrl, tokenUrl, userinfoUrl } = options
	// console.log('middleware.oauth2Response: clientId: ', clientId)
	// console.log('middleware.oauth2Response: clientSecret: ', clientSecret)
	// console.log('middleware.oauth2Response: redirectUrl: ', redirectUrl)
	// console.log('middleware.oauth2Response: authorizeUrl: ', authorizeUrl)
	// console.log('middleware.oauth2Response: tokenUrl: ', tokenUrl)
	// console.log('middleware.oauth2Response: userinfoUrl: ', userinfoUrl)

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
		// console.log('middleware.oauth2Response:')

		// console.log('middleware.oauth2Response: query:', req.query)
		const { state, code } = req.query
		// console.log('middleware.oauth2Response: state: ', state)
		// console.log('middleware.oauth2Response: code: ', code)

		// console.log('middleware.oauth2Response: session:', req.session)
		const {
			state: sessionState,
			returnTo
		} = req.session
		// console.log('middleware.oauth2Response: sessionState: ', sessionState)
		// console.log('middleware.oauth2Response: returnTo: ', returnTo)
		req.session = null

		const tokenParams = {
			code,
			redirect_uri: redirectUrl,
			scope
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
				tokenPath
			},
		})

		let tokenResponse
		try {
			tokenResponse = await client.getToken(tokenParams)
		} catch (error) {
			console.error('middleware.oauth2Response: error: ', error.message)
		}
		// console.log('middleware.oauth2Response: tokenResponse: ', tokenResponse)
		const accessToken = tokenResponse.token.access_token
		console.log('middleware.oauth2Response: accessToken: ', accessToken)

		let userinfo
		try {
			userinfo = await axios.get(userinfoUrl, {
				headers: {
					'Accept': 'application/json',
					'Authorization': `Bearer ${accessToken}`
				}
			})
		} catch (error) {
			console.error('middleware.oauth2Response: error: ', error.message)
		}
		console.log('middleware.oauth2Response: userinfo: ', userinfo.data)

		const { email } = userinfo.data
		console.log('middleware.oauth2Response: email: ', email)

		// res.cookie('id', idToken, {
		// 	maxAge: 15 * 60 * 1000 // 15 minutes
		// })

		res.redirect(returnTo)

		// next()
	}
}

module.exports = { oauth2Response }