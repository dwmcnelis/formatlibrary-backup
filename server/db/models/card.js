const Sequelize = require('sequelize')
const db = require('../db')

const Card = db.define('card', {
  image: {
    type: Sequelize.TEXT,
    allowNull: true
  },
  name: {
    type: Sequelize.TEXT,
    allowNull: false
  },
  card: {
    type: Sequelize.TEXT,
    allowNull: true
  },
  category: {
    type: Sequelize.TEXT,
    allowNull: true
  },
  class: {
    type: Sequelize.TEXT,
    allowNull: true
  },
  subclass: {
    type: Sequelize.TEXT,
    allowNull: true
  },
  attribute: {
    type: Sequelize.TEXT,
    allowNull: true
  },
  type: {
    type: Sequelize.TEXT,
    allowNull: true
  },
  level: {
    type: Sequelize.INTEGER,
    allowNull: true
  },
  atk: {
    type: Sequelize.INTEGER,
    allowNull: true
  },
  def: {
    type: Sequelize.INTEGER,
    allowNull: true
  },
  description: {
    type: Sequelize.TEXT,
    allowNull: true
  },
  date: {
    type: Sequelize.DATE,
    allowNull: true
  }
})

module.exports = Card
