'use strict'

const axios = require('axios')
const fs = require('fs')
const { BlogPost, Card, Deck, DeckThumb, DeckType, Event, Format, Player, Print, Set, Stats, Status, Tournament } = require('../server/db/models')
const ygoprodeck = require('../static/ygoprodeck.json')
const sets = require('../static/sets.json')
const { Op } = require('sequelize')
const formats = require('../static/formats.json')
const { capitalize, arrayToObject } = require('../functions/utility')
const { challongeAPIKeys, tcgPlayerAPI } = require('../secrets')
const { 
    accum, aggolem, airbellum, alius, alo, andal, angel, archfiend, arma, artemis, barrel, batteries, bazoo, bear, ben_kei, bfadd, bigbang, bigshield, blackgarden, blade,
    bls, boomboxen, brain, bubbleman, bushi, bwc, caius, canceller, cannon, cardd, castor, cat, catapult, celfon, chariot, codarus, coelacanth, 
    consonance, convulsion, countdown, cstrike, cyjar, dad, dda, ddwl, debris, decree, desserts, difu, dfissure, diva, dmoc, dragonfly, drain, 
    drastic, driver, duplication, economics, emissary, emmersblade, exodia, factory, fate, faultroll, fert, fire, firedog, fishborg, 
    fortress, freed, fulhelm, fusi, fusiongate, garden, gate, gateway, gbind, gearframe, gearfried, germ, ggadget, gigantes, 
    gkass, gkspear, goblin, gobzomb, gorilla, gotss, gozen, granmarg, grepher, gspark, hblast, hornet, horus6, horus8, 
    icarus, infarchfiend, infestation, isword, jdrag, kabaz, kalut, kinka, koala, kmdrago, kristya, lacooda, laquari, lastturn, lava, leftarm, leftleg, 
    life, limiter, linde, llab, lonefire, luminous, lv2, mali, mandragora, manju, mask, mataza, meanae, 
    megamorph, meta, mezuki, mimic, miracle, mjar, mobius, mof, monk, moray, motr, natures, necromancer, necrofear, necrovalley, 
    needle, nightass, oath, panda, piper, pollux, poison, priestess, purity, queen, quickdraw, rabbit, raiza, rat, reaper, reasoning, recharge, redmd, 
    rejuv, rekindling, relinq, remoten, rightarm, rightleg, rivalry, rftdd, rml, rota, sabersaurus, salvo, scapegoat, scarabs, scientist, sdm, 
    seahorse, secrets, serpent, shallow, shark, sheratan, sirocco, slate, slump, smoke, solemn, solidarity, sorc, soulex, soulrel, 
    sphere, spy, ssunited, stealth, stein, storm, street, strike, swapfrog, taiyou, tdrag, tethys, thanksgiving, thestalos, thunderbird, tiger, 
    tomato, tooncannon, tradein, treeborn, trio, trunade, tsuk, tuningware, turtle, underdog, valhalla, vayu, vrocket, 
    whirlwind, wicked, will, wmc, worl, wur, yata, zaloog, zanji, zombyra, zorc
} = require('../static/cards.json')
const { Events } = require('pg')

/*eslint-disable*/
const print = async () => {
    const { data } = ygoprodeck
    for (let i = 0; i < data.length; i++) {
        try {
            const d = data[i]
            const card = await Card.findOne({ where: { ypdId: d.id.toString() }})
            if (!card) continue
            const card_sets = d.card_sets || []
            for (let j = 0; j < card_sets.length; j++) {
                const { set_code, set_name, set_price, set_rarity_code } = card_sets[j]
                const count = await Print.findOne({ where: { cardCode: set_code } })
                if (count) continue
                console.log('CREATING PRINT FOR', d.name)
                await Print.create({
                    cardName: card.name,
                    cardCode: set_code,
                    setName: set_name,
                    rarity: set_rarity_code.slice(1, -1),
                    marketPrice: set_price,
                    cardId: card.id
                })
            }
        } catch (err) {
            console.log(err)
        }
    }

    return console.log('complete')
 }

const download = async () => {
    console.log('downloading...')
    const { data } = await axios.get(`https://db.ygoprodeck.com/api/v7/cardinfo.php?misc=Yes`) || {}
    if (!data) return ('unable to connect to ygoprodeck.com')
    
    fs.writeFile("./static/ygoprodeck.json", JSON.stringify(data), (err) => { 
		if (err) console.log(err)
	})

	console.log(`Successfully consted the latest data = require(ygoprodeck.com.`)
}

const images = async () => {
    const { data } = ygoprodeck
    let count = 0
    
    for (let i = 0; i < data.length; i++) {
        const d = data[i]
        const exists = fs.existsSync(`./public/images/cards/${d.id}.jpg`)
        
        if (exists) {
            console.log(`PATH EXISTS for ${d.id}.jpg`)
            continue
        }

		const url = `https://ygoprodeck.com/pics/${d.id}.jpg`
		const writer = fs.createWriteStream(`./public/images/cards/${d.id}.jpg`)

		const response = await axios({
			url,
			method: 'GET',
			responseType: 'stream'
		})

        if (!response) {
            console.log('NO RESPONSE FOR', d.name)
            continue
        }

		const success = await response.data.pipe(writer)
        if (success) count++
		console.log(`${d.name} - ${success ? 'success' : 'FAIL'}`)
	}

	console.log(`Successfully consted high quality images for ${count} missing cards = require(YGOPRODeck.`)
}

const deleteBetaIds = async () => {
    const { data } = ygoprodeck
    for (let i = 0; i < data.length; i++) {
        try {
            const d = data[i]
            if (d.type === 'Token') {
                console.log('TOKEN')
                continue
            } else if (d.type === 'Skill Card') {
                console.log('SKILL CARD')
                continue
            }

            const misc_info = d.misc_info[0]
            if (!misc_info) {
                console.log('MISSING MISC_INFO:', d)
                continue
            }

            if (!misc_info.beta_id || d.id === misc_info.beta_id) continue
            const betaCard = await Card.findOne({ where: { konamiCode: misc_info.beta_id.toString() }})
            if (!betaCard) continue
            const fixedCard = await Card.findOne({ where: { konamiCode: d.id.toString() }})

            if (!fixedCard) {
                console.log(misc_info.beta_name, 'IS MISSING ITS FIXED CARD:', d.name)
            } else if (betaCard.id !== fixedCard.id) {
                const prints = [...await Print.findAll({
                    where: {
                        cardId: betaCard.id
                    }
                })]

                for (let i = 0; i < prints.length; i++) {
                    const p = prints[i]
                    await p.destroy()
                }

                await betaCard.destroy()
                console.log('DESTROYED BETA CARD', misc_info.beta_name, 'AND KEPT', d.name)
            }

        } catch (err) {
            console.log(err)
        }
    }
}
    
            

const fix = async () => {
    const { data } = ygoprodeck
    for (let i = 0; i < data.length; i++) {
        try {
            const d = data[i]
            if (d.type === 'Token') {
                console.log('TOKEN')
                continue
            } else if (d.type === 'Skill Card') {
                console.log('SKILL CARD')
                continue
            }

            const misc_info = d.misc_info[0]
            if (!misc_info) {
                console.log('MISSING MISC_INFO:', d)
                continue
            }

            let card = await Card.findOne({ where: { name: d.name.toString() }}) || await Card.findOne({ where: { konamiCode: d.id.toString() }})
            if (!card && misc_info.beta_name) card = await Card.findOne({ where: { name: misc_info.beta_name }})
            if (!card && misc_info.beta_id) card = await Card.findOne({ where: { konamiCode: misc_info.beta_id.toString() }})

            if (!card) {
                if (!misc_info.tcgDate) {
                    console.log('NO TCG_DATE FOR MISSING CARD:', d)
                    const image_file = `${d.id}.jpg`
                    const name = d.name
                    let konamiCode = d.id
                    while (konamiCode.length < 8) konamiCode = '0' + konamiCode
                    const category = d.type.includes('Monster') ? 'Monster' : d.type.includes('Spell') ? 'Spell' : 'Trap'
                    const tcgLegal = misc_info.formats.includes('TCG')
                    const ocgLegal = misc_info.formats.includes('OCG')
                    const icon = category === 'Spell' || category === 'Trap' ? d.race : null
                    const normal = category === 'Monster' && d.type.includes('Normal')
                    const effect = category === 'Monster' && d.type.includes('Effect')
                    const fusion = category === 'Monster' && d.type.includes('Fusion')
                    const ritual = category === 'Monster' && d.type.includes('Ritual')
                    const synchro = category === 'Monster' && d.type.includes('Synchro')
                    const xyz = category === 'Monster' && d.type.includes('Xyz')
                    const pendulum = category === 'Monster' && d.type.includes('Pendulum')
                    const link = category === 'Monster' && d.type.includes('Link')
                    const flip = category === 'Monster' && d.type.includes('Flip')
                    const gemini = category === 'Monster' && d.type.includes('Gemini')
                    const spirit = category === 'Monster' && d.type.includes('Spirit')
                    const toon = category === 'Monster' && d.type.includes('Toon')
                    const tuner = category === 'Monster' && d.type.includes('Tuner')
                    const union = category === 'Monster' && d.type.includes('Union')
                    const attribute = d.attribute
                    const type = category === 'Monster' ? d.race : null
                    const level = d.level || d.rank
                    const rating = d.linkVal
                    const scale = d.scale
                    const atk = d.atk
                    const def = d.def
                    const description = d.desc
                    const tcgDate = misc_info.tcg_date || null
                    const ocgDate = misc_info.ocg_date || null
                    let arrows = null
                    if (misc_info.linkmarkers && misc_info.linkmarkers.length) {
                        arrows = ''
                        misc_info.linkmarkers.forEach((lm) => arrows += `-${lm.charAt(0)}`)
                        arrows = arrows.slice(1)
                    }
                    
                    try {
                        await Card.create({
                            name,
                            konamiCode,
                            tcgLegal,
                            ocgLegal,
                            image_file,
                            category,
                            icon,
                            normal,
                            effect,
                            fusion,
                            ritual,
                            synchro,
                            xyz,
                            pendulum,
                            link,
                            flip,
                            gemini,
                            spirit,
                            toon,
                            tuner,
                            union,
                            attribute,
                            type,
                            level,
                            rating,
                            scale,
                            arrows,
                            atk,
                            def,
                            description,
                            tcgDate,
                            ocgDate
                        })
                    } catch (err) {
                        console.log(err)
                    }
                    
                    continue
                } else {
                    console.log('COMPLETELY MISSING CARD:', d)
                    continue
                }
            } else {
                let konamiCode = d.id
                while (konamiCode.length < 8) konamiCode = '0' + konamiCode
                card.name = d.name
                card.konamiCode = konamiCode
                card.tcgDate = misc_info.tcg_date
                card.ocgDate = misc_info.ocg_date
                console.log('SAVING:', card.name)
                if (card.tcgDate === true) console.log(card.name, 'card.tcgDate === true')
                if (card.ocgDate === true) console.log(card.name, 'card.ocgDate === true')
                await card.save()
            }            
        } catch (err) {
            console.log(err)
        }
    }

}

const generateYpdIds = async () => {
    const cards = await Card.findAll()
    for (let i = 0; i < cards.length; i++) {
        const c = cards[i]
        const ypdId = parseInt(c.konamiCode).toString()
        c.ypdId = ypdId
        console.log('saving', ypdId)
        await c.save()
    }
}

const findIllegalKonamiCodes = async () => {
    const cards = await Card.findAll()
    for (let i = 0; i < cards.length; i++) {
        const c = cards[i]
        if (c.ypdId.length > 8) {
            console.log(c.name, c.ypdId, '> 8')
            continue
        }
    }
}


const destroyIllegalKonamiCodeCards = async () => {
    const cards = await Card.findAll()
    for (let i = 0; i < cards.length; i++) {
        const card = cards[i]
        if (card.ypdId.length > 8) {
            console.log(card.name, card.ypdId, '> 8')
            const prints = [...await Print.findAll({
                where: {
                    cardId: card.id
                }
            })]

            for (let i = 0; i < prints.length; i++) {
                const p = prints[i]
                await p.destroy()
            }

            console.log('DESTROYING ILLEGAL CARD', card.name)
            await card.destroy()
        }
    }
}

const fixKonamiCodes = async () => {
    const cards = await Card.findAll()
    for (let i = 0; i < cards.length; i++) {
        const c = cards[i]
        if (c.ypdId.length >= 8) continue
        let konamiCode = c.ypdId.toString()
        while (konamiCode.length < 8) konamiCode = '0' + konamiCode
        c.konamiCode = konamiCode
        console.log('saving', konamiCode)
        await c.save()
    }
}

const deleteSkillCardsAndTokens = async () => {
    const { data } = ygoprodeck
    for (let i = 0; i < data.length; i++) {
        const d = data[i]
        if (d.type === 'Token') {
            const card = await Card.findOne({ where: { name: d.name }})
            if (!card) {
                console.log('TOKEN', d.name, 'IS NOT IN THE DATABASE')
                continue
            } else {
                const prints = [...await Print.findAll({
                    where: {
                        cardId: card.id
                    }
                })]

                for (let i = 0; i < prints.length; i++) {
                    const p = prints[i]
                    await p.destroy()
                }

                await card.destroy()
                console.log('DESTROYED TOKEN', d.name)
            }
        } else if (d.type === 'Skill Card') {
            const card = await Card.findOne({ where: { name: d.name }})
            if (!card) {
                console.log('SKILL CARD', d.name, 'IS NOT IN THE DATABASE')
                continue
            } else {
                const prints = [...await Print.findAll({
                    where: {
                        cardId: card.id
                    }
                })]

                for (let i = 0; i < prints.length; i++) {
                    const p = prints[i]
                    await p.destroy()
                }

                await card.destroy()
                console.log('DESTROYED SKILL CARD', d.name)
            }
        }
    }
}

const deleteCardsNotYetReleased = async () => {
    const cards = await Card.findAll({
        where: {
            [Op.and]: [
                { tcgDate: { [Op.or]: [ {[Op.is]: null}, {[Op.gt]: '2022-03-03'}] } },
                { ocgDate: { [Op.or]: [ {[Op.is]: null}, {[Op.gt]: '2022-03-03'}] } }
            ]
        },
        order: [['name', 'ASC']]
    })

    for (let i = 0; i < cards.length; i++) {
        const card = cards[i]
        const prints = [...await Print.findAll({
            where: {
                cardId: card.id
            }
        })]

        for (let i = 0; i < prints.length; i++) {
            const p = prints[i]
            await p.destroy()
        }

        await card.destroy()
        console.log('DESTROYED NOT YET RELEASED CARD', card.name)
    }

    return  
}

const deleteDuplicates = async () => {
    const cards = await Card.findAll({
        order: [['name', 'ASC'], ['id', 'ASC']]
    })

    for (let i = 1; i < cards.length; i++) {
        const prevCard = cards[i - 1]
        const currCard = cards[i]
        if (prevCard.name === currCard.name) {
            const prints = [...await Print.findAll({
                where: {
                    cardId: currCard.id
                }
            })]
    
            for (let i = 0; i < prints.length; i++) {
                const p = prints[i]
                await p.destroy()
            }

            console.log('DESTROYING DUPLICATE CARD', currCard.name, currCard.id)
            await currCard.destroy()
        }
        
    }

    return  
}

const fixArrows = async () => {
    const { data } = ygoprodeck
    for (let i = 0; i < data.length; i++) {
        const d = data[i]
        if (d.type.includes('Link')) {
            console.log('LINK MONSTER')
            const card = await Card.findOne({
                where: {
                    name: d.name,
                    link: true,
                    arrows: null
                }
            })

            if (!card) continue
        
            console.log('card.name', card.name)
            let arrows = ''
            if (d.linkmarkers && d.linkmarkers.length) {
                d.linkmarkers.forEach((lm) => arrows += `-${lm.charAt(0)}`)
                card.arrows = arrows.slice(1)
            } else {
                console.log('MISSING LINK MARKERS????')
                continue
            }
            

            console.log('UPDATING LINK MARKERS', card.name)
            await card.save() 
        }
    }
}

const fixRating = async () => {
    const { data } = ygoprodeck
    for (let i = 0; i < data.length; i++) {
        const d = data[i]
        if (d.type.includes('Link')) {
            console.log('LINK MONSTER')
            const card = await Card.findOne({
                where: {
                    name: d.name,
                    link: true,
                    rating: null
                }
            })

            if (!card) continue
        
            console.log('card.name', card.name)
            const rating = d.linkval
            if (!rating) {
                console.log('MISSING RATING???')
                continue
            }
            card.rating = rating
            console.log('UPDATING LINK RATING', card.name)
            await card.save() 
        }
    }
}

const fixScale = async () => {
    const { data } = ygoprodeck
    for (let i = 0; i < data.length; i++) {
        const d = data[i]
        if (d.type.includes('Pendulum')) {
            console.log('PENDULUM MONSTER')
            const card = await Card.findOne({
                where: {
                    name: d.name,
                    pendulum: true,
                    scale: null
                }
            })

            if (!card) continue
        
            console.log('card.name', card.name)
            const scale = d.scale
            if (!scale) {
                console.log('MISSING SCALE???')
                continue
            }
            card.scale = scale
            console.log('UPDATING PENDULUM SCALE', card.name)
            await card.save() 
        }
    }
}

const logDuplicatePrints = async () => {
    const prints = await Print.findAll({ order: [["cardId", "ASC"]]})
    for (let i = 0; i < prints.length; i++) {
        const print = prints[i]
        const count = await Print.count({ where: {
            cardName: print.cardName,
            rarity: print.rarity,
            setName: print.setName,
            cardId: print.cardId
        }})

        if (count > 1) {
            console.log('print.cardCode', print.cardCode)
        }
    }

    return console.log('complete')
}


const purgeExactDuplicates = async () => {
    const prints = await Print.findAll({ order: [["cardId", "ASC"]]})
    for (let i = 0; i < prints.length; i++) {
        const print = prints[i]
        const count = await Print.count({ where: {
            cardName: print.cardName,
            cardCode: print.cardCode,
            rarity: print.rarity,
            setName: print.setName,
            cardId: print.cardId,
            tcgPlayerProductId: print.tcgPlayerProductId,
            tcgPlayerUrl: print.tcgPlayerUrl
        }})

        if (count > 1) {
            console.log('DESTROYING print.cardCode', print.cardCode)
            await print.destroy()
        }
    }

    return console.log('complete')
}

const purgePortuguese = async () => {
    const prints = await Print.findAll({ where: {
        setName: { [Op.substring]: '(POR)' }
    }})

    for (let i = 0; i < prints.length; i++) {
        const print = prints[i]
        console.log('DESTROYING print.cardCode', print.cardCode)
        await print.destroy()
    }

    return console.log('complete')
}

const purgeOldSetDuplicates = async () => {
    const oldSets = [
        "LOB",
        "MRD",
        "MRL",
        "SRL",
        "PSV",
        "LON",
        "LOD",
        "PGD",
        "DCR",
        "MFC",
        "IOC",
        "AST",
        "SDK",
        "SDY",
        "SDJ",
        "SDP",
        "TP1",
        "PCY",
        "DOR",
        "PCK",
        "DL2"
    ]

    for (let i = 0; i < oldSets.length; i++) {
        let c = 0
        const oldSet = oldSets[i]

        const prints = await Print.findAll({
            where: {
                cardCode: {[Op.startsWith]: `${oldSet}-E`}
            }
        })

        for (let j = 0; j < prints.length; j++) {
            const print = prints[j]
            await print.destroy()
            c++
        }

        console.log(`Destroyed ${c} duplicate prints for ${oldSet}`)
    }
}

const createSets = async () => {
    let c = 0
    for (let i = 0; i < sets.length; i++) {
        const set = sets[i]
        try {
            await Set.create({
                setName: set.set_name,
                setCode: set.set_code,
                tcgDate: set.tcg_date,
                size: set.num_of_cards
            })

            c++
        } catch (err) {
            console.log(err)
            console.log(`error for set: ${set.set_name}`)
        }
    }

    return console.log(`created ${c} new sets`)
}

const linkSets = async () => {
    let c = 0
    const prints = await Print.findAll({ where: {
        setId: null
    }})
    
    for (let i = 0; i < prints.length; i++) {
        const print = prints[i]
        const set = await Set.findOne({ where: {
            setName: print.setName
        }})

        if (!set) {
            console.log(`no set for ${print.setName}`)
            continue
        }

        print.setId = set.id
        await print.save()
        c++
    }

    return console.log(`updated ${c} prints with setIds`)
}

const modifyRarities = async () => {
    let a = 0
    let b = 0
    let c = 0
    const prints = await Print.findAll({
        order: [['rarity', 'ASC']]
    })
    
    for (let i = 0; i < prints.length; i++) {
        const print = prints[i]
        const rarity = print.rarity
        const validRarities = [
            '10000 Secret Rare',
            'Common',
            `Collector's Rare`,
            'DT Normal Parallel Rare',
            'DT Rare Parallel Rare',
            'DT Super Parallel Rare',
            'DT Ultra Parallel Rare',
            'Ghost/Gold Rare',
            'Ghost Rare',
            'Gold Secret Rare',
            'Gold Rare',
            'Mosaic Rare',
            'Normal Parallel Rare',
            'Premium Gold Rare',
            'Platinum Rare',
            'Platinum Secret Rare',
            'Prismatic Secret Rare',
            'Rare',
            'Starfoil Rare',
            'Shatterfoil Rare',
            'Short Print',
            'Super Rare',
            'Super Short Print',
            'Secret Rare',
            'Starlight Rare',
            'Ultra Parallel Rare',
            'Ultra Rare',
            'Ultimate Rare'
        ]
        if (validRarities.includes(rarity)) {
            a++
            continue
        }
        if (rarity === 'C') {
            print.rarity = 'Common'
            await print.save()
            b++
        } else if (rarity === 'CR') {
            print.rarity = `Collector's Rare`
            await print.save()
            b++
        } else if (rarity === 'DTNR') {
            print.rarity = 'DT Normal Parallel Rare'
            await print.save()
            b++
        } else if (rarity === 'DRPR') {
            print.rarity = 'DT Rare Parallel Rare'
            await print.save()
            b++
        } else if (rarity === 'DSPR') {
            print.rarity = 'DT Super Parallel Rare'
            await print.save()
            b++
        } else if (rarity === 'DUPR') {
            print.rarity = 'DT Ultra Parallel Rare'
            await print.save()
            b++
        } else if (rarity === 'GGR') {
            print.rarity = 'Ghost/Gold Rare'
            await print.save()
            b++
        } else if (rarity === 'GR') {
            print.rarity = 'Ghost Rare'
            await print.save()
            b++
        } else if (rarity === 'GScR') {
            print.rarity = 'Gold Secret Rare'
            await print.save()
            b++
        } else if (rarity === 'GUR') {
            print.rarity = 'Gold Rare'
            await print.save()
            b++
        } else if (rarity === 'MSR') {
            print.rarity = 'Mosaic Rare'
            await print.save()
            b++
        } else if (rarity === 'PG') {
            print.rarity = 'Premium Gold Rare'
            await print.save()
            b++
        } else if (rarity === 'PIR') {
            print.rarity = 'Platinum Rare'
            await print.save()
            b++
        } else if (rarity === 'PIR') {
            print.rarity = 'Platinum Secret Rare'
            await print.save()
            b++
        } else if (rarity === 'PScR') {
            print.rarity = 'Prismatic Secret Rare'
            await print.save()
            b++
        } else if (rarity === 'R') {
            print.rarity = 'Rare'
            await print.save()
            b++
        } else if (rarity === 'SFR') {
            print.rarity = 'Starfoil Rare'
            await print.save()
            b++
        } else if (rarity === 'SHR') {
            print.rarity = 'Shatterfoil Rare'
            await print.save()
            b++
        } else if (rarity === 'SP') {
            print.rarity = 'Short Print'
            await print.save()
            b++
        } else if (rarity === 'SR') {
            print.rarity = 'Super Rare'
            await print.save()
            b++
        } else if (rarity === 'SSP') {
            print.rarity = 'Super Short Print'
            await print.save()
            b++
        } else if (rarity === 'ScR') {
            print.rarity = 'Secret Rare'
            await print.save()
            b++
        } else if (rarity === 'StR') {
            print.rarity = 'Starlight Rare'
            await print.save()
            b++
        } else if (rarity === 'UPR') {
            print.rarity = 'Ultra Parallel Rare'
            await print.save()
            b++
        } else if (rarity === 'UR') {
            print.rarity = 'Ultra Rare'
            await print.save()
            b++
        } else if (rarity === 'UtR') {
            print.rarity = 'Ultimate Rare'
            await print.save()
            b++
        } else if (rarity === 'Duel Terminal Normal Parallel Rare') {
            print.rarity = 'DT Normal Parallel Rare'
            await print.save()
            b++
        } else if (rarity === 'Duel Terminal Rare Parallel Rare') {
            print.rarity = 'DT Rare Parallel Rare'
            await print.save()
            b++
        } else if (rarity === 'Duel Terminal Super Parallel Rare') {
            print.rarity = 'DT Super Parallel Rare'
            await print.save()
            b++
        } else if (rarity === 'Duel Terminal Ultra Parallel Rare') {
            print.rarity = 'DT Ultra Parallel Rare'
            await print.save()
            b++
        } else if (rarity === 'DNPR') {
            print.rarity = 'DT Normal Parallel Rare'
            await print.save()
            b++
        } else if (rarity === 'Duel Terminal Technology Common') {
            print.rarity = 'DT Normal Parallel Rare'
            await print.save()
            b++
        } else if (rarity === 'Duel Terminal Technology Ultra Rare') {
            print.rarity = 'DT Ultra Parallel Rare'
            await print.save()
            b++
        } else if (rarity === 'UScR') {
            print.rarity = 'Secret Rare'
            await print.save()
            b++
        } else if (rarity === 'PS') {
            print.rarity = 'Platinum Secret Rare'
            await print.save()
            b++
        } else if (rarity === 'Parallel Rare') {
            print.rarity = 'Normal Parallel Rare'
            await print.save()
            b++
        } else {
            console.log('invalid rarity', rarity)
            console.log(print.dataValues)
            c++ 
            continue
        }
    }

    return console.log(`\n- encountered ${a} valid rarities\n- updated ${b} prints with modified rarities\n- encountered ${c} invalid rarities`)
}

// const seedFormats = async () => {
//     let c = 0
//     const keys = Object.keys(discordformats)
//     for (let i = 0; i < keys.length; i++) {
//         const key = keys[i]
//         const format = discordformats[key]
//         try {
//             await Format.create({
//                 name: format.name,
//                 date: format.date,
//                 banlist: format.list,
//                 channel: format.channel,
//                 emoji: format.emoji,
//                 role: format.role
//             })
//             c++
//         } catch (err) {
//             console.log(err)
//         }
//     }

//     return console.log(`created ${c} Formats`)
// }

const addIconsAndEvents = async () => {
    let c = 0
    const sqlFormats = await Format.findAll()
    for (let i = 0; i < sqlFormats.length; i++) {
        const format = sqlFormats[i]
        const entry = formats[format.name]
        if (!entry) {
            console.log(`no entry for ${format.name}`)
            continue
        } else try {
            format.event = entry.event
            format.icon = entry.logo
            await format.save()
            c++
        } catch (err) {
            console.log(err)
        }
    }

    return console.log(`updated ${c} Formats`)
}


const purgeShortPrintDuplicates = async () => {
    const prints = await Print.findAll({
        where: {
            rarity: 'Common'
        }
    })
    for (let i = 0; i < prints.length; i++) {
        const print = prints[i]
        const count = await Print.count({ 
            where: {
                cardName: print.cardName,
                cardCode: print.cardCode,
                rarity: { [Op.or]: ['Short Print', 'Super Short Print'] },
                cardId: print.cardId
            }
        })

        if (count) {
            console.log('DESTROYING print.id', print.id)
            await print.destroy()
        }
    }

    return console.log('complete')
}

const capitalizeSetNames = async () => {
    const sets = await Set.findAll()
    for (let i = 0; i < sets.length; i++) {
        const set = sets[i]
        set.setName = set.setName.replace(' Of', ' of')
            .replace(' The', ' the')
            .replace(' From', ' from')
            .replace(' For', ' for')
            .replace(' By', ' by')
            .replace(' With', ' with')
            .replace(' A ', ' a ')
            .replace(' An', ' an')
            .replace(': the', ': The')
            .replace('! the', '! The')
        await set.save()
    }

    return console.log('complete')
}

const fixPrintSetIds = async () => {
    let c = 0
    const prints = await Print.findAll({
        where: {
            setId: null
        }
    })

    for (let i = 0; i < prints.length; i++) {
        const p = prints[i]
        const set = await Set.findOne({
            where: {
                setName: p.setName
            }
        })

        if (!set) continue
        p.setId = set.id
        await p.save()
        c++
    }

    return console.log(`updated ${c} prints`)
}


const fixDT06 = async () => {
    let c = 0
    const prints = await Print.findAll({
        where: {
            cardCode: {[Op.startsWith]: 'DT06'}
        }
    })

    for (let i = 0; i < prints.length; i++) {
        const p = prints[i]
        const index = parseInt(p.cardCode.slice(p.cardCode.indexOf('-EN' + 3)))
        if (index <= 50) {
            const set = await Set.findOne({
                where: {
                    setName: 'Duel Terminal 6a'
                }
            })

            if (!set) continue
            p.setName = set.setName
            p.setId = set.id
            await p.save()
            c++
        } else {
            const set = await Set.findOne({
                where: {
                    setName: 'Duel Terminal 6b'
                }
            })

            if (!set) continue
            p.setName = set.setName
            p.setId = set.id
            await p.save()
            c++
        }
    }

    return console.log(`updated ${c} prints`)
}


const fixObviousMissingSetIds = async () => {
    let c = 0
    const prints = await Print.findAll({
        where: {
            setId: null
        }
    })

    for (let i = 0; i < prints.length; i++) {
        const p = prints[i]
        const setCode = p.cardCode.slice(0, p.cardCode.indexOf('-'))
        const count = Set.count({
            where: {
                setCode: setCode
            }
        })

        if (count > 1) {
            console.log(`${p.setName} ${setCode} is not obv`) 
            continue
        } else {
            const set = await Set.findOne({
                where: {
                    setCode: setCode
                }
            })

            if (!set) {
                console.log(`missing set: ${p.setName}`)
                continue
            }

            p.setName = set.setName
            p.setId = set.id
            await p.save()
            c++
        }
    }

    return console.log(`updated ${c} prints`)
}

const removeWGRT = async () => {
    let c = 0
    const prints = await Print.findAll({
        where: {
            setName: 'War of the Giants Reinforcements'
        }
    })

    for (let i = 0; i < prints.length; i++) {
        const print = prints[i]
        await print.destroy()
        c++
    }

    return console.log(`destroyed ${c} prints`)
}

const fixCollectorsRares = async () => {
    let c = 0
    let z = 0

    const prints = await Print.findAll({
        where: {
            rarity: `Collector's Rare`
        }
    })
    
    for (let i = 0; i < prints.length; i++) {
        const print = prints[i]
        const productName = print.cardName + ' (CR)'
        console.log('productName', productName)
        try {
            const endpoint = `https://api.tcgplayer.com/v1.39.0/catalog/products?categoryId=2&productName=${productName}&getExtendedFields=true&limit=100`
            const { data } = await axios.get(endpoint, {
                headers: {
                    "Accept": "application/json",
                    "Authorization": `bearer ${tcgPlayerAPI.access_token}`
                }
            })

            if (!data) {
                console.log(`could not find data for printId ${print.id}`)
                continue
            }

            print.tcgPlayerUrl = data.results[0].url
            print.productId = data.results[0].productId
            await print.save()
            c++
        } catch (err) {
            console.log(err)
            z++
        }
    }
    
    return console.log(`added TCGPlayer data for ${c} prints\n- encountered ${z} errors`)
}


const fixAs = async () => {
    let c = 0
    let z = 0

    const prints = await Print.findAll({
        where: {
            setName: `Yugi's Legendary Decks`
        }
    })
    
    for (let i = 0; i < prints.length; i++) {
        const print = prints[i]
        const productName = print.cardName + ' (A)'
        console.log('productName', productName)
        try {
            const endpoint = `https://api.tcgplayer.com/v1.39.0/catalog/products?categoryId=2&productName=${productName}&getExtendedFields=true&limit=100`
            const { data } = await axios.get(endpoint, {
                headers: {
                    "Accept": "application/json",
                    "Authorization": `bearer ${tcgPlayerAPI.access_token}`
                }
            })

            if (!data) {
                console.log(`could not find data for printId ${print.id}`)
                continue
            }

            if (data.results.length > 1) {
                console.log(`more than 1 result ??????`)
                continue
            }

            print.tcgPlayerUrl = data.results[0].url
            print.productId = data.results[0].productId
            await print.save()
            c++
        } catch (err) {
            console.log(err)
            z++
        }
    }
    
    return console.log(`added TCGPlayer data for ${c} prints\n- encountered ${z} errors`)
}

const purgeEND = async () => {
    const prints = await Print.findAll({
        where: {

        }
    })
}


const fixHeros = async () => {
    let c = 0
    let z = 0

    const prints = await Print.findAll({
        where: {
            tcgPlayerProductId: null
        },
        order: [['cardName', 'ASC']]
    })

    console.log('prints.length', prints.length)
    
    for (let i = 0; i < prints.length; i++) {
        const print = prints[i]
        const productName = print.cardName + ` (${print.cardCode.slice(0, print.cardCode.indexOf('-'))})`
        console.log('productName', productName)
        try {
            const endpoint = `https://api.tcgplayer.com/v1.39.0/catalog/products?categoryId=2&productName=${productName}&getExtendedFields=true&limit=100`
            const { data } = await axios.get(endpoint, {
                headers: {
                    "Accept": "application/json",
                    "Authorization": `bearer ${tcgPlayerAPI.access_token}`
                }
            })

            if (!data) {
                console.log(`could not find data for printId ${print.id}`)
                continue
            }

            for (let i = 0; i < data.results.length; i++) {
                const result = data.results[i]
                const cardCode = result.extendedData[0].value
                const rarity = result.extendedData[1].value

                // if (rarity !== 'Shatterfoil Rare') {
                //     console.log('RESULT NOT Shatterfoil Rare???')
                //     continue
                // }

                if (cardCode !== print.cardCode) {
                    console.log(`cardCode ${cardCode} does not match print.cardCode ${print.cardCode}`)
                    continue
                }

                print.productId = result.productId
                print.tcgPlayerUrl = result.url
                await print.save()
                c++
            }
        } catch (err) {
            console.log(err)
            z++
        }
    }
    
    return console.log(`added TCGPlayer data for ${c} prints\n- encountered ${z} errors`)
}

const fixMissingProductIds = async () => {
    let c = 0
    let d = 0
    let w = 0
    const prints = await Print.findAll({
        where: {
            tcgPlayerUrl: {[Op.not]: null }
        }
    })

    for (let i = 0; i < prints.length; i++) {
        const print = prints[i]
        if (!print.tcgPlayerUrl.includes('https://www.tcgplayer.com/product/')) {
            console.log('strange tcgPlayerUrl')
            continue
        }
        const trunc = print.tcgPlayerUrl.slice(print.tcgPlayerUrl.indexOf('https://www.tcgplayer.com/product/') + 34)
        const productId = parseInt(trunc.slice(0, trunc.indexOf('/')))
        if (print.tcgPlayerProductId !== productId) {
            console.log(`changing productId to ${productId}: ${print.dataValues}`)
            print.tcgPlayerProductId = productId
            await print.save()
            c++
        } else {
            d++
            continue
        }
    }

    return console.log(`modified TCGPlayer data for ${c} prints\n-kept ${d} prints the same\n encountered ${w} weird tcgPlayerUrls`)
}


const fixGhosts = async () => {
    let c = 0
    let z = 0

    const prints = await Print.findAll({
        where: {
            rarity: `Super Rare`
        },
        order: [['cardName', 'ASC']]
    })
    
    for (let i = 0; i < prints.length; i++) {
        const print = prints[i]
        const productName = print.cardName + ` (SR)`
        console.log('productName', productName)
        try {
            const endpoint = `https://api.tcgplayer.com/v1.39.0/catalog/products?categoryId=2&productName=${productName}&getExtendedFields=true&limit=100`
            const { data } = await axios.get(endpoint, {
                headers: {
                    "Accept": "application/json",
                    "Authorization": `bearer ${tcgPlayerAPI.access_token}`
                }
            })

            if (!data) {
                console.log(`could not find data for printId ${print.id}`)
                continue
            }

            for (let i = 0; i < data.results.length; i++) {
                const result = data.results[i]
                const cardCode = result.extendedData[0].value
                const rarity = result.extendedData[1].value

                if (rarity !== `Super Rare`) {
                    console.log('RESULT NOT SUPER RARE???')
                    continue
                }

                if (cardCode !== print.cardCode) {
                    console.log(`cardCode ${cardCode} does not match print.cardCode ${print.cardCode}`)
                    continue
                }

                console.log(`FIXING SUPER RARE`)
                print.productId = result.productId
                print.tcgPlayerUrl = result.url
                await print.save()
                c++
            }
        } catch (err) {
            console.log(err)
            z++
        }
    }
    
    return console.log(`modified TCGPlayer data for ${c} prints\n- encountered ${z} errors`)
}

const addCardDetails = async () => {
    let a = 0
    const cards = await Card.findAll()
    for (let i = 0; i < cards.length; i++) {
        const card = cards[i]

        if (card.category === 'Trap') {
            card.color = 'violet'
            card.extraDeck = false
            card.sortPriority = 11
            await card.save()
            a++
        } else if (card.category === 'Spell') {
            card.color = 'green'
            card.extraDeck = false
            card.sortPriority = 10
            await card.save()
            a++
        } else if (card.category === 'Monster') {
            if (card.link) {
                card.color = 'dark-blue'
                card.extraDeck = true
                card.sortPriority = 9
                await card.save()
                a++
            } else if (card.pendulum && card.effect) {
                card.color = 'orange-green'
                card.extraDeck = false
                card.sortPriority = 8
                await card.save()
                a++
            } else if (card.pendulum && !card.effect) {
                card.color = 'yellow-green'
                card.extraDeck = false
                card.sortPriority = 7
                await card.save()
                a++
            } else if (card.xyz) {
                card.color = 'black'
                card.extraDeck = true
                card.sortPriority = 6
                await card.save()
                a++
            } else if (card.synchro) {
                card.color = 'white'
                card.extraDeck = true
                card.sortPriority = 5
                await card.save()
                a++
            } else if (card.ritual) {
                card.color = 'light-blue'
                card.extraDeck = false
                card.sortPriority = 4
                await card.save()
                a++
            } else if (card.fusion) {
                card.color = 'purple'
                card.extraDeck = true
                card.sortPriority = 3
                await card.save()
                a++
            } else if (card.effect) {
                card.color = 'orange'
                card.extraDeck = false
                card.sortPriority = 2
                await card.save()
                a++
            } else {
                card.color = 'yellow'
                card.extraDeck = false
                card.sortPriority = 1
                await card.save()
                a++
            } 
        }
    }

    return console.log(`updated ${a} cards`)
}


//GET DECK TYPE
const getDeckType = (raw = '', format = 'Goat') => {
    if (!raw.length) return
    const main = raw.split('#extra')[0]
    if (!main) return
    const arr = main.split('\n').filter(el => el.charAt(0) !== '#' && el.charAt(0) !== '!' && el !== '').sort()
    const ydk = arrayToObject(arr)

    const deckType = 
        (ydk[bubbleman] >= 2 && ydk[miracle] && !ydk[kabaz]) ? 'Bubble Beat' :
        (ydk[bubbleman] >= 2 && ydk[miracle] && ydk[kabaz] >= 2) ? 'Dino Hero' :
        (ydk[kinka] >= 2 && ydk[piper] >= 2 && (ydk[bls] || ydk[sorc])) ? 'Piper Chaos' :
        (ydk[hornet] && ydk[dragonfly] && ydk[isword]) ? 'Inzektor' :
        (ydk[pollux] >= 2 && ydk[sheratan] >= 2) ? 'Constellar' :
        (ydk[wur] >= 2 && ydk[thunderbird] >= 2 && (ydk[dfissure] || ydk[blackgarden])) ? 'Chain Beat' :
        (ydk[secrets] && ydk[fate] && ydk[priestess]) ? 'Spellbook' :
        (ydk[shark] >= 2 && ydk[factory] >= 2) ? 'Wind-Up' :
        (ydk[necromancer] && ydk[infarchfiend] && ydk[street]) ? 'Infernity' :
        (ydk[linde] >= 2 && ydk[sphere] >= 2) ? 'Mermail' :
        (ydk[castor] >= 2 && ydk[mandragora] >= 2 && ydk[infestation] >= 2) ? 'Evilswarm' :
        (ydk[rabbit] >= 2 && ydk[bear] >= 2 && !ydk[andal] && !ydk[sabersaurus] && !ydk[kabaz] >= 2) ? 'Fire Fist' :
        (ydk[rabbit] >= 2 && ydk[bear] >= 2 && ydk[andal] >= 2 && (ydk[sabersaurus] >= 2 || ydk[kabaz] >= 2)) ? 'Gladiator Dino Fist' :
        (ydk[rabbit] >= 2 && ydk[bear] >= 2 && !ydk[andal] && (ydk[sabersaurus] >= 2 || ydk[kabaz] >= 2)) ? 'Dino Fist' :
        (ydk[rabbit] >= 2 & ydk[bear] >= 2 && ydk[andal] >= 2 && !ydk[sabersaurus] && !ydk[kabaz]) ? 'Gladiator Fist' :
        (ydk[rabbit] >= 2 && !ydk[bear] && ydk[sabersaurus] >= 2 && ydk[kabaz] >= 2) ? 'Dino Rabbit' :
        (ydk[seahorse] >= 2 && ydk[batteries] >= 2) ? 'Thunder' :
        (ydk[scientist] && ydk[catapult] && ydk[will] >= 2) ? 'Scientist FTK' :
        (ydk[queen] && ydk[archfiend]) ? 'Archfiend' :
        (ydk[necrofear] && (ydk[germ] || ydk[slate])) ? 'Fiend' :
        (ydk[yata] && (ydk[zaloog] || ydk[reaper])) ? 'Hand Control' :
        (ydk[ddwl] >= 2 && ydk[rota] && (ydk[spy] || ydk[tomato])) ? 'Warrior Control' :
        (ydk[cat] >= 2 && ydk[wicked] >= 2) ? 'Cat Control' :
        (ydk[ben_kei] >= 2 && (ydk[trunade] >= 2 || ydk[decree] >= 2)) ? 'Ben Kei OTK' :
        (ydk[stein] >= 2 && ydk[gate] >= 2) ? 'Stein Gate Turbo' :
        (ydk[stein] >= 2 && !ydk[cat] && (ydk[megamorph] || ydk[natures] || ydk[thanksgiving]) && (ydk[trunade] >= 2 || ydk[decree] >= 2)) ? 'Stein OTK' :
        ((ydk[cyjar] || ydk[mjar]) && ydk[cardd] && ydk[taiyou] && ydk[shallow]) ? 'Empty Jar' :
        (ydk[rml] >= 2 && ydk[oath] >= 2 && ydk[convulsion] >= 2 && ydk[trunade] >= 2) ? 'Library FTK' :
        (ydk[exodia] && ydk[leftarm] && ydk[rightarm] && ydk[leftleg] && ydk[rightleg]) ? 'Exodia' :
        (!ydk[meta] && !ydk[scapegoat] && (ydk[turtle] >= 2 || ydk[life] >= 2 || (ydk[turtle] && ydk[life]))) ? 'Zombie' :
        (ydk[horus6] && ydk[meta] && ydk[scapegoat]) ? 'Horus Control' :
        (ydk[horus8] && ydk[horus6] && !ydk[scapegoat]) ? 'Horus Turbo' :
        (ydk[relinq] >= 2) ? 'Relinquished' :
        (ydk[zorc] >= 2) ? 'Zorc' :
        (ydk[lastturn] == 2) ? 'Last Turn' :
        (ydk[countdown] >= 2) ? 'Final Countdown' :
        (ydk[slump] >= 2) ? 'Heavy Slump' :
        (ydk[emissary] >= 2 && ydk[meta] >= 2) ? 'Emissary Control' :
        (ydk[emissary] >= 2 && (!ydk[meta] || ydk[meta] <= 1)) ? 'Emissary Beat' :
        (ydk[needle] >= 2 && (ydk[llab] || ydk[gbind] || ydk[worl])) ? 'Stall Deckout' :
        (ydk[meanae] >= 2) ? 'Dark Scorpion' :
        (ydk[strike] >= 2) ? 'Strike Ninja' :
        (ydk[dmoc] && ydk[economics] && (ydk[driver] || ydk[cannon] || ydk[tooncannon])) ? 'Economics FTK' :
        (ydk[fusiongate] >= 2) ? 'Fusion Gate Turbo' :
        (ydk[reasoning] && ydk[gate] && !ydk[economics]) ? 'Reasoning Gate Turbo' :
        ((ydk[bazoo] >= 2 || ydk[sorc] >= 2 || ydk[freed] >= 2 || ydk[strike] >= 2 || ydk[purity] >= 2 || ydk[soulrel] >= 2) && ydk[difu] >= 2) ? 'Dimension Fusion Turbo' :
        (ydk[limiter]) ? 'Machine' :
        ((ydk[freed] >= 2 || ydk[purity]) && ydk[rftdd] && !ydk[manju]) ? 'Light Return' :
        ((ydk[freed] >= 2 || ydk[luminous] || ydk[purity] >= 2) && !ydk[rftdd] && !ydk[manju]) ? 'Light Beat' :    
        (ydk[gearfried] >= 2 && (ydk[smoke] >= 2 || ydk[bwc] >= 2)) ? 'Gearfried' :
        (ydk[archfiend] >= 2 && (ydk[underdog] || ydk[drain])) ? 'Vanilla Beat' :
        ((ydk[zombyra] >= 2 || ydk[gorilla] >= 2 || ydk[goblin] >= 2 || ydk[fusi] >= 2 || ydk[sdm] >= 2) && ydk[drain] >= 2) ? 'Drain Beat' :
        ((ydk[dda] >= 2 || ydk[rat] >= 2) && ydk[gigantes] && !ydk[lacooda] && !ydk[scapegoat]) ? 'Earth Beat' :
        (ydk[panda] && ydk[rat] && ydk[trio]) ? 'Panda Burn' :
        (!ydk[panda] && !ydk[scarabs] && (ydk[llab] || ydk[gbind] || ydk[worl]) && (ydk[wmc] >= 2 || ydk[lava] >= 2 || ydk[stealth] >= 2)) ? 'Stall Burn' :
        (ydk[tsuk] >= 2 && (ydk[lacooda] >= 2 || ydk[mask] >= 2 || ydk[mimic] >= 2) && ydk[solemn] >= 2 && !ydk[scapegoat] && !ydk[meta] && !ydk[soulex] && !ydk[manju]) ? 'Flip Control' :
        (ydk[drain] >= 2 && !ydk[lacooda] && !ydk[scarabs] && (ydk[barrel] || ydk[desserts] || ydk[wmc] || ydk[lava])) ? 'Drain Burn' :
        (ydk[spy] && ydk[necrovalley] && (ydk[gkass] || ydk[gkspear])) ? 'Gravekeeper' :
        (ydk[lacooda] && ydk[scarabs] && (ydk[gbind] || ydk[llab] || ydk[worl])) ? 'PACMAN' :
        (ydk[scapegoat] && ydk[meta] && ydk[soulex] >= 2) ? 'Soul Control' :
        ((ydk[thestalos] >= 2 || ydk[mobius] >= 2 || ydk[granmarg] >= 2) && (ydk[brain] >= 2 || ydk[soulex] >= 2 || (ydk[brain] && ydk[soulex]))) ? 'Monarch' :
        (ydk[sorc] && ydk[rftdd] && (!ydk[angel] || !ydk[tomato]) && !ydk[serpent] && (!ydk[nightass] || ydk[nightass] <= 1)) ? 'Chaos Return' :
        (ydk[bazoo] >= 2 && ydk[rftdd]) ? 'Bazoo Return' :
        (ydk[canceller] >= 2 && ydk[solemn] >= 2) ? 'Canceller Stun' :
        (ydk[tiger] >= 2 && ydk[solemn] >= 2) ? 'Tiger Stun' :
        (ydk[scapegoat] && ydk[meta] && (ydk[wmc] >= 2 || ydk[lava] >= 2 || ydk[trio] >= 2 || ydk[stealth] >= 2)) ? 'Goat Burn' :
        (ydk[mataza] >= 2 && (ydk[koala] >= 2 || ydk[spy] >= 2) && ydk[storm]) ? 'Mataza Burn' :
        ((!ydk[llab] || ydk[llab] <= 1) && (!ydk[gbind] || ydk[gbind] <= 1) && (!ydk[worl] || ydk[worl] <= 1) && (ydk[koala] >= 2 || ydk[bigshield] >= 2) && (ydk[barrel] >= 2 || ydk[fire] >= 2 || ydk[poison] >= 2)) ? 'Speed Burn' :
        (ydk[sorc] && ydk[tomato] && ydk[angel] && !ydk[scapegoat] && !ydk[meta]) ? 'Chaos Recruiter' :
        (ydk[sorc] && ydk[rota] && ydk[solemn] >= 2) ? 'Chaos Warrior' :
        (!ydk[sorc] && ydk[rota] && (ydk[blade] || ydk[ddwl] || ydk[lv2]) && ydk[solemn] >= 2 && !ydk[llab] && !ydk[gbind] && !ydk[worl] && !ydk[freed]) ? 'Warrior' :
        (ydk[sorc] && ydk[tdrag] == 3 && ydk[mof] && !ydk[scapegoat]) ? 'Chaos Turbo' :
        (ydk[sorc] && ydk[scapegoat] && ydk[meta]) ? 'Chaos Control' :
        (!ydk[sorc] && ydk[scapegoat] && ydk[meta] && (!ydk[bigbang] || ydk[bigbang] <= 1)) ? 'Goat Control' :
        (ydk[kalut] && ydk[whirlwind] && ydk[icarus]) ? 'Blackwing' :
        (ydk[accum] && ydk[cstrike]) ? 'Chain Burn' :
        (ydk[diva] && ydk[mali] && ydk[miracle]) ? 'Diva Hero' :
        (ydk[alius] && (ydk[gspark] || ydk[hblast])) ? 'Hero Beat' :
        (ydk[redmd] && ydk[kmdrago] && !ydk[consonance] && !ydk[rejuv]) ? 'Dragon Beat' :
        (ydk[redmd] && ydk[consonance] && ydk[tradein] && !ydk[exodia]) ? 'Dragon Turbo' :
        (ydk[boomboxen] && ydk[celfon] && ydk[remoten]) ? 'Morphtronic' :
        (ydk[consonance] && ydk[rejuv] && ydk[exodia]) ? 'Exodia FTK' :
        (ydk[artemis] && ydk[drastic]) ? 'Counter Fairy' :
        (ydk[kristya] && ydk[ddwl] && ydk[angel]) ? 'Fairy Control' :
        (ydk[kristya] && ydk[tethys] && ydk[valhalla]) ? 'Fairy Turbo' :
        (ydk[kristya] && !ydk[tethys] && ydk[rivalry] && ydk[gozen]) ? 'Fairy Stun' :
        (ydk[coelacanth] && ydk[fishborg] && ydk[moray]) ? 'Fish OTK' :
        (ydk[firedog] && ydk[spy] && ydk[rekindling]) ? 'Flamvell' :
        (ydk[swapfrog] && ydk[miracle]) ? 'Hero Frog' :
        (ydk[swapfrog] && ydk[diva] && !ydk[miracle]) ? 'Diva Frog' :
        (ydk[swapfrog] && ydk[caius] && (ydk[raiza] || ydk[mobius] || ydk[thestalos]) && !ydk[diva]) ? 'Frog Monarch' :
        (ydk[ggadget] && !ydk[gearframe]) ? 'Gadget' :
        (ydk[ggadget] && ydk[gearframe] && ydk[fortress]) ? 'Machina Gadget' :
        (ydk[aggolem] && ydk[gearframe] && ydk[fortress]) ? 'Ancient Gear Machina' :
        (ydk[gearframe] && ydk[fortress] && !ydk[aggolem] && !ydk[ggadget]) ? 'Machina' :
        (ydk[laquari] && ydk[chariot]) ? 'Gladiator Beast' :
        (ydk[jdrag] && ydk[recharge]) ? 'Lightsworn' :
        (ydk[lonefire] && ydk[quickdraw] && ydk[debris] && !ydk[airbellum] && !ydk[jdrag] && !ydk[gobzomb] && !ydk[rekindling] && !ydk[duplication]) ? 'Quickdraw Plant' :
        (ydk[lonefire] && ydk[airbellum] && ydk[debris]) ? 'Saber Plant' :
        (ydk[vrocket] && ydk[quickdraw]) ? 'Volcanic Quickdraw' :
        (ydk[quickdraw] && ydk[firedog] && ydk[rekindling]) ? 'Flamvell Quickdraw' :
        (ydk[quickdraw] && ydk[tuningware] && ydk[duplication]) ? 'Quickdraw Machine' :
        (ydk[quickdraw] && ydk[gobzomb] && ydk[mezuki]) ? 'Quickdraw Zombie' :
        (ydk[diva] && ydk[gobzomb] && ydk[mezuki]) ? 'Diva Zombie' :
        (!ydk[quickdraw] && !ydk[diva] && ydk[gobzomb] && ydk[mezuki]) ? 'Zombie' :
        (ydk[gotss] && ydk[zanji] && ydk[gateway] && ydk[ssunited]) ? 'Six Samurai' :
        (ydk[cat] && ydk[monk] && ydk[airbellum] && ydk[spy]) ? 'Synchro Cat' :
        (ydk[sorc] && ydk[dad] && ydk[recharge]) ? 'Chaos Lightsworn' :
        (ydk[caius] && ydk[treeborn] && ydk[recharge]) ? 'Lightsworn Monarch' :
        (ydk[vayu] >= 2 && ydk[sirocco] && (ydk[arma] || ydk[grepher]) && ydk[bfadd]) ? 'Vayu Turbo' :
        (ydk[vrocket] && ydk[garden] && !ydk[caius] && !ydk[quickdraw]) ? 'Volcanic Garden' : 
        (ydk[vrocket] && ydk[caius] && !ydk[garden] && !ydk[quickdraw]) ? 'Volcanic Monarch' : 
        (ydk[emmersblade] && ydk[faultroll] && ydk[fulhelm]) ? 'X-Saber' : 
        (ydk[necrovalley] && ydk[spy] && ydk[wmc]) ? 'Gravekeeper Burn' : 
        (ydk[salvo] && ydk[dad]) ? 'Salvo DAD' : 
        (ydk[lonefire] && (ydk[fert] || ydk[motr]) && !ydk[quickdraw]) ? 'Plant' : 
        (ydk[codarus] && ydk[alo]) ? 'Codarus' :
        (ydk[bushi] && ydk[rota] && ydk[solidarity]) ? 'Bushi' : 
        'Other'

    return deckType
}

//GET DECK CATEGORY
const getDeckCategory = async (name) => {
    const deckType = await DeckType.findOne({
        where: {
            name: {[Op.iLike]: name}
        }
    })

    if (!deckType) return 'Other'
    return deckType.category
}

const makeDeckTypes = async () => {
    const decks = await Deck.findAll()
    let x = 0
    for (let i = 0; i < decks.length; i++) {
        const deck = decks[i]
        const count = await DeckType.count({
            where: {
                name: deck.type,
                format: deck.format
            }
        })

        if (count) continue
        await DeckType.create({
            name: deck.type,
            category: deck.category,
            format: deck.format
        })
        x++
    }

    return console.log(`created ${x} deckTypes`)
}

const updateDeckTypes = async () => {
    try {
        const decks = await Deck.findAll({
            where: {
                type: {[Op.iLike]: 'other'}
            }
        })
        for (let i = 0; i < decks.length; i++) {
            const deck = decks[i]
            const updatedDeckType = getDeckType(deck.ydk, deck.format)
            if (updatedDeckType === 'Other') continue
            console.log('updatedDeckType', updatedDeckType)
            const updatedDeckCategory = await getDeckCategory(updatedDeckType)
            if (updatedDeckType === deck.type && updatedDeckCategory === deck.category) continue
            deck.type = updatedDeckType
            deck.category = updatedDeckCategory
            await deck.save()
        }
    } catch (err) {
        console.log(err)
    }
}

const updateCommunities = async () => {
    try {
        const decks = await Deck.findAll()
        for (let i = 0; i < decks.length; i++) {
            const deck = decks[i]
            if (deck.eventName.includes('GFC')) deck.community = 'GoatFormat.com'
            if (deck.eventName.includes('FLC')) deck.community = 'Format Library'
            await deck.save()
        }
    } catch (err) {
        console.log(err)
    }
}

const countParticipants = async () => {
    const tournaments = await Tournament.findAll({ 
        where: { 
            display: true, 
            state: 'complete',
            winner: null
        }})
    
    for (let i = 0; i < tournaments.length; i++) {
        try {
            const tournament = tournaments[i]
            const {data} = await axios.get(`https://formatlibrary:${challongeAPIKey}@api.challonge.com/v1/tournaments/${tournament.id}.json`)
            if (!data) continue
            tournament.size = data.tournament.participants_count || 0
            tournament.startDate = `${data.tournament.started_at.slice(0, 10)} ${data.tournament.started_at.slice(11, 26)}`
            tournament.endDate = `${data.tournament.completed_at.slice(0, 10)} ${data.tournament.completed_at.slice(11, 26)}`
            
            const winningDeck = await Deck.findOne({
                where: {
                    event: tournament.abbreviation,
                    placement: 1
                }
            })

            if (winningDeck) tournament.winner = winningDeck.builder

            await tournament.save()
        } catch (err) {
            console.log(err)
        }
    }
}

const fixFusions = async () => {
    const cards = await Card.findAll({
        where: {
            [Op.or]: {
                xyz: true,
                synchro: true,
                link: true
            }
        }
    })
    
    let b = 0

    for (let i = 0; i < cards.length; i++) {
        const c = cards[i]
        c.normal = false
        await c.save()
        b++
    }

    return console.log(`fixed ${b} xyz/synchro/link monsters`)
}

const fixDuelTerminal = async () => {
    let b = 0
    let e = 0
    const sets = await Set.findAll({ 
        where: {
            setName: {[Op.substring]: 'Duel Terminal'}
        }
    })

    for (let i = 0; i < sets.length; i++) {
        const set = sets[i]
        const dtPrints = await Print.findAll({ 
            where: {
                setId: set.id
            },
            include: Card
        })

        for (let j = 0; j < dtPrints.length; j++) {
            try {
                const dtP = dtPrints[j]
                const card = dtP.card
                const cardId = dtP.cardId
                console.log(`checking prints of ${card.name} (${dtP.cardCode})`)
                const cardPrints = await Print.findAll({
                    where: {
                        cardId: cardId
                    },
                    include: Set,
                    order: [[Set, 'tcgDate', 'ASC']]
                }) || []
    
                if (cardPrints.length < 2) {
                    console.log('uhh only 1 print and its DT???')
                    continue
                }
    
                if (cardPrints[0].id === dtP.id) {
                    const secondPrint = cardPrints[1]
                    const tcgDate = secondPrint.set.tcgDate
                    console.log(`changing the tcgDate of ${card.name} (1st print: ${dtP.cardCode}, 2nd print: ${secondPrint.cardCode}) from ${card.tcgDate} to ${tcgDate}`)
                    card.tcgDate = tcgDate
                    await card.save()
                    b++
                } else {
                    console.log(`No Change: 1st print of ${card.name} == ${cardPrints[0].cardCode}`)
                }
            } catch (err) {
                console.log(err)
                e++
            }
        }
    }

    return console.log(`fixed dates for ${b} cards, encountered ${e} errors`)
}

const fixDP06andDP07 = async () => {
    let b = 0
    let e = 0
    const sets = await Set.findAll({ 
        where: {
            id: {[Op.or]: ['199', '200']}
        }
    })

    for (let i = 0; i < sets.length; i++) {
        const set = sets[i]
        const dpPrints = await Print.findAll({ 
            where: {
                setId: set.id
            },
            include: Card
        })

        for (let j = 0; j < dpPrints.length; j++) {
            try {
                const dpP = dpPrints[j]
                const card = dpP.card
                const cardId = dpP.cardId
                console.log(`checking prints of ${card.name} (${dpP.cardCode})`)
                const cardPrints = await Print.findAll({
                    where: {
                        cardId: cardId
                    },
                    include: Set,
                    order: [[Set, 'tcgDate', 'ASC']]
                }) || []
    
                if (cardPrints[0].id === dpP.id) {
                    const tcgDate = '2008-02-01'
                    console.log(`changing the tcgDate of ${card.name} (1st print: ${dpP.cardCode}) from ${card.tcgDate} to ${tcgDate}`)
                    card.tcgDate = tcgDate
                    await card.save()
                    b++
                } else {
                    console.log(`No Change: 1st print of ${card.name} == ${cardPrints[0].cardCode}`)
                }
            } catch (err) {
                console.log(err)
                e++
            }
        }
    }

    return console.log(`fixed dates for ${b} cards, encountered ${e} errors`)
}


const fixCardText = async () => {
    let b = 0
    const cards = await Card.findAll({
        where: {
            description: {[Op.substring]: '; ●' }
        }
    })
    
    for (let i = 0; i < cards.length; i++) {
        const card = cards[i]
        card.description = card.description.replaceAll('; ●', ';\n ●')
        await card.save()
        console.log(`Changed description of ${card.name} replacing ${'. ●'} with ${'.\n ●'}`)
        b++
    }

    return console.log(`fixed descriptions for ${b} cards`)
}

const fixNormals = async () => {
    let b = 0
    const cards = await Card.findAll({
        where: {
            [Op.and]: [
                {normal: true},
                {[Op.or]: [
                    {fusion: true},
                    {ritual: true},
                    {synchro: true},
                    {xyz: true},
                    {link: true}
                ]}
            ]
        }
    })

    for (let i = 0; i < cards.length; i++) {
        const card = cards[i]
        card.normal = false
        await card.save()
        console.log(`${card.name} is no longer normal`)
        b++
    }

    return console.log(`fixed ${b} non-effect monsters`)
}

const fixDeckCreatedAt = async () => {
    let b = 0
    const decks = await Deck.findAll({ include: Tournament })

    for (let i = 0; i < decks.length; i++) {
        try {
            const deck = decks[i]
            const endDate = deck.tournament.endDate
            deck.changed('createdAt', true);
            deck.set('createdAt', endDate, {raw: true});
            await deck.save({
                silent: true,
                fields: ['createdAt']
            })
            console.log(endDate === deck.eventDate)
            b++
        } catch (err) {
            console.log(err)
        }
    }

    return console.log(`fixed ${b} decks`)
}

const fixYDKs = async () => {
    let b = 0
    const decks = await Deck.findAll({
        where: {
            event: {[Op.not]: 'RBET03'}
        }
    })

    for (let i = 0; i < decks.length; i++) {
        const deck = decks[i]
        const ydk = deck.ydk.replaceAll(' ', '\n')
        deck.ydk = ydk
        await deck.save()
        b++
    }

    return console.log(`fixed ${b} deck YDKs`)
}

const fixGames = async () => {
    const stats = await Stats.findAll()
    for (let i = 0; i < stats.length; i++) {
        const s = stats[i]
        s.games = s.wins + s.losses
        await s.save()
    }

    return console.log('fixed stats')
}

const fixDecks = async () => {
    let b = 0
    const decks = await Deck.findAll({ 
        where: { eventId: {[Op.not]: null }}, 
        include: [Event] 
    })
    
    for (let i = 0; i < decks.length; i++) {
        try {
            const deck = decks[i]
            deck.eventDate = deck.event.startDate            
            await deck.save()
            b++
        } catch (err) {
            console.log(err)
        }
    }

    return console.log(`fixed ${b} deck eventDates`)
}


const fixDecks2 = async () => {
    let b = 0
    const decks = await Deck.findAll()
    
    for (let i = 0; i < decks.length; i++) {
        try {
            const deck = decks[i]
            const deckType = await DeckType.findOne({
                where: {
                    name: deck.type,
                    format: deck.format
                }
            })          
            
            if (!deckType) {
                console.log(`no ${deck.type} decktype for ${deck.format} format`)
                continue
            }

            deck.deckTypeId = deckType.id
            await deck.save()
            b++
        } catch (err) {
            console.log(err)
        }
    }

    return console.log(`fixed ${b} deck decktypeIds`)
}

const fixDeckThumbs = async () => {
    let b = 0
    const thumbs = await DeckThumb.findAll()
    for (let i = 0; i < thumbs.length; i++) {
        const thumb = thumbs[i]

        if (!thumb.deckTypeId) {
            const dt = await DeckType.findOne({ where: { name: thumb.name }})
    
            if (!dt) {
                console.log(`no deckType found for ${thumb.name}`)
                continue
            }
    
            thumb.deckTypeId = dt.id
            await thumb.save()
        }

        const count = await DeckThumb.count({ where: { name: thumb.name }})

        if (count === 1) {
            thumb.primary = true
            await thumb.save()
        }

        if (!thumb.leftCardYpdId) {
            const leftCard = await Card.findOne({ where: { name: thumb.leftCard }}) 
            if (leftCard) thumb.leftCardYpdId = leftCard.ypdId
            await thumb.save()

            if (leftCard && !fs.existsSync(`./public/images/artworks/${leftCard.ypdId}.jpg`)) {
                try {
                    const {data} = await axios({
                        method: 'GET',
                        url: `https://storage.googleapis.com/ygoprodeck.com/pics_artgame/${leftCard.ypdId}.jpg`,
                        responseType: 'stream'
                    })
        
                    data.pipe(fs.createWriteStream(`./public/images/artworks/${leftCard.ypdId}.jpg`))
                    console.log(`saved ${leftCard.name} artwork to ${`./public/images/artworks/${leftCard.ypdId}.jpg`}`)
                } catch (err) {
                    console.log(err)
                }
            }
        }

        if (!thumb.centerCardYpdId) {
            const centerCard = await Card.findOne({ where: { name: thumb.centerCard }}) 
            if (centerCard) thumb.centerCardYpdId = centerCard.ypdId
            await thumb.save()

            if (centerCard && !fs.existsSync(`./public/images/artworks/${centerCard.ypdId}.jpg`)) {
                try {
                    const {data} = await axios({
                        method: 'GET',
                        url: `https://storage.googleapis.com/ygoprodeck.com/pics_artgame/${centerCard.ypdId}.jpg`,
                        responseType: 'stream'
                    })
        
                    data.pipe(fs.createWriteStream(`./public/images/artworks/${centerCard.ypdId}.jpg`))
                    console.log(`saved ${centerCard.name} artwork to ${`./public/images/artworks/${centerCard.ypdId}.jpg`}`)
                } catch (err) {
                    console.log(err)
                }
            }
        }

        if (!thumb.rightCardYpdId) {
            const rightCard = await Card.findOne({ where: { name: thumb.rightCard }}) 
            if (rightCard) thumb.rightCardYpdId = rightCard.ypdId
            await thumb.save()

            if (rightCard && !fs.existsSync(`./public/images/artworks/${rightCard.ypdId}.jpg`)) {
                try {
                    const {data} = await axios({
                        method: 'GET',
                        url: `https://storage.googleapis.com/ygoprodeck.com/pics_artgame/${rightCard.ypdId}.jpg`,
                        responseType: 'stream'
                    })
        
                    data.pipe(fs.createWriteStream(`./public/images/artworks/${rightCard.ypdId}.jpg`))
                    console.log(`saved ${rightCard.name} artwork to ${`./public/images/artworks/${rightCard.ypdId}.jpg`}`)
                } catch (err) {
                    console.log(err)
                }
            }
        }
        
        b++
    }

    return console.log(`fixed ${b} deck thumbs`)
} 

const checkMissingThumbs = async () => {
    let b = 0
    const types = await DeckType.findAll()
    for (let i = 0; i < types.length; i++) {
        const t = types[i]
        const count = await DeckThumb.count({ where: { name: t.name }})
        if (!count) {
            console.log(`MISSING THUMBNAIL for ${t.name}`)
            b++
        }
    }

    return console.log(`missing ${b} thumbnails`)
}

const fixEvents = async () => {
    let b = 0
    const events = await Event.findAll()
    for (let i = 0; i < events.length; i++) {
        const e = events[i]
        const format = await Format.findOne({ where: { name: {[Op.iLike]: e.formatName }}})
        e.formatId = format.id
        await e.save()
        b++
    }

    return console.log(`fixed ${b} events`)
 }

const fixBlogPosts = async () => {
    let b = 0
    const blogposts = await BlogPost.findAll({ include: Player })
    for (let i = 0; i < blogposts.length; i++) {
        try {
            const blogpost = blogposts[i]
            const player = blogpost.player
            const tag = player.tag.replace('#', '')
            const content = blogpost.content
                .replaceAll(`/images/logos/FL.png`, `/images/logos/Format Library.png`)
                .replaceAll(`/images/logos/Format Library.png`, `"/images/logos/Format Library.png"`)
                .replaceAll(`/images/logos/GF.png`, `/images/logos/GoatFormat.com.png`)
                .replaceAll(`/images/logos/EF.png`, `/images/logos/EdisonFormat.com.png`)
                .replaceAll(tag, player.id)
    
            blogpost.content = content
            await blogpost.save()
            b++
        } catch (err) {
            console.log(err)
        }
    }

    return console.log(`fixed ${b} blogposts`)
}

fixBlogPosts()
// fixEvents()
fixDeckThumbs()
checkMissingThumbs()
// fixDecks()
// fixDecks2()
// fixGames()
// fixYDKs()
// fixDeckCreatedAt()
// fixCardText()
// fixNormals()
// fixCardText('Dark monster', 'DARK monster')
// fixCardText('Light monster', 'LIGHT monster')
// fixCardText('Earth monster', 'EARTH monster')
// fixCardText('Water monster', 'WATER monster')
// fixCardText('Wind monster', 'WIND monster')
// fixCardText('Fire monster', 'FIRE monster')
// fixCardText(' atk ', ' ATK ')
// fixCardText(' def ', ' DEF ')
// fixCardText('a A-counter', 'an A-counter')
// fixCardText('(This card is always treated as an "Archfiend" card.)', '(This card is always treated as an "Archfiend" card.)\n')
// fixDuelTerminal()
// fixDP06andDP07()
// fixFusions()
// updateCommunities()
// countParticipants()
// updateDeckTypes()
// makeDeckTypes()
// createDecks('PatreonPlayOff2', 'Goat', 'GoatFormat.com', true)
// download()
// images()
// print()
// fix()
// deleteBetaNames()
// fixKonamiCodes()
// deleteSkillCardsAndTokens()
// deleteCardsNotYetReleased()
// findIllegalKonamiCodes()
// destroyIllegalKonamiCodeCards()
// deleteDuplicates()
// fixArrows()
// fixRating()
// fixScale()
// purgeExactDuplicates()
// purgeOldSetDuplicates()
// logDuplicatePrints()
// createSets()
// linkSets()
// modifyRarities()
// purgePortuguese()
// seedFormats()
// addIconsAndEvents()
// purgeShortPrintDuplicates()
// capitalizeSetNames()
// fixPrintSetIds()
// fixDT06()
// fixObviousMissingSetIds()
// removeWGRT()
// fixCollectorsRares()
// fixAs()
// purgeEND()
// fixHeros()
// fixMissingProductIds()
// purgeExactDuplicates()
// fixGhosts()
// addCardDetails()