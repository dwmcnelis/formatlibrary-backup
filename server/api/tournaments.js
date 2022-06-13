
const router = require('express').Router()
const {Card, Deck, DeckType, Event, Player, Tournament} = require('../db/models')
const {Op} = require('sequelize')
const {arrayToObject, capitalize} = require('../../functions/utility')
const { challongeAPIKeys } = require('../../secrets')
const axios = require('axios')

router.get('/challonge/:name', async (req, res, next) => {
    try {
      const {data} = await axios.get(`https://api.challonge.com/v1/tournaments/${req.params.name}.json?api_key=${challongeAPIKeys[req.headers.community]}`)
      res.json(data.tournament)
    } catch (err) {
      next(err)
    }
  })