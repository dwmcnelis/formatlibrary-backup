
const router = require('express').Router()
const {Card, Deck, DeckType, Player, Tournament} = require('../db/models')
const {Op} = require('sequelize')
const {arrayToObject, capitalize} = require('../../functions/utility')

module.exports = router

router.get('/all', async (req, res, next) => {
  try {
    const tournaments = await Tournament.findAll({
      where: {
        display: true
      },
      include: Player,
      order: [["startDate", "DESC"], ["size", "DESC"]]
    })
    
    res.json(tournaments)
  } catch (err) {
    next(err)
  }
})


/* eslint-disable complexity */
router.get('/recent/:format', async (req, res, next) => {
  try {
      const tournaments = await Tournament.findAll({ 
          where: { 
            display: true,
            format: req.params.format.toLowerCase()
          },
          include: Player,
          order: [["startDate", "DESC"], ["size", "DESC"]],
          limit: 6
      })

      const winners = []

      for (let i = 0; i < tournaments.length; i++) {
        const tournament = tournaments[i]
        const winner = await Player.findOne({ where: {
          id: tournament.playerId
        }})

        winners.push(winner)
      }

      const data = {
        tournaments,
        winners
      }

      res.json(data)
  } catch (err) {
      next(err)
  }
})

/* eslint-disable complexity */
router.get('/first/:x', async (req, res, next) => {
    try {
        const tournaments = await Tournament.findAll({ 
            where: { display: true },
            order: [["startDate", "DESC"], ["size", "DESC"]],
            limit: req.params.x
        })

        res.json(tournaments)
    } catch (err) {
        next(err)
    }
})

router.get('/:id', async (req, res, next) => {
  try {
    const tournament = await Tournament.findOne({
      where: {
        shortName: req.params.id
      },
      include: Player
    })

    const topDecks = await Deck.findAll({
      where: {
        display: true,
        tournamentId: tournament.id
      },
      order: [["placement", "ASC"], ["builder", "ASC"]],
      include: Player
    })

    const allDecks = await Deck.findAll({
      where: {
        tournamentId: tournament.id
      }
    })

    const deckTypes = Object.entries(arrayToObject(allDecks.map((d) => capitalize(d.deckType, true)))).sort((a, b) => b[1] - a[1])
    const deckCategories = Object.entries(arrayToObject(allDecks.map((d) => capitalize(d.deckCategory, true)))).sort((a, b) => b[1] - a[1])

    const mainDeckCards = []
    const sideDeckCards = []

    for (let i = 0; i < allDecks.length; i++) {
      const ydk = allDecks[i].ydk
      const main = ydk.split('#extra')[0].split('\n').filter(el => el.charAt(0) !== '#' && el.charAt(0) !== '!' && el !== '')
      mainDeckCards.push(...main)
      const side = ydk.split('!side')[1].split('\n').filter(el => el.charAt(0) !== '#' && el.charAt(0) !== '!' && el !== '')
      sideDeckCards.push(...side)
    }

    const mainDeckCardFrequencies = arrayToObject(mainDeckCards)
    const topMainDeckFrequencies = Object.entries(mainDeckCardFrequencies).sort((a, b) => b[1] - a[1]).slice(0, 10)
    const topMainDeckCards = []

    for (let i = 0; i < topMainDeckFrequencies.length; i++) {
        const e = topMainDeckFrequencies[i]
        const konamiCode = e[0]
        const card = await Card.findOne({ where: { konamiCode }})
        topMainDeckCards.push([card.dataValues, e[1]])
    }

    const sideDeckCardFrequencies = arrayToObject(sideDeckCards)
    const topSideDeckFrequencies = Object.entries(sideDeckCardFrequencies).sort((a, b) => b[1] - a[1]).slice(0, 10)
    const topSideDeckCards = []

    for (let i = 0; i < topSideDeckFrequencies.length; i++) {
      const e = topSideDeckFrequencies[i]
      const konamiCode = e[0]
      const card = await Card.findOne({ where: { konamiCode }})
      topSideDeckCards.push([card.dataValues, e[1]])
  }

    const data = {
      event: tournament,
      winner: tournament.player,
      topDecks: topDecks,
      metagame: {
        deckTypes,
        deckCategories,
        topMainDeckCards,
        topSideDeckCards
      }
    }

    res.json(data)
  } catch (err) {
    next(err)
  }
})

