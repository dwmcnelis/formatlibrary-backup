
const Sequelize = require('sequelize')
const db = require('../db')

const Deck = db.define('decks', {
  type: {
      type: Sequelize.STRING
  },
  category: {
      type: Sequelize.STRING
  },
  builder: {
    type: Sequelize.STRING
  },
  playerId: {
      type: Sequelize.STRING
  },
  formatName: {
    type: Sequelize.STRING
  },
  formatId: {
    type: Sequelize.STRING
  },
  eventName: {
    type: Sequelize.STRING
  },
  eventDate: {
      type: Sequelize.DATE
  },
  community: {
    type: Sequelize.STRING
  },
  eventId: {
      type: Sequelize.INTEGER
  },
  placement: {
    type: Sequelize.INTEGER
  },
  display: {
    type: Sequelize.BOOLEAN,
    defaultValue: true
  },
  ydk: {
    type: Sequelize.TEXT
  },
  downloads: {
    type: Sequelize.INTEGER,
    defaultValue: 0
  },
  rating: {
    type: Sequelize.INTEGER,
    defaultValue: 0
  },
  views: {
    type: Sequelize.INTEGER,
    defaultValue: 0
  }
})

module.exports = Deck
