
const router = require('express').Router()
const {Player} = require('../db/models')

module.exports = router

router.get('/', async (req, res, next) => {
  try {
    const player = await Player.findOne({
        where: {
            name: req.headers.username,
            hash: req.headers.password,
        }
    })

    if (!player) return false
    const data = { isAdmin: player.admin }
    res.json(data)
  } catch (err) {
    next(err)
  }
})
