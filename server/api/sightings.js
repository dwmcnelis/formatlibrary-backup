const router = require('express').Router()
const {Sighting} = require('../db/models')
module.exports = router

router.get('/', async (req, res, next) => {
  try {
    const users = await Sighting.findAll()
    res.json(users)
  } catch (err) {
    next(err)
  }
})

router.get('/:id', async (req, res, next) => {
  try {
    const sighting = await Sighting.findOne({
      where: {
        id: req.params.id
      }
    })
    res.json(sighting)
  } catch (err) {
    next(err)
  }
})

router.get('/species/:id', async (req, res, next) => {
  try {
    const sightings = await Sighting.findAll({
      where: {
        speciesId: req.params.id
      }
    })
    res.json(sightings)
  } catch (err) {
    next(err)
  }
})

router.get('/user/:id', async (req, res, next) => {
  try {
    const sightings = await Sighting.findAll({
      where: {
        userId: req.params.id
      }
    })
    res.json(sightings)
  } catch (err) {
    next(err)
  }
})

router.put('/:userId/save', async (req, res, next) => {
  try {
    const sighting = await Sighting.create({
      commonName: req.body.commonName,
      latitude: req.body.latitude,
      longitude: req.body.longitude,
      imageUrl: req.body.imageUrl,
      description: req.body.description,
      speciesId: req.body.speciesId,
      userId: req.body.userId
    })

    res.json(sighting)
  } catch (err) {
    next(err)
  }
})
