const Sequelize = require('sequelize')
const db = require('../db')

const Sighting = db.define('sighting', {
  imageUrl: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      isUrl: true
    }
  },
  latitude: {
    type: Sequelize.FLOAT,
    allowNull: false,
    validate: {
      isNumeric: true,
      min: -90,
      max: 90
    }
  },
  longitude: {
    type: Sequelize.FLOAT,
    allowNull: false,
    validate: {
      isNumeric: true,
      min: -90,
      max: 90
    }
  },
  description: {
    type: Sequelize.TEXT,
    allowNull: true
  }
})

module.exports = Sighting
