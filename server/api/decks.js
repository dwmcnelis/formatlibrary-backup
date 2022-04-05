
const router = require('express').Router()
const {Card, Deck, DeckType, Player} = require('../db/models')
const {capitalize, ordinalize} = require('../../functions/utility')
const {Op} = require('sequelize')

module.exports = router

/* eslint-disable complexity */
router.get('/popular/:format', async (req, res, next) => {
    try {
        const decks = await Deck.findAll({ 
            where: {
                format: req.params.format.toLowerCase(),
                deckType: {[Op.not]: 'other'} 
            }
        })

        if (!decks.length) return false
        
        const freqs = decks.reduce((acc, curr) => (acc[curr.deckType] ? acc[curr.deckType]++ : acc[curr.deckType] = 1, acc), {})
        const arr = Object.entries(freqs).sort((a, b) => b[1] - a[1]).map((e) => e[0]).slice(0, 6)
        const data = []

        for (let i = 0; i < arr.length; i++) {
            const name = arr[i]
            const deckType = await DeckType.findOne({
                where: {
                    name: name,
                    format: req.params.format.toLowerCase()
                }
            })

            if (!deckType) continue
            data.push(deckType)
        }

        res.json(data)
    } catch (err) {
        next(err)
    }
})

/* eslint-disable complexity */
router.get('/frequent/:id', async (req, res, next) => {
    try {
        const decks = await Deck.findAll({ 
            where: {
                playerId: req.params.id,
                deckType: {[Op.not]: 'other'}
            }
        })

        if (!decks.length) return false
        
        const freqs = decks.reduce((acc, curr) => (acc[curr.deckType] ? acc[curr.deckType]++ : acc[curr.deckType] = 1, acc), {})
        const arr = Object.entries(freqs).sort((a, b) => b[1] - a[1]).map((e) => e[0]).slice(0, 6)
        const data = []

        for (let i = 0; i < arr.length; i++) {
            const name = arr[i]
            const deckType = await DeckType.findOne({
                where: {
                    name: name
                }
            })

            if (!deckType) continue
            data.push(deckType)
        }

        res.json(data)
    } catch (err) {
        next(err)
    }
})

/* eslint-disable complexity */
router.get('/player/:id', async (req, res, next) => {
    try {
        const decks = await Deck.findAll({ 
            where: {
                playerId: req.params.id,
                display: true
            },
            order: [["placement", "ASC"], ["createdAt", "ASC"]],
            limit: 10
        })

        return res.json(decks)
    } catch (err) {
        next(err)
    }
})

/* eslint-disable complexity */
router.get('/like/:id', async (req, res, next) => {
    try {
        const deck = await Deck.findOne({ 
            where: {
                id: req.params.id,
                display: true
            }
        })

        if (!deck) return false
        
        deck.rating++
        await deck.save()
        return res.status(200).send('ok')
    } catch (err) {
        next(err)
    }
})

/* eslint-disable complexity */
router.get('/download/:id', async (req, res, next) => {
    try {
        const deck = await Deck.findOne({ 
            where: {
                id: req.params.id,
                display: true
            }
        })

        if (!deck) return false
        deck.downloads++
        await deck.save()
        res.send(deck.ydk)
    } catch (err) {
        next(err)
    }
})

router.get('/all', async (req, res, next) => {
    try {
        const decks = await Deck.findAll({ 
            where: { display: true },
            order: [["createdAt", "DESC"], ["placement", "ASC"], ["builder", "ASC"]]
        })

        res.json(decks)
    } catch (err) {
        next(err)
    }
})

/* eslint-disable complexity */
router.get('/first/:x', async (req, res, next) => {
    try {
        const decks = await Deck.findAll({ 
            where: { display: true },
            order: [["createdAt", "DESC"], ["placement", "ASC"], ["builder", "ASC"]],
            limit: req.params.x, 
            include: Player 
        })

        const data = []
        for (let i = 0 ; i < decks.length; i++) {
            const deck = decks[i]
            const { id, builder, deckType, deckCategory, format, ydk, event, community, placement, downloads, views, rating, createdAt, playerId, tournamentId, player } = deck
            const main = []
            const mainKonamiCodes = deck.ydk.split('#main')[1].split('#extra')[0].split('\n').filter((e) => e.length)
    
            for (let i = 0; i < mainKonamiCodes.length; i++) {
                let konamiCode = mainKonamiCodes[i]
                while (konamiCode.length < 8) konamiCode = '0' + konamiCode
                const card = await Card.findOne({ where: { konamiCode }})
                if (!card) continue
                main.push(card)
            }

            main.sort((a, b) => {
                if (a.sortPriority > b.sortPriority) {
                    return 1
                } else if (b.sortPriority > a.sortPriority) {
                    return -1
                } else if (a.name > b.name) {
                    return 1
                } else if (b.name > a.name) {
                    return -1
                } else {
                    return false
                }
            })

            data.push({ id, builder, deckType, deckCategory, builder, format, ydk, event, community, placement, downloads, views, rating, createdAt, playerId, tournamentId, player, main })
        }

        res.json(data)
    } catch (err) {
        next(err)
    }
})

/* eslint-disable complexity */
router.get('/:id', async (req, res, next) => {
    try {
        const deck = await Deck.findOne({ 
            where: {
                id: req.params.id,
                display: true
            }, 
            include: Player
        })
        if (!deck) return {}

        const main = []
        const extra = []
        const side = []
        const mainKonamiCodes = deck.ydk.split('#main')[1].split('#extra')[0].split('\n').filter((e) => e.length)
        const extraKonamiCodes = deck.ydk.split('#extra')[1].split('!side')[0].split('\n').filter((e) => e.length)
        const sideKonamiCodes = deck.ydk.split('!side')[1].split('\n').filter((e) => e.length)

        for (let i = 0; i < mainKonamiCodes.length; i++) {
            let konamiCode = mainKonamiCodes[i]
            while (konamiCode.length < 8) konamiCode = '0' + konamiCode
            const card = await Card.findOne({ where: { konamiCode }})
            if (!card) continue
            main.push(card)
        }

        main.sort((a, b) => {
            if (a.sortPriority > b.sortPriority) {
                return 1
            } else if (b.sortPriority > a.sortPriority) {
                return -1
            } else if (a.name > b.name) {
                return 1
            } else if (b.name > a.name) {
                return -1
            } else {
                return false
            }
        })

        for (let i = 0; i < extraKonamiCodes.length; i++) {
            let konamiCode = extraKonamiCodes[i]
            while (konamiCode.length < 8) konamiCode = '0' + konamiCode
            const card = await Card.findOne({ where: { konamiCode }})
            if (!card) continue
            extra.push(card)
        }

        extra.sort((a, b) => {
            if (a.sortPriority > b.sortPriority) {
                return 1
            } else if (b.sortPriority > a.sortPriority) {
                return -1
            } else if (a.name > b.name) {
                return 1
            } else if (b.name > a.name) {
                return -1
            } else {
                return false
            }
        })

        for (let i = 0; i < sideKonamiCodes.length; i++) {
            let konamiCode = sideKonamiCodes[i]
            while (konamiCode.length < 8) konamiCode = '0' + konamiCode
            const card = await Card.findOne({ where: { konamiCode }})
            if (!card) continue
            side.push(card)
        }

        side.sort((a, b) => {
            if (a.sortPriority > b.sortPriority) {
                return 1
            } else if (b.sortPriority > a.sortPriority) {
                return -1
            } else if (a.name > b.name) {
                return 1
            } else if (b.name > a.name) {
                return -1
            } else {
                return false
            }
        })
        
        deck.views++
        await deck.save()

        const data = {
            ...deck.dataValues, 
            main, 
            extra, 
            side
        }

        res.json(data)
    } catch (err) {
        next(err)
    }
})