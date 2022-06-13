
const Sequelize = require('sequelize')
const db = require('../db')

const Tournament = db.define('tournaments', {
    id: {
        primaryKey: true,
        type: Sequelize.STRING
    },
    name: {
        type: Sequelize.STRING
    },
    url: {
        type: Sequelize.STRING
    },
    format: {
        type: Sequelize.STRING
    },
    type: {
        type: Sequelize.STRING
    },
    state: {
        type: Sequelize.STRING
    },
    community: {
        type: Sequelize.STRING
    },
    logo: {
        type: Sequelize.STRING
    },
    emoji: {
        type: Sequelize.STRING
    },
    channelId: {
        type: Sequelize.STRING
    },
    serverId: {
        type: Sequelize.STRING
    }
})

module.exports = Tournament