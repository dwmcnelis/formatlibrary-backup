
const router = require('express').Router()
const {Card, Deck, DeckThumb, DeckType, Format} = require('../db/models')
const {Op} = require('sequelize')
const axios = require('axios')
const fs = require('fs')

module.exports = router

router.get('/:id', async (req, res, next) => {
    try {
        const decks = await Deck.findAll({ 
            where: { 
                type: {[Op.iLike]: req.params.id }
            }
        })

        const freqs = decks.reduce((acc, curr) => (acc[curr.formatName] ? acc[curr.formatName]++ : acc[curr.formatName] = 1, acc), {})
        const topFormat = Object.entries(freqs).sort((a, b) => b[1] - a[1]).map((e) => e[0])[0]
        const format = await Format.findOne({ where: { name: {[Op.iLike]: req.headers.format || topFormat } }})
        const showExtra = format.date >= '2008-08-05'

        const data = {
            deckType: decks[0].type,
            deckCategory: decks[0].category,
            analyzed: 0,
            main: {},
            mainMonsters: [],
            mainSpells: [],
            mainTraps: [],
            extra: {},
            extraMonsters: [],
            side: {},
            sideMonsters: [],
            sideSpells: [],
            sideTraps: []
        }

        for (let i = 0; i < decks.length; i++) {
            const deck = decks[i]
            if (deck.formatName.toLowerCase() !== format.name.toLowerCase()) continue
            data.analyzed++

            const mainKonamiCodes = deck.ydk.split('#main')[1].split('#extra')[0].split('\n').filter((e) => e.length)
            const extraKonamiCodes = showExtra ? deck.ydk.split('#extra')[1].split('!side')[0].split('\n').filter((e) => e.length) : []
            const sideKonamiCodes = deck.ydk.split('!side')[1].split('\n').filter((e) => e.length)

            const main = mainKonamiCodes.reduce((acc, curr) => (acc[curr] ? acc[curr]++ : acc[curr] = 1, acc), {})
            const extra = showExtra ? extraKonamiCodes.reduce((acc, curr) => (acc[curr] ? acc[curr]++ : acc[curr] = 1, acc), {}) : {}
            const side = sideKonamiCodes.reduce((acc, curr) => (acc[curr] ? acc[curr]++ : acc[curr] = 1, acc), {})

            Object.entries(main).forEach((e) => {
                const konamiCode = e[0]
                const count = e[1]
                if (data.main[konamiCode]) {
                    data.main[konamiCode][count]++
                    data.main[konamiCode].decks++
                    data.main[konamiCode].total += count
                } else {
                    data.main[konamiCode] = {
                        total: count,
                        decks: 1,
                        1: count === 1 ? 1 : 0, 
                        2: count === 2 ? 1 : 0,
                        3: count === 3 ? 1 : 0
                    }
                }
            })

            Object.entries(extra).forEach((e) => {
                const konamiCode = e[0]
                const count = e[1]
                if (data.extra[konamiCode]) {
                    data.extra[konamiCode][count]++
                    data.extra[konamiCode].decks++
                    data.extra[konamiCode].total += count
                } else {
                    data.extra[konamiCode] = {
                        total: count,
                        decks: 1,
                        1: count === 1 ? 1 : 0, 
                        2: count === 2 ? 1 : 0,
                        3: count === 3 ? 1 : 0
                    }
                }
            })

            Object.entries(side).forEach((e) => {
                const konamiCode = e[0]
                const count = e[1]
                if (data.side[konamiCode]) {
                    data.side[konamiCode][count]++
                    data.side[konamiCode].decks++
                    data.side[konamiCode].total += count
                } else {
                    data.side[konamiCode] = {
                        total: count,
                        decks: 1,
                        1: count === 1 ? 1 : 0, 
                        2: count === 2 ? 1 : 0,
                        3: count === 3 ? 1 : 0
                    }
                }
            })       
        }

        const main = Object.entries(data.main)

        for (let j = 0; j < main.length; j++) {
            const e = main[j]
            if (e[1].decks < (0.25 * data.analyzed)) {
                delete data.main[e[0]]
            } else {
                let konamiCode = e[0]
                while (konamiCode.length < 8) konamiCode = '0' + konamiCode
                const card = await Card.findOne({ where: { konamiCode }, attributes: ['id', 'name', 'category', 'ypdId'] }) || {}
                data.main[e[0]].card = card
            }
        }

        const extra = Object.entries(data.extra)

        for (let j = 0; j < extra.length; j++) {
            const e = extra[j]
            if (e[1].decks < (0.25 * data.analyzed)) {
                delete data.extra[e[0]]
            } else {
                let konamiCode = e[0]
                while (konamiCode.length < 8) konamiCode = '0' + konamiCode
                const card = await Card.findOne({ where: { konamiCode }, attributes: ['id', 'name', 'category', 'ypdId']}) || {}
                data.extra[e[0]].card = card
            }
        }

        const side = Object.entries(data.side)

        for (let j = 0; j < side.length; j++) {
            const e = side[j]
            if (e[1].decks < (0.25 * data.analyzed)) {
                delete data.side[e[0]]
            } else {
                let konamiCode = e[0]
                while (konamiCode.length < 8) konamiCode = '0' + konamiCode
                const card = await Card.findOne({ where: { konamiCode }, attributes: ['id', 'name', 'category', 'ypdId']}) || {}
                data.side[e[0]].card = card
            }
        }

        data.mainMonsters = Object.values(data.main).filter((v) => v.card.category === 'Monster').sort((a, b) => b.decks - a.decks)
        data.mainSpells = Object.values(data.main).filter((v) => v.card.category === 'Spell').sort((a, b) => b.decks - a.decks)
        data.mainTraps = Object.values(data.main).filter((v) => v.card.category === 'Trap').sort((a, b) => b.decks - a.decks)
        data.extraMonsters = Object.values(data.extra).sort((a, b) => b.decks - a.decks)
        data.sideMonsters = Object.values(data.side).filter((v) => v.card.category === 'Monster').sort((a, b) => b.decks - a.decks)
        data.sideSpells = Object.values(data.side).filter((v) => v.card.category === 'Spell').sort((a, b) => b.decks - a.decks)
        data.sideTraps = Object.values(data.side).filter((v) => v.card.category === 'Trap').sort((a, b) => b.decks - a.decks)
        data.format = format

        res.json(data)
    } catch (err) { 
        console.log(err) 
    }
})

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

        const count = await DeckThumb.count({ where: { name: req.body.name }}) 

        const deckThumb = await DeckThumb.findOne({ 
            where: {
                name: req.body.name,
                formatId: req.body.formatId
            }
        }) || await DeckThumb.create({
            name: deckType.name,
            deckTypeId: deckType.id,
            format: req.body.formatName,
            formatId: req.body.formatId,
            primary: !!count
        })

        deckThumb.leftCard = req.body.leftCardName,
        deckThumb.leftCardYpdId = req.body.leftCardYpdId,
        deckThumb.centerCard = req.body.centerCardName,
        deckThumb.centerCardYpdId = req.body.centerCardYpdId,
        deckThumb.rightCard = req.body.rightCardName,
        deckThumb.rightCardYpdId = req.body.rightCardYpdId,
        await deckThumb.save()
        
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
