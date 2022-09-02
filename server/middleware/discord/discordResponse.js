const { AuthorizationCode } = require('simple-oauth2')
const axios = require('axios')

const discordResponse = (options) => {
	const { clientId, clientSecret, redirectUrl, scope, authorizeUrl, tokenUrl, userinfoUrl, guildsUrl } = options
	const authorize_url = new URL(authorizeUrl)
	const authorizeHost = authorize_url.origin
	const authorizePath = authorize_url.pathname
	const token_url = new URL(tokenUrl)
	const tokenHost = token_url.origin
	const tokenPath = token_url.pathname
	
	return async (req, res, next) => {
		const { state, code } = req.query
		const { state: sessionState, returnTo } = req.session
		
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

        const accessToken = tokenResponse.token.access_token

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

		const { email, username, discriminator, id, avatar } = userinfo.data

        const player

		// res.cookie('id', idToken, {
		// 	maxAge: 15 * 60 * 1000 // 15 minutes
		// })

		res.redirect(returnTo)
		next()
	}
}

module.exports = discordResponse
