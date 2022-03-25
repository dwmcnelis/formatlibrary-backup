
const router = require('express').Router()
const {Op} = require('sequelize')
const {Format} = require('../db/models')

module.exports = router

/* eslint-disable complexity */
router.get('/', async (req, res, next) => {
  try {
    const formats = await Format.findAll({
        where: {
            banlist: {[Op.not]: null}
        },
        order: [['date', 'ASC']]
    })

    res.json(formats)
  } catch (err) {
    next(err)
  }
})
