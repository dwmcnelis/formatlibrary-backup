'use strict'

const axios = require('axios')
const fs = require('fs')
const { Card, Format, Set, Print } = require('../server/db/models')
const ygoprodeck = require('../static/ygoprodeck.json')
const sets = require('../static/sets.json')
const { Op } = require('sequelize')
const formats = require('../static/formats.json') 
const discordformats = require('../static/discordformats.json') 
const {capitalize} = require('../functions/utility')
const { tcgPlayerAPI } = require('../secrets') 


const purge = async () => {
    let c = 0

    const prints = await Print.findAll({
        where: {
            setName: {[Op.iLike]: `Yu-Gi-Oh! 5D's Tag Force 4 promotional cards`},
            rarity: 'Super Rare'
        }
    })

    for (let i = 0; i < prints.length; i++) {
        const print = prints[i]
        console.log('DESTROYING print', print.dataValues)
        await print.destroy()
        c++
    }

    return console.log(`destroyed ${c} prints`)
}

purge()