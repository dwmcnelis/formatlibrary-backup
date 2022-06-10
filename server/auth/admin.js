
const router = require('express').Router()
const {Player} = require('../db/models')

module.exports = router

router.get('/:username/:password', async (req, res, next) => {
    console.log('ROUTE HIT')
  try {
    const player = await Player.findOne({
        where: {
            name: req.params.username,
            password: req.params.password
        }
    })

    console.log('!!player', !!player)
    if (!player) return false
    const data = { isAdmin: player.admin }
    res.json(data)
  } catch (err) {
    next(err)
  }
})
