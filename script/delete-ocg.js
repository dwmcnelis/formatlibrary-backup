'use strict'

const {data} = require('../public/cardinfo2.json')
const fs = require('fs')

const removeFile = card => {
  try {
    fs.unlinkSync(
      `/Users/Daniel/Desktop/formatlibrary/public/card-images/${card.id}.jpg`
    )
    console.log(`${card.name} image file removed!`)
  } catch (err) {
    console.log(`Error: Image for ${card.name} does not exist.`)
    console.error(err)
  }
}

const deleteOCG = () => {
  let n = 0
  data.forEach(function(card) {
    if (
      !card.misc_info[0].tcg_date ||
      card.type === 'Token' ||
      card.type === 'Skill Card'
    ) {
      n++
      return setTimeout(function() {
        removeFile(card)
      }, n * 100)
    }
  })
}

deleteOCG()

module.exports = deleteOCG
