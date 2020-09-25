'use strict'

const {data} = require('../public/cardinfo.json')
const {Card} = require('../server/db/models')

function parse() {
  console.log('parsing!')
  let n = 0
  let arrayOfCards = []
  data.forEach(function(card) {
    if (card.type === 'Token') {
      return console.log(`${card.name} IS A DAMN TOKEN.........`)
    }
    if (!card.card_sets) {
      return console.log(`${card.name} is ocg only`)
    }

    const id = `${card.id}`

    const obj = {
      id,
      name: card.name
    }

    arrayOfCards.push(obj)
    n++
    return setTimeout(function() {
      updateSQL(card)
    }, n * 100)
  })

  console.log('arrayOfCards', arrayOfCards)
}

async function updateSQL(card) {
  try {
    const row = await Card.findOne({
      where: {
        name: card.name
      }
    })

    if (row.image === `${card.id}.jpg`) {
      console.log(`Not updating: ${card.name}.`)
      return
    }
    row.image = `${card.id}.jpg`

    console.log('UPDATING ROW:', row)
    await row.save()
    console.log(`Updated ${card.name}!`)
  } catch (err) {
    console.log(err)
  }
}

parse()

module.exports = parse
