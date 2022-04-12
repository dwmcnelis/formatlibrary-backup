
const router = require('express').Router()
const {Player, Stats} = require('../db/models')

module.exports = router

/* eslint-disable complexity */
router.get('/:id', async (req, res, next) => {
  try {
    const player = await Player.findOne({
      where: {
        tag: req.params.id.slice(0, -4) + '#' +  req.params.id.slice(-4),
        blacklisted: false
      }
    })

    res.json(player)
  } catch (err) {
    next(err)
  }
})

/* eslint-disable complexity */
// router.get('/', async (req, res, next) => {
//   try {
//     const players = await Player.findAll({
//       where: {
//         blacklisted: false
//       }
//     })
//     res.json(players)
//   } catch (err) {
//     next(err)
//   }
// })

