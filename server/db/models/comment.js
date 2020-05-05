const Sequelize = require('sequelize')
const db = require('../db')

const Comment = db.define('comment', {
  body: {
    type: Sequelize.TEXT,
    allowNull: true
  }
})

module.exports = Comment
