
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
      attributes: { exclude: ['channel', 'emoji', 'role', 'createdAt', 'updatedAt'] }
    })

    const deckCount = await Deck.count({
      where: {
        format: {[Op.iLike]: format.name.replace(' ', '_').replace('-', '_') }
      }
    })

    const eventCount = await Tournament.count({
      where: {
        format: {[Op.iLike]: format.name.replace(' ', '_').replace('-', '_') }
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
            banlist: {[Op.not]: null}
        },
        attributes: { exclude: ['channel', 'emoji', 'role', 'createdAt', 'updatedAt'] },
        order: [['popular', 'DESC'], ['date', 'ASC']]
    })

    res.json(formats)
  } catch (err) {
    next(err)
  }
})

