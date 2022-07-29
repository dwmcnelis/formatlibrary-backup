if (process.env.NODE_ENV !== 'production') {
	require('dotenv').config()
}

module.exports = {
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
	challonge: {
		"Format Library": process.env.CHALLONGE_FORMAT_LIBRARY_API_KEY, // formatLibraryChallongeAPIKey or challongeAPIKeys.'Format Library'
		"GoatFormat.com": process.env.CHALLONGE_GOAT_FORMAT_API_KEY, // goatformatChallongeAPIKey or challongeAPIKeys.'GoatFormat.com'
		"EdisonFormat.com": process.env.CHALLONGE_EDISON_FORMAT_API_KEY, // challongeAPIKeys.'EdisonFormat.com'
		"Crows Nest": process.env.CHALLONGE_CROWS_NEST_API_KEY // challongeAPIKeys.'Crows Nest'
	}
}

