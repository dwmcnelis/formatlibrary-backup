'use strict'

import db from '../server/db'

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
