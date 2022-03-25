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


const countDuplicates = async () => {
    let a = 0
    let b = 0
    let c = 0
    const prints = await Print.findAll({ order: [["cardId", "ASC"]]})
    for (let i = 0; i < prints.length; i++) {
        const print = prints[i]
        const countA = await Print.count({ 
            where: {
                tcgPlayerProductId: print.tcgPlayerProductId,
                tcgPlayerUrl: print.tcgPlayerUrl
        }})

        const countB = await Print.count({ 
            where: {
                tcgPlayerProductId: print.tcgPlayerProductId
        }})

        const countC = await Print.count({ 
            where: {
                tcgPlayerUrl: print.tcgPlayerUrl
        }})

        if (countA > 1) {
            const duplicates = await Print.findAll({ 
                where: {
                    tcgPlayerProductId: print.tcgPlayerProductId,
                    tcgPlayerUrl: print.tcgPlayerUrl
            }})

            for (let j = 0; j < duplicates.length; j++) {
                console.log('Type A Duplicate:', duplicates[j].dataValues)
            }

            a++
        }
        
        if (countB > 1) {
            const duplicates = await Print.findAll({ 
                where: {
                    tcgPlayerProductId: print.tcgPlayerProductId
            }})

            for (let j = 0; j < duplicates.length; j++) {
                console.log('Type B Duplicate:', duplicates[j].dataValues)
            }

            b++
        }

        if (countC > 1) {
            const duplicates = await Print.findAll({ 
                where: {
                    tcgPlayerUrl: print.tcgPlayerUrl
            }})

            for (let j = 0; j < duplicates.length; j++) {
                console.log('Type C Duplicate:', duplicates[j].dataValues)
            }

            c++
        }
    }

    return console.log(`found ${a} double duplicates, ${b} productId duplicates, ${c} tcgPlayerUrl duplicates`)
}

countDuplicates()