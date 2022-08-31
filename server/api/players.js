
const router = require('express').Router()
const {Player} = require('../db/models')
const {Op} = require('sequelize')

module.exports = router

router.get('/query/:query', async (req, res, next) => {
  try {
    const players = await Player.findAll({
      where: {
        name: {[Op.substring]: req.params.query}
      },
      attributes: ['id', 'name', 'discordId', 'firstName', 'lastName'],
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
        name: {[Op.iLike]: req.params.id },
        hidden: false
      },
      attributes: ['id', 'name', 'discordId', 'discriminator', 'firstName', 'lastName', 'duelingBook', 'avatar'],
    })

    res.json(player)
  } catch (err) {
    next(err)
  }
})

router.get('/', async (req, res, next) => {
  try {
    const players = await Player.findAll({
      attributes: ['id', 'name', 'discordId', 'discriminator', 'firstName', 'lastName', 'duelingBook', 'avatar'],
      order: [['name', 'ASC']]
    })

    res.json(players)
  } catch (err) {
    next(err)
  }
})

