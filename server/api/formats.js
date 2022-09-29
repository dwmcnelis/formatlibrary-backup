
const router = require('express').Router()
const {Op} = require('sequelize')
const {Format, Deck, Stats, Tournament} = require('../db/models')

module.exports = router

router.get('/:name', async (req, res, next) => {
  try {
    const format = await Format.findOne({
      where: {
        name: { [Op.iLike]: req.params.name.replace(' ', '_').replace('-', '_') }
      },
      attributes: ['id', 'name', 'icon', 'date', 'banlist', 'event', 'description']
    })

    const deckCount = await Deck.count({
      where: {
        formatName: {[Op.iLike]: format.name.replace(' ', '_').replace('-', '_') }
      }
    })

    const eventCount = await Tournament.count({
      where: {
        formatName: {[Op.iLike]: format.name.replace(' ', '_').replace('-', '_') }
      }
    })

    const statsCount = await Stats.count({
      where: {
        format: {[Op.iLike]: format.name.replace(' ', '_').replace('-', '_') },
        serverId: '414551319031054346'
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
            [Op.or]: {
                popular: true,
                date: {[Op.not]: null}
            }
        },
        attributes: ['id', 'name', 'icon', 'date', 'banlist', 'event', 'description', 'popular'],
        order: [['popular', 'DESC'], ['date', 'ASC']]
    })

    res.json(formats)
  } catch (err) {
    next(err)
  }
})

