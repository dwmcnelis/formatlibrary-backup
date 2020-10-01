'use strict'

const {Card} = require('../server/db/models')

async function truncate() {
  try {
    console.log('finding All...')
    const cards = await Card.findAll()
    let n = 0

    cards.forEach(function(card) {
      n++
      return setTimeout(function() {
        updateSQL(card)
      }, n * 100)
    })
  } catch (err) {
    console.log(err)
  }
}

async function updateSQL(card) {
  console.log('updating SQL...')
  try {
    const row = await Card.findOne({
      where: {
        id: card.id
      }
    })

    if (row.date.length > 10) return

    const date = card.date.slice(0, 10)

    await row.update({
      date: date
    })

    console.log(`Truncated the date for: ${card.name}!`)
  } catch (err) {
    console.log(`Error for: ${card.name}: ${err}`)
  }
}

truncate()

module.exports = truncate
