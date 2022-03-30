
const router = require('express').Router()
const {Player, Stats} = require('../db/models')

module.exports = router

/* eslint-disable complexity */
router.get('/leaders/:format', async (req, res, next) => {
  try {
    const stats = await Stats.findAll({
      where: {
        format: req.params.format.replace('-', '_')
      },
      include: Player,
      limit: 10,
      order: [['elo', 'DESC']]
    })

    res.json(stats)
  } catch (err) {
    next(err)
  }
})


/* eslint-disable complexity */
router.get('/', async (req, res, next) => {
  try {
    const stats = await Stats.findAll()
    res.json(stats)
  } catch (err) {
    next(err)
  }
})

