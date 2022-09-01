
const Sequelize = require('sequelize')
const db = require('../db')

const Player = db.define('players', {
    name: {
        type: Sequelize.STRING
    },
    email: {
        type: Sequelize.STRING
    },
    discordName: {
        type: Sequelize.STRING
    },
    discriminator: {
        type: Sequelize.STRING
    },
    discordId: {
        type: Sequelize.STRING
    },
    discordPfp: {
        type: Sequelize.STRING
    },
    googleName: {
        type: Sequelize.STRING
    },
    googleId: {
        type: Sequelize.STRING
    },
    googlePfp: {
        type: Sequelize.STRING
    },
    duelingBook: {
        type: Sequelize.STRING
    },
    duelingBookPfp: {
        type: Sequelize.STRING
    },
    firstName: {
        type: Sequelize.STRING
    },
    lastName: {
        type: Sequelize.STRING
    },
    hash: {
        type: Sequelize.STRING
    },
    admin: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
    },
    hidden: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
    }
})

// Player.findByDiscordId = (id) => Player.findOne({ where: { discordId: id }})

// Player.resolveDiscord = async (user) => {
//     let existingPlayer = await Player.findOne({ 
//         where: { 
//             discordId: user.id
//         }
//     })

//     if (existingPlayer) {

//         await existingPlayer.update({
//             avatar: user.avatar
//         })

//         return existingPlayer

//     } else {
//         existingPlayer = await Player.findOne({ 
//             where: { 
//                 email: user.email    
//             }
//         })

//         if (existingPlayer) {

//             return existingPlayer
//         }
//     }

//    return await Player.create({})
// }

// Player.prototype.hide = () => this.update({ hidden: true })

module.exports = Player
