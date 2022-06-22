
const router = require('express').Router()
const {DeckThumb, DeckType} = require('../db/models')
const {capitalize} = require('../../functions/utility')
const {Op} = require('sequelize')

module.exports = router

router.post('/create', async (req, res, next) => {
    try {
        const deckType = await DeckType.create({
            name: req.body.name,
            category: req.body.category
        })

        const deckThumb = await DeckThumb.create({
            name: deckType.name,
            deckTypeId: deckType.id,
            format: req.body.formatName,
            formatId: req.body.formatId,
            primary: true,
            leftCard: req.body.leftCardName,
            leftCardYpdId: req.body.leftCardYpdId,
            centerCard: req.body.centerCardName,
            centerCardYpdId: req.body.centerCardYpdId,
            rightCard: req.body.rightCardName,
            rightCardYpdId: req.body.rightCardYpdId,
        })

        res.json(deckType)
    } catch (err) {
        next(err)
    }
})
