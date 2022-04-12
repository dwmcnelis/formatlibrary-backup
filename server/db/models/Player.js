
const Sequelize = require('sequelize')
const db = require('../db')

const Player = db.define('players', {
    id: {
        primaryKey: true,
        type: Sequelize.STRING,
        allowNull: false
    },
    name: {
        type: Sequelize.STRING,
        allowNull: true
    },
    tag: {
        type: Sequelize.STRING,        
        allowNull: true
    },
    duelingBook: {
        type: Sequelize.STRING,
        allowNull: true
    },
    password: {
        type: Sequelize.STRING,
        allowNull: true
    },
    avatar: {
        type: Sequelize.STRING,
        allowNull: true
    },
    blacklisted: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: true
    }
})

module.exports = Player
