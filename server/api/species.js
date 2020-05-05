const router = require('express').Router()
const {Species} = require('../db/models')
module.exports = router

router.get('/', async (req, res, next) => {
  try {
    const species = await Species.findAll({
      order: [['commonName', 'ASC']]
    })
    res.json(species)
  } catch (err) {
    next(err)
  }
})

router.get('/:id', async (req, res, next) => {
  try {
    const species = await Species.findOne({
      where: {
        id: req.params.id
      }
    })

    res.json(species)
  } catch (err) {
    next(err)
  }
})
