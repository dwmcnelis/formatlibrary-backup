/* eslint-disable max-statements */
/* eslint-disable complexity */
const router = require('express').Router()
const {Card} = require('../db/models')
const {Op} = require('sequelize')

module.exports = router

router.get('/all', async (req, res, next) => {
  try {
    const cards = await Card.findAll({
      order: [['name', 'ASC']]
    })
    res.json(cards)
  } catch (err) {
    next(err)
  }
})

router.get('/some', async (req, res, next) => {
  try {
    console.log('here 1')
    console.log('req.query', req.query)

    let maxDate
    let minDate

    if (req.query.minDay || req.query.minMonth || req.query.minYear) {
      minDate = `${req.query.minYear || '2002'}-${req.query.minMonth ||
        '05'}-${req.query.minDay || '01'}`
    }

    if (req.query.maxDay || req.query.maxMonth || req.query.maxYear) {
      maxDate = `${req.query.maxYear || '2020'}-${req.query.maxMonth ||
        '12'}-${req.query.maxDay || '31'}`
    }

    const filters = {}
    if (req.query.card) filters.card = req.query.card
    if (req.query.name) filters.name = {[Op.iLike]: `%${req.query.name}%`}
    if (req.query.category) filters.category = req.query.category
    if (req.query.class) filters.class = req.query.class
    if (req.query.subclass) filters.subclass = req.query.subclass
    if (req.query.attribute) filters.attribute = req.query.attribute
    if (req.query.type) filters.type = req.query.type
    if (req.query.maxLevel)
      filters.level = {...filters.level, [Op.lte]: Number(req.query.maxLevel)}
    if (req.query.minLevel)
      filters.level = {...filters.level, [Op.gte]: Number(req.query.minLevel)}
    if (req.query.maxAtk)
      filters.atk = {...filters.atk, [Op.lte]: Number(req.query.maxAtk)}
    if (req.query.minAtk)
      filters.atk = {...filters.atk, [Op.gte]: Number(req.query.minAtk)}
    if (req.query.maxDef)
      filters.def = {...filters.def, [Op.lte]: Number(req.query.maxDef)}
    if (req.query.minDef)
      filters.def = {...filters.def, [Op.gte]: Number(req.query.minDef)}
    if (req.query.description)
      filters.description = {[Op.iLike]: `%${req.query.description}%`}
    if (maxDate) filters.date = {...filters.date, [Op.lte]: maxDate}
    if (minDate) filters.date = {...filters.date, [Op.gte]: minDate}

    console.log('here 3')
    console.log('filters in router.get(`/some`) in api', filters)
    const cards = await Card.findAll({where: filters})
    console.log('got some cards...??')
    res.json(cards)
  } catch (err) {
    next(err)
  }
})

router.get('/first/:x', async (req, res, next) => {
  try {
    const cards = await Card.findAll({
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
        id: req.params.id
      }
    })
    res.json(card)
  } catch (err) {
    next(err)
  }
})
