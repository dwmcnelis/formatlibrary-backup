
const Sequelize = require('sequelize')
const db = require('../db')

const Event = db.define('events', {
    name: {
        type: Sequelize.STRING
    },
    abbreviation: {
        type: Sequelize.STRING
    },
    format: {
        type: Sequelize.STRING
    },
    formatId: {
        type: Sequelize.STRING
    },
    referenceUrl: {
        type: Sequelize.STRING
    },
    tournamentId: {
        type: Sequelize.STRING
    },
    display: {
        type: Sequelize.BOOLEAN,   
        defaultValue: false
    },
    winner: {
        type: Sequelize.STRING
    },
    playerId: {
        type: Sequelize.STRING
    },
    size: {
        type: Sequelize.INTEGER
    },
    type: {
        type: Sequelize.STRING
    },
    series: {
        type: Sequelize.BOOLEAN
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
    startDate: {
        type: Sequelize.DATE
    },
    endDate: {
        type: Sequelize.DATE
    }
})

module.exports = Event