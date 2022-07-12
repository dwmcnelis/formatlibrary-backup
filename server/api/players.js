
const router = require('express').Router()
const {Player, Stats} = require('../db/models')
const {Op} = require('sequelize')

module.exports = router

/* eslint-disable complexity */
router.get('/query/:query', async (req, res, next) => {
  try {
    const players = await Player.findAll({
      where: {
        [Op.or]: [
          {name: {[Op.substring]: req.params.query}},
          {realName: {[Op.substring]: req.params.query}}
        ]
      },
      attributes: { exclude: ['blacklisted', 'password', 'createdAt', 'updatedAt'] },
      order: [['name', 'ASC']]
    })

    res.json(players)
  } catch (err) {
    next(err)
  }
})

router.get('/:id', async (req, res, next) => {
  try {
    const player = await Player.findOne({
      where: {
        tag: req.params.id.slice(0, -4) + '#' + req.params.id.slice(-4),
        blacklisted: false
      },
      attributes: { exclude: ['blacklisted', 'password', 'createdAt', 'updatedAt'] }
    })

    res.json(player)
  } catch (err) {
    next(err)
  }
})

/* eslint-disable complexity */
router.get('/', async (req, res, next) => {
  try {
    const players = await Player.findAll({
      attributes: { exclude: ['blacklisted', 'password', 'createdAt', 'updatedAt'] },
      order: [['name', 'ASC']]
    })

    res.json(players)
  } catch (err) {
    next(err)
  }
})

