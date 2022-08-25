const { Issuer } = require('openid-client')
const { decodeJwt } = require('jose')

const oidcResponse = (options) => {
	const { clientId, clientSecret, redirectUrl, discoveryUrl } = options
	// console.log('middleware.oidcResponse: clientId: ', clientId)
	// console.log('middleware.oidcResponse: clientSecret: ', clientSecret)
	// console.log('middleware.oidcResponse: redirectUrl: ', redirectUrl)
	// console.log('middleware.oidcResponse: discoveryUrl: ', discoveryUrl)

	return async (req, res, next) => {
		// console.log('middleware.oidcResponse:')

		// console.log('middleware.oidcResponse: query:', req.query)
		const { state, code } = req.query
		// console.log('middleware.oidcResponse: state: ', state)
		// console.log('middleware.oidcResponse: code: ', code)

		// console.log('middleware.oidcResponse: session:', req.session)
		const {
			state: sessionState,
			nonce: sessionNonce,
			codeVerifier: sessionCodeVerifier,
			codeChallenge: sessionCodeChallenge,
			returnTo
		} = req.session
		// console.log('middleware.oidcResponse: sessionState: ', sessionState)
		// console.log('middleware.oidcResponse: sessionNonce: ', sessionNonce)
		// console.log('middleware.oidcResponse: sessionCodeVerifier: ', sessionCodeVerifier)
		// console.log('middleware.oidcResponse: sessionCodeChallenge: ', sessionCodeChallenge)
		// console.log('middleware.oidcResponse: returnTo: ', returnTo)
		req.session = null

		const issuer = await Issuer.discover(discoveryUrl)
		const client = new issuer.Client({
			client_id: clientId,
			client_secret: clientSecret,
			redirect_uris: [redirectUrl],
			response_types: ['id_token']
		})

		const params = client && client.callbackParams(req)
		// console.log('middleware.oidcResponse: params: ', params)
		const tokenSet = client && await client.callback(redirectUrl, params, {
			nonce: sessionNonce,
			state: sessionState,
			code_verifier: sessionCodeVerifier
		})
		// console.log('middleware.oidcResponse: tokenSet: ', tokenSet)

		const { id_token: idToken } = tokenSet
		// console.log('middleware.oidcResponse: idToken: ', idToken)

		const payload = decodeJwt(idToken)
		console.log('middleware.oidcResponse: payload: ', payload)

		const { sub, email, name, given_name: givenName, family_name: familyName } = payload
		console.log('middleware.oidcResponse: sub: ', sub)
		console.log('middleware.oidcResponse: email: ', email)
		console.log('middleware.oidcResponse: name: ', name)
		console.log('middleware.oidcResponse: givenName: ', givenName)
		console.log('middleware.oidcResponse: familyName: ', familyName)

		res.cookie('id', idToken, {
			maxAge: 15 * 60 * 1000 // 15 minutes
		})

		res.redirect(returnTo)

		// next()
	}
}

module.exports = { oidcResponse }