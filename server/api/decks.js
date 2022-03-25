const router = require('express').Router()
const {Card, Deck, Player} = require('../db/models')
const {capitalize, ordinalize} = require('../../functions/utility')
const {Op} = require('sequelize')
const {Blob} = require('buffer')


module.exports = router

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
            limit: req.params.x,
            order: [["createdAt", "DESC"], ["placement", "ASC"]],
            include: Player
        })
        const data = []
        for (let i = 0 ; i < decks.length; i++) {
            const deck = decks[i]
            const { id, builder, deckType, deckCategory, format, ydk, event, placement, community, downloads, views, rating, createdAt, playerId, tournamentId, player } = deck
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
            data.push({ id, builder, deckType, deckCategory, builder, format, ydk, event, placement, community, downloads, views, rating, createdAt, playerId, tournamentId, player, main })
        }

        res.json(data)
    } catch (err) {
        next(err)
    }
})

router.get('/some', async (req, res, next) => {
    const { event, builder, format, deckType, deckCategory, day, month, year } = req.query
    const now = new Date()
    const FY = now.getFullYear()
    const date = `${year || FY}-${month < 10 ? `0${month}` : month || 12}-${day < 10 ? `0${day}` : day || 31}`

    try {
      const filters = { 
            createdAt: { [Op.lte]: date },
            display: true
      }

      if (event) filters.event = { [Op.iLike]: `%${event}%` }
      if (builder) filters.builder = { [Op.iLike]: `%${builder}%` }
      if (format) filters.format = { [Op.iLike]: `%${format}%` }
      if (deckType) filters.deckType = { [Op.iLike]: `%${deckType}%` }
      if (deckCategory) filters.deckCategory = { [Op.iLike]: `%${deckCategory}%` }
      
      const decks = await Deck.findAll({
        where: filters,
        order: [["createdAt", "DESC"], ["placement", "ASC"]]
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
router.get('/first/:x', async (req, res, next) => {
    try {
        const decks = await Deck.findAll({ 
            where: { display: true },
            limit: req.params.x, 
            order: [["createdAt", "DESC"], ["placement", "ASC"]],
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