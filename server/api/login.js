
/* eslint-disable max-statements */
/* eslint-disable complexity */
const router = require('express').Router()
const {Player} = require('../db/models')

module.exports = router

router.get('/:username/:password', async (req, res, next) => {
  try {
    const player = await Player.findOne({
        where: {
            name: req.params.username,
            password: req.params.password
        }
    })

    if (!player) return false
    const data = { username: player.name, password: player.password, isAdmin: player.admin }
    res.json(data)
  } catch (err) {
    next(err)
  }
})
