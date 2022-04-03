/* eslint-disable max-statements */
/* eslint-disable complexity */
const router = require('express').Router()
const {Card, Print, Set, Status} = require('../db/models')
const {Op} = require('sequelize')
const {generateDefaultStatus} = require('../../functions/utility')

module.exports = router

router.get('/all', async (req, res, next) => {
  try {
    const cards = await Card.findAll({
      where: {
        tcgLegal: true,
        tcgDate: { [Op.not]: null }
      },
      order: [['name', 'ASC']]
    })
    res.json(cards)
  } catch (err) {
    next(err)
  }
})

router.get('/some', async (req, res, next) => {
  const { query } = req
  const { category, name, description, attribute, icon, type, day, month, year, level, atk, def } = query
  const date = `${year || 2022}-${month < 10 ? `0${month}` : month || 12}-${day < 10 ? `0${day}` : day || 31}`

  if (query.normal || query.effect) {
    query.fusion = false
    query.ritual = false
    query.synchro = false
    query.xyz = false
    query.pendulum = false
    query.link = false
  }

  delete query.category
  delete query.attribute
  delete query.icon
  delete query.type
  delete query.day
  delete query.month
  delete query.year
  delete query.name
  delete query.description
  delete query.level
  delete query.atk
  delete query.def

  try {
    const filters = {
        ...query,
        tcgLegal: true,
        tcgDate: { [Op.lte]: date }
    }

    if (level) filters.level = { [Op.gte]: parseInt(level[0]), [Op.lte]: parseInt(level[1]) }
    if (atk) filters.atk = { [Op.gte]: parseInt(atk[0]), [Op.lte]: parseInt(atk[1]) }
    if (def) filters.def = { [Op.gte]: parseInt(def[0]), [Op.lte]: parseInt(def[1]) }
    if (category && category !== 'All Cards') filters.category = category 
    if (name) filters.name = { [Op.iLike]: `%${name}%` }
    if (description) filters.description = { [Op.iLike]: `%${description}%` }
    if (attribute) filters.attribute = { [Op.or]: [...Object.keys(JSON.parse(attribute))].map((e) => ({[Op.iLike]: e}))}
    if (icon) filters.icon = { [Op.or]: [...Object.keys(JSON.parse(icon))].map((e) => ({[Op.iLike]: e}))}
    if (type) filters.type = { [Op.or]: [...Object.keys(JSON.parse(type))].map((e) => ({[Op.iLike]: e}))}

    const cards = await Card.findAll({
      where: filters,
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
        tcgLegal: true,
        tcgDate: { 
          [Op.not]: null
        }
      },
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
      }
    }) 

    const status = await Status.findOne({
      where: {
        cardId: card.id
      }
    })

    const prints = await Print.findAll({
      where: {
        cardId: card.id
      },
      include: [Set],
      order: [[Set, 'tcgDate', 'ASC']]
    })

    const info = {
      card: card,
      status: status || generateDefaultStatus(card),
      prints: prints || []
    }

    res.json(info)
  } catch (err) {
    next(err)
  }
})
