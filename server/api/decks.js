
const router = require('express').Router()
const {Card, Deck, DeckThumb, DeckType, Format, Player} = require('../db/models')
const {Op} = require('sequelize')

module.exports = router

router.get('/popular/:format', async (req, res, next) => {
    try {
        const decks = await Deck.findAll({ 
            where: {
                formatName: {[Op.iLike]: req.params.format },
                type: {[Op.not]: 'Other'} 
            },
            attributes: ['id', 'type']
        })

        if (!decks.length) return false
        
        const freqs = decks.reduce((acc, curr) => (acc[curr.type] ? acc[curr.type]++ : acc[curr.type] = 1, acc), {})
        const arr = Object.entries(freqs).sort((a, b) => b[1] - a[1]).map((e) => e[0]).slice(0, 6)
        const data = []

        for (let i = 0; i < arr.length; i++) {
            try {
                const name = arr[i]
                const deckType = await DeckType.findOne({
                    where: {
                        name: name
                    },
                    attributes: ['name', 'id']
                })
        
                const deckThumb = await DeckThumb.findOne({
                    where: {
                        format: {[Op.iLike]: req.params.format },
                        deckTypeId: deckType.id
                    },
                    attributes: ['id', 'name', 'leftCardYpdId', 'centerCardYpdId', 'rightCardYpdId']
                }) || await DeckThumb.findOne({
                    where: {
                        primary: true,
                        deckTypeId: deckType.id
                    },
                    attributes: ['id', 'name', 'leftCardYpdId', 'centerCardYpdId', 'rightCardYpdId']
                })
    
                data.push({...deckType.dataValues, ...deckThumb.dataValues})
            } catch (err) {
                console.log(err)
            }
        }

        res.json(data)
    } catch (err) {
        next(err)
    }
})

router.get('/gallery/:format', async (req, res, next) => {
    try {
        const format = await Format.findOne({
            where: {
                name: {[Op.iLike]: req.params.format },
            },
            attributes: ['id', 'name', 'icon']
        })

        const decks = await Deck.findAll({ 
            where: {
                formatName: {[Op.iLike]: req.params.format },
                type: {[Op.not]: 'Other'} 
            },
            attributes: ['id', 'type', 'deckTypeId']
        })

        if (!decks.length) return false
        
        const freqs = decks.reduce((acc, curr) => (acc[curr.type] ? acc[curr.type]++ : acc[curr.type] = 1, acc), {})
        const arr = Object.entries(freqs).filter((e) => e[1] >= 3).sort((a, b) => b[1] - a[1]).map((e) => e[0])
        const data = []

        for (let i = 0; i < arr.length; i++) {
            try {
                const name = arr[i]
                const deckType = await DeckType.findOne({
                    where: {
                        name: name
                    },
                    attributes: ['name', 'id']
                })
    
                const deckThumb = await DeckThumb.findOne({
                    where: {
                        format: {[Op.iLike]: req.params.format },
                        deckTypeId: deckType.id
                    },
                    attributes: ['id', 'name', 'leftCardYpdId', 'centerCardYpdId', 'rightCardYpdId']
                }) || await DeckThumb.findOne({
                    where: {
                        primary: true,
                        deckTypeId: deckType.id
                    },
                    attributes: ['id', 'name', 'leftCardYpdId', 'centerCardYpdId', 'rightCardYpdId']
                })
    
                data.push({...deckType.dataValues, ...deckThumb.dataValues})
            } catch (err) {
                console.log(err)
            }
        }

        res.json({
            decks: data,
            format: format
        })
    } catch (err) {
        next(err)
    }
})

router.get('/frequent/:id', async (req, res, next) => {
    try {
        const decks = await Deck.findAll({ 
            where: {
                playerId: req.params.id,
                type: {[Op.not]: 'Other'}
            },
            attributes: ['id', 'type', 'formatName']
        })

        if (!decks.length) return false
        
        const freqs = decks.reduce((acc, curr) => (acc[`${curr.formatName}_${curr.type}`] ? acc[`${curr.formatName}_${curr.type}`]++ : acc[`${curr.formatName}_${curr.type}`] = 1, acc), {})
        const arr = Object.entries(freqs).sort((a, b) => b[1] - a[1]).map((e) => e[0])
        const data = []
        const types = []

        for (let i = 0; i < arr.length; i++) {
            try {
                const elem = arr[i]
                const name = elem.slice(elem.indexOf('_') + 1)
                const format = elem.slice(0, elem.indexOf('_'))
                const deckType = await DeckType.findOne({
                    where: {
                        name: {[Op.iLike]: name}
                    },
                    attributes: ['id', 'name']
                })
    
                if (types.includes(deckType.id)) continue
    
                const deckThumb = await DeckThumb.findOne({
                    where: {
                        deckTypeId: deckType.id,
                        format: format
                    },
                    attributes: ['id', 'name', 'leftCardYpdId', 'centerCardYpdId', 'rightCardYpdId']
                }) || await DeckThumb.findOne({
                    where: {
                        deckTypeId: deckType.id,
                        primary: true
                    },
                    attributes: ['id', 'name', 'leftCardYpdId', 'centerCardYpdId', 'rightCardYpdId']
                })
    
                types.push(deckType.id)
                data.push({...deckType.dataValues, ...deckThumb.dataValues})
            } catch (err) {
                console.log(err)
            }
        }

        res.json(data.slice(0, 6))
    } catch (err) {
        next(err)
    }
})

router.get('/player/:id', async (req, res, next) => {
    try {
        const decks = await Deck.findAll({ 
            where: {
                playerId: req.params.id,
                display: true
            },
            attributes: ['placement', 'eventId', 'eventName', 'eventDate'],
            order: [['placement', 'ASC'], ['eventDate', 'DESC']]
        })

        return res.json(decks)
    } catch (err) {
        next(err)
    }
})

router.get('/like/:id', async (req, res, next) => {
    try {
        const deck = await Deck.findOne({ 
            where: {
                id: req.params.id,
                display: true
            },
            attributes: ['id', 'rating']
        })
        
        deck.rating++
        await deck.save()
        return res.status(200).send('ok')
    } catch (err) {
        next(err)
    }
})

router.get('/download/:id', async (req, res, next) => {
    try {
        const deck = await Deck.findOne({ 
            where: {
                id: req.params.id,
                display: true
            },
            attributes: ['id', 'ydk', 'downloads']
        })

        deck.downloads++
        await deck.save()
        res.send(deck.ydk)
    } catch (err) {
        next(err)
    }
})

router.get('/all', async (req, res, next) => {
    try {
        const isAdmin = await Player.count({
            where: {
                name: req.headers.username,
                password: req.headers.password,
                admin: true
            }
        })

        const decks = await Deck.findAll({ 
            where: { display: isAdmin ? {[Op.any]: [true, false]} : true },
            attributes: ['id', 'builder', 'playerId', 'type', 'category', 'formatName', 'formatId', 'community', 'eventName', 'eventId', 'eventDate', 'placement', 'downloads', 'views', 'rating'],
            order: [['eventDate', 'DESC'], ['placement', 'ASC'], ['builder', 'ASC']],
            include: [
                { model: Format, attributes: ['id', 'name', 'icon']},
                { model: Player, attributes: ['id', 'name', 'tag', 'avatar'] }
            ],
        })

        res.json(decks)
    } catch (err) {
        next(err)
    }
})

router.get('/first/:x', async (req, res, next) => {
    try {
        const isAdmin = await Player.count({
            where: {
                name: req.headers.username,
                password: req.headers.password,
                admin: true
            }
        })

        const decks = await Deck.findAll({ 
            where: { display: isAdmin ? {[Op.any]: [true, false]} : true },
            attributes: ['id', 'builder', 'playerId', 'type', 'category', 'formatName', 'formatId', 'community', 'eventName', 'eventId', 'eventDate', 'placement', 'downloads', 'views', 'rating'],
            order: [['eventDate', 'DESC'], ['placement', 'ASC'], ['builder', 'ASC']],
            include: [
                { model: Format, attributes: ['id', 'name', 'icon']},
                { model: Player, attributes: ['id', 'name', 'tag', 'avatar'] }
            ],
            limit: req.params.x, 
        })

        res.json(decks)
    } catch (err) {
        next(err)
    }
})

router.get('/:id', async (req, res, next) => {
    try {
        const isAdmin = await Player.count({
            where: {
                name: req.headers.username,
                password: req.headers.password,
                admin: true
            }
        })

        const deck = await Deck.findOne({ 
            where: {
                id: req.params.id,
                display: isAdmin ? {[Op.any]: [true, false]} : true
            }, 
            attributes: ['id', 'ydk', 'builder', 'playerId', 'type', 'category', 'formatName', 'formatId', 'community', 'eventName', 'eventId', 'eventDate', 'placement', 'downloads', 'views', 'rating'],            
            include: [
                { model: Format, attributes: ['id', 'name', 'icon', 'banlist']},
                { model: Player, attributes: ['id', 'name', 'tag', 'avatar']}
            ],
        })

        const main = []
        const extra = []
        const side = []
        const mainKonamiCodes = deck.ydk.split('#main')[1].split('#extra')[0].split('\n').filter((e) => e.length)
        const extraKonamiCodes = deck.ydk.split('#extra')[1].split('!side')[0].split('\n').filter((e) => e.length)
        const sideKonamiCodes = deck.ydk.split('!side')[1].split('\n').filter((e) => e.length)

        for (let i = 0; i < mainKonamiCodes.length; i++) {
            let konamiCode = mainKonamiCodes[i]
            while (konamiCode.length < 8) konamiCode = '0' + konamiCode
            const card = await Card.findOne({ 
                where: { 
                    konamiCode: konamiCode
                },
                attributes: ['name', 'id', 'ypdId', 'sortPriority'],
            })

            if (!card) continue
            main.push(card)
        }

        const sortFn = (a, b) => {
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
        }

        main.sort(sortFn)

        for (let i = 0; i < extraKonamiCodes.length; i++) {
            let konamiCode = extraKonamiCodes[i]
            while (konamiCode.length < 8) konamiCode = '0' + konamiCode
            const card = await Card.findOne({ 
                where: { 
                    konamiCode: konamiCode
                },
                attributes: ['name', 'id', 'ypdId', 'sortPriority'],
            })

            if (!card) continue
            extra.push(card)
        }

        extra.sort(sortFn)

        for (let i = 0; i < sideKonamiCodes.length; i++) {
            let konamiCode = sideKonamiCodes[i]
            while (konamiCode.length < 8) konamiCode = '0' + konamiCode
            const card = await Card.findOne({ 
                where: { 
                    konamiCode: konamiCode
                },
                attributes: ['name', 'id', 'ypdId', 'sortPriority']
            })
            
            if (!card) continue
            side.push(card)
        }

        side.sort(sortFn)
        
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

router.post('/create', async (req, res, next) => {
    try {
        const format = await Format.findOne({ where: { name: {[Op.iLike]: req.body.format } }})
        const deck = await Deck.create({
            builder: req.body.builder,
            playerId: req.body.playerId,
            type: req.body.type,
            deckTypeId: req.body.deckTypeId,
            category: req.body.category,
            formatName: req.body.format,
            formatId: format.id,
            ydk: req.body.ydk,
            eventName: req.body.eventName,
            eventId: req.body.eventId,
            eventDate: req.body.eventDate,
            placement: req.body.placement,
            community: req.body.community,
            display: req.body.display,
        })

        res.json(deck)
    } catch (err) {
        next(err)
    }
})
