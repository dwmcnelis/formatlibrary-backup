
const router = require('express').Router()
const {Player} = require('../db/models')
const {Op} = require('sequelize')

module.exports = router

router.get('/query/:query', async (req, res, next) => {
  try {
    const players = await Player.findAll({
      where: {
        [Op.or]: [
          {name: {[Op.substring]: req.params.query}},
          {realName: {[Op.substring]: req.params.query}}
        ]
      },
      attributes: ['id', 'name', 'realName'],
      order: [['name', 'ASC']]
    })

    res.json(players)
  } catch (err) {
    next(err)
  }
})

router.get('/:id', async (req, res, next) => {
  try {
    let str = req.params.id.replaceAll('%25', '%')
        .replaceAll('%2F', '/')
        .replaceAll('%23', '#')
        .replaceAll('%3F', '?')
        .split('')

    str.splice(-4, 0, '#')
    const tag = str.join('')

    const player = await Player.findOne({
      where: {
        tag: {[Op.iLike]: tag},
        blacklisted: false
      },
      attributes: ['id', 'name', 'tag', 'realName', 'duelingBook', 'avatar'],
    })

    res.json(player)
  } catch (err) {
    next(err)
  }
})

router.get('/', async (req, res, next) => {
  try {
    const players = await Player.findAll({
      attributes: ['id', 'name', 'tag', 'realName', 'duelingBook', 'avatar'],
      order: [['name', 'ASC']]
    })

    res.json(players)
  } catch (err) {
    next(err)
  }
})

