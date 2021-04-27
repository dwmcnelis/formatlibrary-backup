const Sequelize = require('sequelize')
const pkg = require('../../package.json')
const {secretUrl} = require('../../secrets')

// console.log('secretUrl:', secretUrl)

const databaseName = pkg.name + (process.env.NODE_ENV === 'test' ? '-test' : '')

console.log('databaseName:', databaseName)

// const url = secretUrl

const url = process.env.DATABASE_URL
  ? process.env.DATABASE_URL
  : `postgresql://danielmcnelis@localhost/${databaseName}`

console.log('url:', url)

const db = new Sequelize(url, {
  logging: false,
  ssl: true
})

// const db = new Sequelize(`${process.env.DATABASE_URL}?sslmode=require`, {
//   url: process.env.DATABASE_URL,
//   dialect: 'postgres',
//   logging: false,
//   dialectOptions: {
//     ssl: {
//       rejectUnauthorized: false // very important
//     }
//   }
// })

module.exports = db

// This is a global Mocha hook used for resource cleanup.
// Otherwise, Mocha v4+ does not exit after tests.
if (process.env.NODE_ENV === 'test') {
  after('close database connection', () => db.close())
}
