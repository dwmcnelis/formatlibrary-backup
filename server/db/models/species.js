const Sequelize = require('sequelize')
const db = require('../db')

const Species = db.define('species', {
  commonName: {
    type: Sequelize.STRING,
    unique: true,
    allowNull: false
  },
  scientificName: {
    type: Sequelize.STRING,
    unique: true,
    allowNull: false
  },
  category: {
    type: Sequelize.STRING,
    allowNull: false
  },
  kingdom: {
    type: Sequelize.STRING,
    allowNull: false
  },
  description: {
    type: Sequelize.TEXT,
    allowNull: true
  },
  diet: {
    type: Sequelize.TEXT,
    allowNull: true
  },
  habitat: {
    type: Sequelize.TEXT,
    allowNull: true
  },
  isEndangered: {
    type: Sequelize.BOOLEAN,
    defaultValue: false,
    allowNull: false
  },
  imageUrl: {
    type: Sequelize.TEXT,
    defaultValue: 'https://i.imgur.com/POLRlNo.jpg',
    validate: {
      isUrl: true
    }
  }
})

module.exports = Species
