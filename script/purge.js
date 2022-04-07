'use strict'

import axios from 'axios'
import fs from 'fs'
import { Card, Format, Set, Print } from  '../server/db/models'
import sets from  '../static/sets.json'
import { Op } from  'sequelize'
import formats from  '../static/formats.json'
import {capitalize} from '../functions/utility'
import { tcgPlayerAPI } from  '../secrets'


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