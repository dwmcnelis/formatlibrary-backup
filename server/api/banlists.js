
const router = require('express').Router()
const {Card, Status} = require('../db/models')

module.exports = router

/* eslint-disable complexity */
router.get('/:date', async (req, res, next) => {
  try {
    const date = req.params.date
    const forbidden = await Status.findAll({
      where: {
        [date]: 'forbidden'
      },
      attributes: { exclude: ['createdAt', 'updatedAt'] },
      include: [{ model: Card, attributes: { exclude: ['createdAt', 'updatedAt'] } }],
      order: [[Card, 'sortPriority', 'ASC'], ['name', 'ASC']]
    })

    const limited = await Status.findAll({
        where: {
          [date]: 'limited'
        },
        attributes: { exclude: ['createdAt', 'updatedAt'] },
        include: [{ model: Card, attributes: { exclude: ['createdAt', 'updatedAt'] } }],
        order: [[Card, 'sortPriority', 'ASC'], ['name', 'ASC']]
      })

    const semiLimited = await Status.findAll({
    where: {
        [date]: 'semi-limited'
    },
    attributes: { exclude: ['createdAt', 'updatedAt'] },
    include: [{ model: Card, attributes: { exclude: ['createdAt', 'updatedAt'] } }],
    order: [[Card, 'sortPriority', 'ASC'], ['name', 'ASC']]
    })

    const banlist = {
        forbidden: forbidden,
        limited: limited,
        semiLimited: semiLimited
    }

    res.json(banlist)
  } catch (err) {
    next(err)
  }
})
