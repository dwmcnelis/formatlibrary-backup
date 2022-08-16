
const router = require('express').Router()
const {Set} = require('../db/models')

module.exports = router

router.get('/boosters', async (req, res, next) => {
  try {
    const sets = await Set.findAll({
      where: {
        booster: true
      },
      attributes: ['id', 'setName', 'setCode', 'tcgDate'],
      order: [['tcgDate', 'ASC']]
    })

    console.log('sets.length', sets.length)

    res.json(sets)
  } catch (err) {
    next(err)
  }
})
