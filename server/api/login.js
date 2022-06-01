
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
    localStorage.setItem('name',JSON.stringify({ username: player.name, isAdmin: player.admin }));
    return 'logged in'
  } catch (err) {
    next(err)
  }
})
