const Sequelize = require('sequelize')
const pkg = require('../../package.json')
const { pgPassword } = require('../../secrets.js')
const databaseName = pkg.name + (process.env.NODE_ENV === 'test' ? '-test' : '')

const url = process.env.DATABASE_URL
  ? process.env.DATABASE_URL
  : `postgresql://danielmcnelis@localhost/${databaseName}`


// const db = new Sequelize(url, {
//   logging: false,
//   ssl: true
// })

const db = new Sequelize(
  'formatlibrary',
  'ubuntu',
  pgPassword,
  { 
    host: 'localhost',
    port: 5432,
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
