
const router = require('express').Router()
const {Status} = require('../db/models')

module.exports = router

router.get('/query', async (req, res, next) => {
  try {
    const status = await Status.findOne({
      where: {
        name: req.headers.name,
        banlist: req.headers.banlist
      }
    })

    res.json(status)
  } catch (err) {
    next(err)
  }
})