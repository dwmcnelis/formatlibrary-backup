const Sequelize = require('sequelize')
const config = require('../../config')

const db = config.database.url ? new Sequelize(config.database.url, {
	logging: false,
	ssl: true
}) : new Sequelize(
	config.database.database,
	config.database.user,
	config.database.password,
	{
		host: config.database.host,
		port: config.database.port,
		dialect: 'postgres',
		logging: false
	}
)

module.exports = db

// This is a global Mocha hook used for resource cleanup.
// Otherwise, Mocha v4+ does not exit after tests.
if (process.env.NODE_ENV === 'test') {
	after('close database connection', () => db.close())
}
