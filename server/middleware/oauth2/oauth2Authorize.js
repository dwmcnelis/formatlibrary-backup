const { AuthorizationCode } = require('simple-oauth2')
const { generators } = require('openid-client')

const oauth2Authorize = (options) => {
	const { clientId, clientSecret, redirectUrl, scope, authorizeUrl, tokenUrl, returnTo } = options
	// console.log('middleware.oauth2Authorize: clientId: ', clientId)
	// console.log('middleware.oauth2Authorize: clientSecret: ', clientSecret)
	// console.log('middleware.oauth2Authorize: redirectUrl: ', redirectUrl)
	// console.log('middleware.oauth2Authorize: scope: ', scope)
	// console.log('middleware.oauth2Authorize: authorizeUrl: ', authorizeUrl)
	// console.log('middleware.oauth2Authorize: returnTo: ', returnTo)

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
		// console.log('middleware.oauth2Authorize:')

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

		const state = generators.state()

		const authorizationUrl = client.authorizeURL({
			redirect_uri: redirectUrl,
			scope,
			state
		})

		// console.log('middleware.oauth2Authorize: authorizationUrl: ', authorizationUrl)

		req.session = {
			state,
			returnTo
		}

		res.redirect(authorizationUrl)

		next()
	}
}

module.exports = oauth2Authorize