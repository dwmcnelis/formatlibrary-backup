if (process.env.NODE_ENV !== 'production') {
	require('dotenv').config()
}

module.exports = {
	siteUrl: process.env.SITE_URL,
	siteJWKS: JSON.parse(process.env.SITE_JWKS),
	// siteIKS: JSON.parse(process.env.SITE_IKS),
	sessionSecret: process.env.SESSION_SECRET,
	server: {
		https: process.env.SERVER_HTTPS,
		host: process.env.SERVER_HOST,
		port: process.env.SERVER_PORT
	},
	database: {
		url: process.env.DATABASE_URL, // secretUrl
		host: process.env.DATABASE_HOST,
		port: process.env.DATABASE_PORT,
		user: process.env.DATABASE_USER,
		password: process.env.DATABASE_PASSWORD, // pgPassword
		database: 'formatlibrary'
	},
	google: {
		clientId: process.env.GOOGLE_CLIENT_ID,
		clientSecret: process.env.GOOGLE_CLIENT_SECRET,
		redirectUrl: process.env.GOOGLE_REDIRECT_URL,
		discoveryUrl: 'https://accounts.google.com/'
	},
	discord: {
		clientId: process.env.DISCORD_CLIENT_ID,
		clientSecret: process.env.DISCORD_CLIENT_SECRET,
		redirectUrl: process.env.DISCORD_REDIRECT_URL,
		scope: 'identify email',
		authorizeUrl: 'https://discord.com/api/oauth2/authorize',
		tokenUrl: 'https://discord.com/api/oauth2/token',
		userInfoUrl: 'https://discord.com/api/users/@me'
	},
	challonge: {
		"Format Library": process.env.CHALLONGE_FORMAT_LIBRARY_API_KEY, // formatLibraryChallongeAPIKey or challongeAPIKeys.'Format Library'
		"GoatFormat.com": process.env.CHALLONGE_GOAT_FORMAT_API_KEY, // goatformatChallongeAPIKey or challongeAPIKeys.'GoatFormat.com'
		"EdisonFormat.com": process.env.CHALLONGE_EDISON_FORMAT_API_KEY, // challongeAPIKeys.'EdisonFormat.com'
		"Crows Nest": process.env.CHALLONGE_CROWS_NEST_API_KEY // challongeAPIKeys.'Crows Nest'
	}
}

