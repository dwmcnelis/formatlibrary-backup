
const router = require('express').Router()
const {Op} = require('sequelize')
const {Format} = require('../db/models')

module.exports = router

router.get('/:id', async (req, res, next) => {
  try {
    const format = await Format.findOne({
      where: {
        name: { [Op.iLike]: req.params.id }
      }
    })

    if (format) return res.json(format)
  } catch (err) {
    next(err)
  }

  try {
    const format = await Format.findOne({
      where: {
        id: req.params.id
      }
    })

    if (format) return res.json(format)
  } catch (err) {
    next(err)
  }
})

router.get('/', async (req, res, next) => {
  try {
    const formats = await Format.findAll({
        where: {
            banlist: {[Op.not]: null}
        },
        order: [['popular', 'DESC'], ['date', 'ASC']]
    })

    res.json(formats)
  } catch (err) {
    next(err)
  }
})

