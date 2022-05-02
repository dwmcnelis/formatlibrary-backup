
const router = require('express').Router()
const {Op} = require('sequelize')
const {Player, Stats} = require('../db/models')

module.exports = router

/* eslint-disable complexity */
router.get('/leaders/:limit/:format', async (req, res, next) => {
  try {
    const stats = await Stats.findAll({
      where: {
        format: {[Op.iLike]: req.params.format.replace(' ', '_').replace('-', '_')},
        [Op.or]: {
          wins: {[Op.gte]: 5},
          losses: {[Op.gte]: 5},
        },
        '$player.blacklisted$': false
      },
      attributes: { exclude: ['createdAt', 'updatedAt'] },
      include: [{ model: Player, attributes: { exclude: ['id', 'password', 'blacklisted', 'createdAt', 'updatedAt']} }],
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
        [Op.or]: {
          wins: {[Op.gte]: 5},
          losses: {[Op.gte]: 5},
        }
      },
      attributes: { exclude: ['createdAt', 'updatedAt'] },
      order: [['elo', 'DESC']],
      limit: 10
    })

    res.json(stats)
  } catch (err) {
    next(err)
  }
})


/* eslint-disable complexity */
// router.get('/', async (req, res, next) => {
//   try {
//     const stats = await Stats.findAll()
//     res.json(stats)
//   } catch (err) {
//     next(err)
//   }
// })

