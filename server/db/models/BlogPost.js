
const Sequelize = require('sequelize')
const db = require('../db')

const BlogPost = db.define('blogposts', {
  title: {
    type: Sequelize.STRING
  },
  content: {
      type: Sequelize.TEXT
  },
  author: {
    type: Sequelize.STRING
  },
  format: {
    type: Sequelize.STRING
  },
  publishDate: {
    type: Sequelize.STRING
  },
  playerId: {
      type: Sequelize.STRING
  },
  eventDate: {
      type: Sequelize.DATE
  }
})

module.exports = BlogPost