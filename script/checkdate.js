'use strict'

const {data} = require('../public/cardinfo2.json')
const {Card} = require('../server/db/models')

function checkdate() {
  console.log('checking dates!')
  let n = 0
  data.forEach(function(card) {
    if (card.type === 'Token' || card.type === 'Skill Card') {
      return
    }
    if (!card.misc_info[0].tcg_date) {
      return console.log(`${card.name} has not been released in the TCG.`)
    } else n++

    return setTimeout(function() {
      updateSQL(card)
    }, n * 100)
  })
}

async function updateSQL(card) {
  try {
    const row = await Card.findOne({
      where: {
        name: card.name
      }
    })

    if (row.date.slice(0, 10) === card.misc_info[0].tcg_date) {
      return
    } else {
      console.log(
        `Discrepancy: FL has ${card.name} as being released on ${row.date.slice(
          0,
          10
        )} while YPD has ${card.misc_info[0].tcg_date}.`
      )

      await row.update({
        date: card.misc_info[0].tcg_date
      })
    }
  } catch (err) {
    console.log(`Error for: ${card.name}: ${err}`)
  }
}

checkdate()

module.exports = checkdate
