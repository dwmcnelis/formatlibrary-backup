
const router = require('express').Router()
const {Op} = require('sequelize')
const {Format, Deck, Stats, Tournament} = require('../db/models')

module.exports = router

router.get('/:name', async (req, res, next) => {
  try {
    const format = await Format.findOne({
      where: {
        name: { [Op.iLike]: req.params.name.replace(' ', '_').replace('-', '_') }
      }
    })

    const deckCount = await Deck.count({
      where: {
        format: format.name.replace(' ', '_').replace('-', '_').toLowerCase()
      }
    })

    const eventCount = await Tournament.count({
      where: {
        format: format.name.replace(' ', '_').replace('-', '_').toLowerCase()
      }
    })

    const statsCount = await Stats.count({
      where: {
        format: format.name.replace(' ', '_').replace('-', '_').toLowerCase()
      }
    })

    const data = {
      format,
      deckCount,
      eventCount,
      statsCount
    }

    res.json(data)
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

