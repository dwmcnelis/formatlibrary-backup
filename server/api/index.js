
const router = require('express').Router()

module.exports = router

router.use('/banlists', require('./banlists'))
router.use('/blogposts', require('./blogposts'))
router.use('/decks', require('./decks'))
router.use('/cards', require('./cards'))
router.use('/formats', require('./formats'))
router.use('/players', require('./players'))
router.use('/stats', require('./stats'))
router.use('/events', require('./events'))
router.use('/tournaments', require('./tournaments'))

router.use((req, res, next) => {
  const error = new Error('Not Found')
  error.status = 404
  next(error)
})
