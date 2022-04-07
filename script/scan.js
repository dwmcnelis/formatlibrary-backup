'use strict'

import axios from 'axios'
import fs from 'fs'
import { Card, Format, Set, Print } from  '../server/db/models'
import sets from  '../static/sets.json'
import { Op } from  'sequelize'
import formats from  '../static/formats.json'
import {capitalize} from '../functions/utility'
import { tcgPlayerAPI } from  '../secrets'


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