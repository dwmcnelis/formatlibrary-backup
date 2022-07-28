
const router = require('express').Router()
const {Set} = require('../db/models')
const {Op} = require('sequelize')

module.exports = router

router.get('/', async (req, res, next) => {
  try {
    const sets = await Set.findAll({
      where: {
        name: {[Op.substring]: req.params.query}
      },
      attributes: ['name', 'ypdId'],
      order: [['name', 'ASC']]
    })

    res.json(cards)
  } catch (err) {
    next(err)
  }
})