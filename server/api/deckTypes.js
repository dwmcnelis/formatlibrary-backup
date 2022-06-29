
const router = require('express').Router()
const {DeckThumb, DeckType} = require('../db/models')
const axios = require('axios')
const fs = require('fs')

module.exports = router

router.post('/create', async (req, res, next) => {
    try {
        const deckType = await DeckType.findOne({ 
            where: {
                name: req.body.name
            }
        }) || await DeckType.create({
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
        
        if (!fs.existsSync(`./public/images/artworks/${deckThumb.leftCardYpdId}.jpg`)) {
            try {
                const {data} = await axios({
                    method: 'GET',
                    url: `https://storage.googleapis.com/ygoprodeck.com/pics_artgame/${deckThumb.leftCardYpdId}.jpg`,
                    responseType: 'stream'
                })
    
                data.pipe(fs.createWriteStream(`./public/images/artworks/${deckThumb.leftCardYpdId}.jpg`))
                console.log(`saved ${deckThumb.leftCard} artwork to ${`./public/images/artworks/${deckThumb.leftCardYpdId}.jpg`}`)
            } catch (err) {
                console.log(err)
            }
        }
        
        if (!fs.existsSync(`./public/images/artworks/${deckThumb.centerCardYpdId}.jpg`)) {
            try {
                const {data} = await axios({
                    method: 'GET',
                    url: `https://storage.googleapis.com/ygoprodeck.com/pics_artgame/${deckThumb.centerCardYpdId}.jpg`,
                    responseType: 'stream'
                })
    
                data.pipe(fs.createWriteStream(`./public/images/artworks/${deckThumb.centerCardYpdId}.jpg`))
                console.log(`saved ${deckThumb.centerCard} artwork to ${`./public/images/artworks/${deckThumb.centerCardYpdId}.jpg`}`)
            } catch (err) {
                console.log(err)
            }
        }

        if (!fs.existsSync(`./public/images/artworks/${deckThumb.rightCardYpdId}.jpg`)) {
            try {
                const {data} = await axios({
                    method: 'GET',
                    url: `https://storage.googleapis.com/ygoprodeck.com/pics_artgame/${deckThumb.rightCardYpdId}.jpg`,
                    responseType: 'stream'
                })
    
                data.pipe(fs.createWriteStream(`./public/images/artworks/${deckThumb.rightCardYpdId}.jpg`))
                console.log(`saved ${deckThumb.rightCard} artwork to ${`./public/images/artworks/${deckThumb.rightCardYpdId}.jpg`}`)
            } catch (err) {
                console.log(err)
            }
        }

        res.json(deckType)
    } catch (err) {
        next(err)
    }
})
