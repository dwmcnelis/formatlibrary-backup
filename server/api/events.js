
const router = require('express').Router()
const {Card, Deck, DeckType, Event, Player, Tournament} = require('../db/models')
const {Op} = require('sequelize')
const {arrayToObject, capitalize} = require('../../functions/utility')
const { challongeAPIKeys } = require('../../secrets')
const axios = require('axios')
const fs = require('fs')

module.exports = router

router.get('/all', async (req, res, next) => {
  try {
    const events = await Event.findAll({
      where: {
        display: true
      },
      attributes: { exclude: ['createdAt', 'updatedAt'] },
      include: { model: Player, attributes: { exclude: ['password', 'admin', 'blacklisted', 'createdAt', 'updatedAt'] } },
      order: [["startDate", "DESC"], ["size", "DESC"]]
    })
    
    res.json(events)
  } catch (err) {
    next(err)
  }
})

router.get('/community/:community', async (req, res, next) => {
  try {
    const events = await Event.findAll({
      where: {
        community: {[Op.iLike]: req.params.community }
      },
      attributes: { exclude: ['createdAt', 'updatedAt'] },
      include: { model: Player, attributes: { exclude: ['password', 'admin', 'blacklisted', 'createdAt', 'updatedAt'] } },
      order: [["name", "ASC"]]
    })
    
    res.json(events)
  } catch (err) {
    next(err)
  }
})

/* eslint-disable complexity */
router.get('/recent/:format', async (req, res, next) => {
  try {
      const events = await Event.findAll({ 
          where: { 
            display: true,
            format: {[Op.iLike]: req.params.format }
          },
          include: { model: Player, attributes: { exclude: ['password', 'admin', 'blacklisted', 'createdAt', 'updatedAt'] } },
          attributes: { exclude: ['createdAt', 'updatedAt'] },
          order: [["startDate", "DESC"], ["size", "DESC"]],
          limit: 6
      })

      const winners = []

      for (let i = 0; i < events.length; i++) {
        const event = events[i]
        const winner = await Player.findOne({ where: {
          id: event.playerId
        }})

        winners.push(winner)
      }

      const data = {
        events,
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
        const events = await Event.findAll({ 
            where: { display: true },
            attributes: { exclude: ['createdAt', 'updatedAt'] },
            include: { model: Player, attributes: { exclude: ['password', 'admin', 'blacklisted', 'createdAt', 'updatedAt'] } },
            order: [["startDate", "DESC"], ["size", "DESC"]],
            limit: req.params.x
        })

        res.json(events)
    } catch (err) {
        next(err)
    }
})

router.get('/:id', async (req, res, next) => {
  try {
    const event = await Event.findOne({
      where: {
        abbreviation: req.params.id
      },
      attributes: { exclude: ['createdAt', 'updatedAt'] },
      include: { model: Player, attributes: { exclude: ['password', 'admin', 'blacklisted', 'createdAt', 'updatedAt'] } },
    })

    const topDecks = await Deck.findAll({
      where: {
        display: true,
        [Op.or]: {
            eventName: event.abbreviation,
            eventId: event.id
        }
      },
      attributes: { exclude: ['createdAt', 'updatedAt'] },
      order: [["placement", "ASC"], ["builder", "ASC"]]
    })

    const allDecks = await Deck.findAll({
      where: {
        [Op.or]: {
            eventName: event.abbreviation,
            eventId: event.id
        }
      }
    })

    const deckTypes = allDecks.length >= (event.size / 2) ? Object.entries(arrayToObject(allDecks.map((d) => capitalize(d.type, true)))).sort((a, b) => b[1] - a[1]) : []
    const deckCategories = allDecks.length >= (event.size / 2) ? Object.entries(arrayToObject(allDecks.map((d) => capitalize(d.category, true)))).sort((a, b) => b[1] - a[1]) : []
    const mainDeckCards = []
    const sideDeckCards = []
    const topMainDeckCards = []
    const topSideDeckCards = []

    if (allDecks.length >= (event.size / 2)) {
      for (let i = 0; i < allDecks.length; i++) {
        const ydk = allDecks[i].ydk
        const main = ydk.split('#extra')[0].split('\n').filter(el => el.charAt(0) !== '#' && el.charAt(0) !== '!' && el !== '')
        mainDeckCards.push(...main)
        const side = ydk.split('!side')[1].split('\n').filter(el => el.charAt(0) !== '#' && el.charAt(0) !== '!' && el !== '')
        sideDeckCards.push(...side)
      }
  
      const mainDeckCardFrequencies = arrayToObject(mainDeckCards)
      const topMainDeckFrequencies = Object.entries(mainDeckCardFrequencies).sort((a, b) => b[1] - a[1]).slice(0, 10)
  
      for (let i = 0; i < topMainDeckFrequencies.length; i++) {
          const e = topMainDeckFrequencies[i]
          const konamiCode = e[0]
          try {
            const card = await Card.findOne({ where: { konamiCode }})
            if (!card) continue
            topMainDeckCards.push([card.dataValues, e[1]])
          } catch (err) {
            console.log(err)
          }
      }
  
      const sideDeckCardFrequencies = arrayToObject(sideDeckCards)
      const topSideDeckFrequencies = Object.entries(sideDeckCardFrequencies).sort((a, b) => b[1] - a[1]).slice(0, 10)
  
      for (let i = 0; i < topSideDeckFrequencies.length; i++) {
        const e = topSideDeckFrequencies[i]
        const konamiCode = e[0]
        try {
          const card = await Card.findOne({ where: { konamiCode }})
          if (!card) continue
          topSideDeckCards.push([card.dataValues, e[1]])
        } catch (err) {
          console.log(err)
        }
      }
    }

    const data = {
      event: event,
      winner: event.player,
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

router.post('/create', async (req, res, next) => {
  try {
    fs.createWriteStream(`public/brackets/${req.body.abbreviation}.png`, req.body.bracket, (err) => console.log(err))

    if (req.body.id) {
      await Tournament.create({
        id: req.body.id,
        name: req.body.challongeName,
        url: req.body.url,
        format: req.body.format,
        community: req.body.community,
        emoji: req.body.emoji,
        type: req.body.type,
        channelId: req.body.channelId,
        serverId: req.body.serverId,
        state: 'complete',
        startDate: req.body.startDate
      })
    }

    const event = await Event.create({
      name: req.body.fullName,
      abbreviation: req.body.abbreviation,
      format: req.body.format,
      referenceUrl: req.body.referenceUrl,
      tournamentId: req.body.id,
      display: true,
      size: req.body.size,
      type: req.body.type,
      series: req.body.series,
      winner: req.body.winner,
      playerId: req.body.playerId,
      community: req.body.community,
      emoji: req.body.emoji,
      startDate: req.body.startDate,
      endDate: req.body.endDate
    })

    res.json(event)
  } catch (err) {
    next(err)
  }
})