const router = require('express').Router()
const { Player } = require('../db/models')

module.exports = router

router.get('/id/', async (req, res, next) => {
	try {
		const id = await Player.genid()
		res.json({ id })
	} catch (err) {
		next(err)
	}
})
