
const router = require('express').Router()
const {Card, Print, Set, Status} = require('../db/models')
const {Op} = require('sequelize')

module.exports = router

router.get('/query/:query', async (req, res, next) => {
  try {
    const cards = await Card.findAll({
      where: {
        name: {[Op.substring]: req.params.query}
      },
      attributes: ['name', 'ypdId'],
      order: [['name', 'ASC']]
    })

    res.json(cards)
  } catch (err) {
    next(err)
  }
})

router.get('/all', async (req, res, next) => {
  try {
    const cards = await Card.findAll({
      where: {
        tcgLegal: true
      },
      attributes: { exclude: ['konamiCode', 'tcgLegal', 'ocgLegal', 'ocgDate', 'color', 'extraDeck', 'createdAt', 'updatedAt'] },
      include: [{ model: Print, attributes: ['id', 'cardCode', 'rarity', 'setId'] }],
      order: [['name', 'ASC']]
    })

    res.json(cards)
  } catch (err) {
    next(err)
  }
})

router.get('/first/:x', async (req, res, next) => {
  try {
    const cards = await Card.findAll({
      where: {
        tcgLegal: true
      },
      attributes: { exclude: ['konamiCode', 'tcgLegal', 'ocgLegal', 'ocgDate', 'color', 'extraDeck', 'createdAt', 'updatedAt'] },
      include: [{ model: Print, attributes: ['id', 'cardCode', 'rarity', 'setId'] }],
      limit: req.params.x,
      order: [['name', 'ASC']]
    })
    
    res.json(cards)
  } catch (err) {
    next(err)
  }
})

router.get('/:id', async (req, res, next) => {
  try {
    const card = await Card.findOne({
      where: {
        name: {[Op.iLike]: req.params.id }
      },
      attributes: { exclude: ['konamiCode', 'tcgLegal', 'ocgLegal', 'ocgDate', 'extraDeck', 'createdAt', 'updatedAt'] },
    }) 

    const statuses = await Status.findAll({
      where: {
        cardId: card.id
      },
      attributes: { exclude: ['createdAt', 'updatedAt'] }
    }).map((s) => [s.banlist, s.restriction]) || []
    
    const prints = await Print.findAll({
      where: {
        cardId: card.id
      },
      attributes: { exclude: ['tcgPlayerProductId', 'createdAt', 'updatedAt'] },
      include: [{ model: Set, attributes: ['tcgDate'] }],
      order: [[Set, 'tcgDate', 'ASC']]
    })

    const info = {
      card: card,
      statuses: Object.fromEntries(statuses),
      prints: prints || []
    }

    res.json(info)
  } catch (err) {
    next(err)
  }
})
