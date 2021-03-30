'use strict'

const db = require('../server/db')
const {Card, Status} = require('../server/db/models')

const seed = async () => {
  await db.sync()
  db.close()
  console.log(`
    Seeding successful!
    FL is now ready to rock!
  `)
}

seed().catch(err => {
  db.close()
  console.log(`
    Error seeding:
    ${err.message}
    ${err.stack}
  `)
})

module.exports = seed
