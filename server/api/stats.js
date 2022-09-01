
const router = require('express').Router()
const {Op} = require('sequelize')
const {Player, Stats} = require('../db/models')

module.exports = router

router.get('/leaders/:limit/:format', async (req, res, next) => {
  try {
    const stats = await Stats.findAll({
      where: {
        format: {[Op.iLike]: req.params.format.replace(' ', '_').replace('-', '_')},
        games: {[Op.gte]: 3},
        inactive: false,
        serverId: '414551319031054346',
        '$player.hidden$': false
      },
      attributes: ['id', 'format', 'elo', 'wins', 'losses', 'playerId'],
      include: [{ model: Player, attributes: ['id', 'name', 'discriminator', 'discordId'] }],
      limit: parseInt(req.params.limit) || 10,
      order: [['elo', 'DESC']]
    })

    res.json(stats)
  } catch (err) {
    next(err)
  }
})

router.get('/:playerId', async (req, res, next) => {
  try {
    const stats = await Stats.findAll({
      where: {
        playerId: req.params.playerId,
        games: {[Op.gte]: 3},
        serverId: '414551319031054346'
      },
      attributes: ['id', 'format', 'elo', 'wins', 'losses', 'playerId'],
      order: [['elo', 'DESC']],
      limit: 10
    })

    res.json(stats)
  } catch (err) {
    next(err)
  }
})


