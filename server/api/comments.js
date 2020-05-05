const router = require('express').Router()
const {Comment} = require('../db/models')
module.exports = router

router.get('/', async (req, res, next) => {
  try {
    const users = await Comment.findAll()
    res.json(users)
  } catch (err) {
    next(err)
  }
})

router.get('/:id', async (req, res, next) => {
  try {
    const comment = await Comment.findOne({
      where: {
        id: req.params.id
      }
    })
    res.json(comment)
  } catch (err) {
    next(err)
  }
})

router.get('/sighting/:id', async (req, res, next) => {
  try {
    const comments = await Comment.findAll({
      where: {
        sightingId: req.params.id
      }
    })
    res.json(comments)
  } catch (err) {
    next(err)
  }
})

router.get('/user/:id', async (req, res, next) => {
  try {
    const comments = await Comment.findAll({
      where: {
        userId: req.params.id
      }
    })
    res.json(comments)
  } catch (err) {
    next(err)
  }
})
