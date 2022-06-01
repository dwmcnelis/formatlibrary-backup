'use strict'

const axios = require('axios')
const fs = require('fs')
const { Card, Deck, DeckType, Format, Player, Print, Set, Status, Tournament } = require('../server/db/models')
const ygoprodeck = require('../static/ygoprodeck.json')
const sets = require('../static/sets.json')
const { Op } = require('sequelize')
const formats = require('../static/formats.json')
const { capitalize, arrayToObject } = require('../functions/utility')
const { goatformatChallongeAPIKey, formatLibraryChallongeAPIKey, tcgPlayerAPI } = require('../secrets')
const { 
    accum, aggolem, airbellum, alius, alo, angel, archfiend, arma, artemis, barrel, bazoo, ben_kei, bfadd, bigbang, bigshield, blade,
    boomboxen, brain, bushi, bwc, caius, canceller, cannon, cardd, cat, celfon, chariot, clown, codarus, coelacanth, coin, collapse, 
    consonance, convulsion, countdown, cstrike, cyjar, dad, dda, ddwl, debris, decree, desserts, detonation, difu, diva, dmoc, drain, 
    drastic, driver, duplication, economics, ecto, emissary, emmersblade, exodia, faultroll, fert, fire, firedog, fishborg, 
    fortress, freed, fulhelm, fusi, fusiongate, garden, gate, gateway, gbind, gearframe, gearfried, ggadget, gigantes, 
    gkass, gkspear, goblin, gobzomb, gorilla, gotss, gozen, granmarg, grepher, gspark, hblast, horus6, horus8, 
    hugerev, icarus, insect, jdrag, kalut, koala, kmdrago, kristya, lacooda, laquari, lastturn, lava, leftarm, leftleg, 
    life, limiter, llab, lonefire, luminous, lv2, mali, manju, mask, mataza, mazera, meanae, 
    megamorph, meta, mezuki, mimic, miracle, mjar, mobius, mof, monk, moray, motr, natures, necrovalley, 
    needle, nightass, oath, panda, pandemonium, pixie, poison, purity, pyrlight, quickdraw, raiza, rat, reasoning, recharge, redmd, 
    rejuv, rekindling, relinq, remoten, rightarm, rightleg, rivalry, rftdd, rml, rota, salvo, scapegoat, scarabs, sdm, 
    serpent, shallow, silent, sirocco, skull, slump, smackdown, smoke, solemn, solidarity, sorc, soulex, soulrel, 
    spy, ssunited, stein, storm, stealth, strike, susa, swapfrog, taiyou, tdrag, tethys, thanksgiving, thestalos, tiger, 
    tomato, tooncannon, toonelf, tradein, treeborn, trio, trunade, tsuk, tuningware, turtle, underdog, valhalla, vayu, vrocket, 
    whirlwind, wicked, will, wmc, worl, zanji, zombyra, zorc
} = require('../static/cards.json')

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
const getDeckType = (raw, format = 'goat') => {
    if (!raw) return
    const main = raw.split('#extra')[0]
    if (!main) return
    const arr = main.split('\n').filter(el => el.charAt(0) !== '#' && el.charAt(0) !== '!' && el !== '').sort()
    const ydk = arrayToObject(arr)

    const deckType = format.toLowerCase() === 'goat' ? (
            (ydk[collapse] >= 2 || ydk[insect] >= 2  || ydk[susa] >= 2 || ydk[toonelf] >= 2 || ydk[mazera] >= 2 || ydk[pixie] >= 2 || ydk[ecto] >= 2 || ydk[silent] >= 2 || ydk[skull] >= 2 || ydk[hugerev] >= 2 || ydk[pandemonium] >= 2 || ydk[smackdown] >= 2 || ydk[pyrlight] >= 2 || ydk[clown] >= 2 || ydk[coin] >= 2) ? 'Other' :
            (ydk[cat] >= 2 && ydk[will] >= 2 && (ydk[trunade] >= 2 || ydk[decree] >= 2)) ? 'Cat OTK' :
            (ydk[cat] >= 2 && ydk[wicked] >= 2) ? 'Cat Control' :
            (ydk[ben_kei] >= 2 && (ydk[trunade] >= 2 || ydk[decree] >= 2)) ? 'Ben Kei OTK' :
            (ydk[stein] >= 2 && ydk[gate] >= 2) ? 'Stein Gate Turbo' :
            (ydk[stein] >= 2  && !ydk[cat] && (ydk[megamorph] || ydk[natures] || ydk[thanksgiving]) && (ydk[trunade] >= 2 || ydk[decree] >= 2)) ? 'Stein OTK' :
            (ydk[cyjar] && ydk[cardd] && ydk[taiyou] && ydk[shallow]) ? 'Empty Jar' :
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
            (ydk[limiter] >= 2) ? 'Machine' :
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
            'Other'
        ) : format.toLowerCase() === 'edison' ? (
            (ydk[kalut] && ydk[whirlwind] && ydk[icarus]) ? 'Blackwing' :
            (ydk[accum] && ydk[cstrike] && ydk[detonation]) ? 'Chain Burn' :
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
        ) : (
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
        )

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
    return deckType.deckCategory
}

const createDecks = async (name, format, community, useTags = true) => {
    const apiKey = community = 'Format Library' ? formatLibraryChallongeAPIKey : goatformatChallongeAPIKey
    const communityUrl = community = 'Format Library' ? 'formatlibrary' : 'goatformat'

    try {
        let tournament = await Tournament.findOne({ where: { name, state: 'complete' }})
        if (!tournament) {
            console.log(`no tournament named: ${name}`)
            const {data} = await axios.get(`https://${communityUrl}:${apiKey}@api.challonge.com/v1/tournaments/${name}.json`)
            if (!data) return console.log(`no tournament with url: challonge.com/${name}`)
            tournament = await Tournament.create({
                name,
                id: data.tournament.id.toString(),
                url: name,
                format: format,
                type: 'double elimination',
                state: 'complete',
                guildId: '414551319031054346',
                worlds: false,
                rounds: 0,
                createdAt: `${data.tournament.started_at.slice(0, 10)} ${data.tournament.started_at.slice(11, 26)}`,
                updatedAt: `${data.tournament.started_at.slice(0, 10)} ${data.tournament.started_at.slice(11, 26)}`
            })
            console.log('created tournament')
        }

        const players = await Player.findAll({ where: { tag: {[Op.not]: null } }})
        const shortenedTags = useTags ? players.map((p) => p.tag.replace(/\s/gi, '_').replace(/[^\w\s]/gi, '_')) :
                                        players.map((p) => p.name.replace(/[^-?|!.'$\w\s]/gi, '_'))

        const res = await axios.get(`https://${communityUrl}:${apiKey}@api.challonge.com/v1/tournaments/${tournament.id}.json`)
        if (!res) return console.log(`no tournamentId: ${tournament.id}`)
        const size = res.data.tournament.participants_count
        const createdAt = `${res.data.tournament.started_at.slice(0, 10)} ${res.data.tournament.started_at.slice(11, 26)}`
        const { data } = await axios.get(`https://${communityUrl}:${apiKey}@api.challonge.com/v1/tournaments/${tournament.id}/participants.json`)
        if (!data) return console.log(`no participants = require(tournamentId: ${tournament.id}`)
        const participants = data.map((d) => d.participant.name)
        console.log('participants', participants)
        console.log('shortenedTags.slice(0, 20)', shortenedTags.slice(0, 20))

        fs.readdir(`./public/decks/${name}/`, async (err, files) => {
            if (err) {
                console.log(err)
            } else {
                console.log('files', files)
                files.forEach(async (file) => {
                    let query = file.slice(0, -4)
                    // if (query === 'noahmowdy985') query = 'ChainStrike'
                    // if (query === 'Ithrowitintomylunch_!') query = 'Ithrowitintomylunch__'
                    // if (query === 'don_t copy') query = `don't copy`
                    // if (query === 'mark_mps') query = 'mark_mps | LRG Sigma'
                    // if (query === 'funky5') query = 'funky'
                    // if (query === 'jinzodude9') query = 'Jinzodude'
                    // if (query === 'ARandomKeyForgePlayer_Guari_5854') query = 'Guari_5854'
                    // if (query === 'noahmowdy985') query = 'ChainStrike'
                    // if (query === 'funky5') query = 'funky'
                    // if (query === 'TomasBoss15y tjkorol') query = 'TomasBoss15y DB TomasBoss15y'
                    // if (query === 'TheWayfarer') query = 'Wayfarer'
                    // if (query === 'Phei') query = 'Fibi'
                    // if (query === 'Kuru') query = '____'
                    // if (query === 'I SLASH U 1N 2') query = 'mwnhydropump'
                    // if (query === 'GualterusdeCastellione') query = 'GdCastell'
                    // if (query === 'Forever') query = 'DGzForever'
                    // if (query === 'brahimpoke') query = 'brahimtrish'
                    // if (query === 'IAMZ1') query = 'Sohaib _DB _ IAMZ1_'
                    // if (query === 'boymoding xenohospitality') query = 'SQUARE THEORY WAS A GOOD IDEA'

                    if (query === 'Mark_Field_YataYata_3295') query = 'YataYata_3295'
                    if (query === 'eff04_2216') query = 'liliku_2216'
                    if (query === 'Jean_8621') query = 'FrenchAlpha_8621'
                    if (query === 'selim_3492') query = `selim__db___Xov_ze__3492`
                    if (query === 'Snatch_Steal_92_7414') query = 'WarJOKELeague_7414'
                    if (query === 'KingAtem_7165') query = 'Mutsuga_7165'
                    if (query === 'nicodutto_8612') query = 'nicodutto_DB_Nico2324__8612'
                    // if (query.includes('to0fresh')) query = 'to0fresh_3550'
                    // if (query === 'Rask_2225') query = 'Berndig_2225'
                    // if (query === 'Blave_2824') query = 'Young_Sexy_MF_0357'
                    // if (query === '3rdrateduelist_6321') query = '3rdrateduelist202_6321'
                    // if (query === 'Asphyxiate_____1740') query = 'Asphy_____1740'
                    // if (query === 'Maru_6853') query = 'Ma_Roo_6853'
                    // if (query === 'Rask_2225') query = 'Berndig_2225'
                    // if (query === 'Tt_5322') query = 'SyrupNSprite_5322'
                    // if (query === 'niceboy_7567') query = 'Ludovico_Rizzo_7567'
                    // if (query === 'thesauze_8388') query = 'Thesauze_8388'
                    // if (query === 'hirahime_9380') query = 'Hira_3662'
                    // if (query === 'mark_mps_8026') query = 'mark_mps___LRG_Sigma_8026'
                    // if (query === 'young_sexy_mf_0357') query = 'Young_Sexy_MF_0357'
                    // if (query === 'funky__funkyfunky__9299') query = 'funky_9299'
                    // if (query === 'Jinzo_7671') query = 'JinzoJonzon_7671'
                    // if (query === 'TheLastDance_6481') query = 'TheLastDance_1086'
                    // if (query === 'Sho_Nuff_4743') query = 'Willie_Beamen_4743'
                    // if (query === 'Unfortunately__I_am_from_Bosnia_2437') query = 'Bonkai_2437'
                    // if (query === 'LWRS_5826') query = 'Asgeir_5826'
                    // if (query === 'keininsder_1992') query = 'Keininsder_1992'

                    // if (query === 'IAMZ1_5635') query = 'Sohaib_DB_IAMZ1__5635'
                    // if (query === 'Randage_8521') query = 'Randage_0001'
                    // if (query === 'brahimpoke_3361') query = 'brahimtrish_3361'
                    const i = shortenedTags.indexOf(query)
                    if (i === -1) {
                        console.log(`no Player found with the Discord tag: ${query}`)
                    } else {
                        const player = players[i]
                        let pname = player.name
                        if (pname.includes('liliku')) pname = 'eff04'
                        if (pname.includes('FrenchAlpha')) pname = 'Jean'
                        if (pname.includes(`selim`)) pname = 'selim'
                        if (pname.includes('WarJOKELeague')) pname = 'Snatch Steal 92'
                        if (pname.includes('mark_mps')) pname = 'mark_mps | LRG Sigma'
                        if (pname.includes('nicodutto')) pname = 'nicodutto'
                        if (pname.includes('YataYata')) pname = 'Mark Field/YataYata'
                        // if (pname === 'Keininsder') pname = 'keininsder'
                        // if (pname === 'Asgeir') pname = 'LWRS'
                        // if (pname === 'Bonkai') pname = 'Unfortunately, I am from Bosnia'
                        // if (pname === 'Jinzodude') pname = 'jinzodude9'
                        // if (pname === 'Willie Beamen') pname = `Sho'Nuff`
                        // if (pname === 'Guari') pname = 'ARandomKeyForgePlayer/Guari'
                        // if (pname === 'JinzoJonzon') pname = 'Jinzo'
                        // if (pname === 'ChainStrike') pname = 'noahmowdy985'
                        // if (pname === 'Ithrowitintomylunch__') pname = 'Ithrowitintomylunch?!'
                        // if (pname === 'Sohaib _DB _ IAMZ1_') pname = 'Saad R/to0fresh'
                        // if (pname === 'mark_mps | LRG Sigma') pname = 'mark_mps'
                        // if (pname === 'Young Sexy MF') pname = 'young sexy mf'
                        // if (pname === 'YSMF (aka Bao)') pname = 'youngsexymf'
                        // if (pname === 'SQUARE THEORY WAS A GOOD IDEA') pname = 'boymoding xenohospitality'
                        // if (pname === 'Ludovico Rizzo') pname = 'nice boy'
                        // if (pname === 'Thesauze') pname = 'thesauze'
                        // if (pname === 'Hira') pname = 'hirahime'
                        // if (pname === 'SyrupNSprite') pname = 'Tt'
                        // if (pname === 'Ma-Roo') pname = 'Maru'
                        // if (pname === 'Asphy 蘇生する') pname = 'Asphyxiate 蘇生する'
                        // if (pname === '3rdrateduelist202') pname = '3rdrateduelist'
                        // if (pname === 'Berndig') pname = 'Rask'
                        // if (pname === 'brahimtrish') pname = 'brahimpoke'
                        // if (pname === 'to0fresh') pname = `Saad R/to0fresh`
                        // if (pname === 'Sohaib (DB = IAMZ1)') pname = `IAMZ1`
                        // if (pname === 'funky') pname = `funky5`
                        // if (pname === 'funky') pname = 'funky (funkyfunky)'
                        // if (pname === 'mark_mps___LRG_Sigma') pname = 'mark_mps'
                        // if (pname === 'Young_Sexy_MF') pname = 'youngsexymf'
                        const j = participants.indexOf(pname)
                        if (j === -1) {
                            console.log(`no Challonge Participant found for the player: ${pname}`)
                        } else {
                            const count = await Deck.count({
                                where: {
                                    builder: player.name,
                                    event: tournament.shortName || tournament.name
                                }
                            })

                            if (!count) {
                                const participant = data[j].participant
                                const placement = parseInt(participant.final_rank, 10)
                                const raw = fs.readFileSync(`./public/decks/${name}/${file}`, 'utf8')
                                const deckType = getDeckType(raw, tournament.format)
                                const deckCategory = await getDeckCategory(deckType)
                                const display = (size <= 8 && placement === 1) ||
                                                (size > 8 && size <= 16 && placement <= 2) ||
                                                (size > 16 && size <= 24 && placement <= 3) ||
                                                (size > 24 && size <= 32 && placement <= 4) ||
                                                (size > 32 && size <= 48 && placement <= 6) ||
                                                (size > 48 && size <= 64 && placement <= 8) ||
                                                (size > 64 && size <= 96 && placement <= 12) ||
                                                (size > 96 && size <= 128 && placement <= 16) ||
                                                (size > 128 && size <= 224 && placement <= 24) ||
                                                (size > 224 && placement <= 32) ||
                                                false

                                await Deck.create({
                                    name: deckType,
                                    deckType: deckType,
                                    deckCategory: deckCategory,
                                    builder: player.name,
                                    format: tournament.format,
                                    ydk: raw,
                                    placement: placement,
                                    event: tournament.shortName || tournament.name,
                                    display: display,
                                    playerId: player.id,
                                    community: community,
                                    tournamentId: tournament.id,
                                    createdAt: createdAt
                                })
    
                                console.log('created Deck')
                            } else {
                                console.log(`already have ${player.name}'s deck for ${tournament.name}`)
                            }
                        }
                    }
                })
            }
        })
    } catch (err) {
        console.log(err)
    }
} 

const makeDeckTypes = async () => {
    const decks = await Deck.findAll()
    let x = 0
    for (let i = 0; i < decks.length; i++) {
        const deck = decks[i]
        const count = await DeckType.count({
            where: {
                name: deck.deckType,
                format: deck.format
            }
        })

        if (count) continue
        await DeckType.create({
            name: deck.deckType,
            category: deck.deckCategory,
            format: deck.format
        })
        x++
    }

    return console.log(`created ${x} deckTypes`)
}

const updateDeckTypes = async () => {
    try {
        const decks = await Deck.findAll()
        for (let i = 0; i < decks.length; i++) {
            const deck = decks[i]
            if (deck.deckType === 'other') {
                deck.deckType = 'Other'
                deck.name = 'Other'
                await deck.save()
            }
            const updatedDeckType = getDeckType(deck.ydk, deck.format)
            console.log('updatedDeckType', updatedDeckType)
            if (updatedDeckType === 'Other') continue
            const updatedDeckCategory = await getDeckCategory(updatedDeckType)
            if (updatedDeckType === deck.deckType && updatedDeckCategory === deck.deckCategory) continue
            deck.name = updatedDeckType
            deck.deckType = updatedDeckType
            deck.deckCategory = updatedDeckCategory
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
            if (deck.event.includes('GFC')) deck.community = 'GoatFormat.com'
            if (deck.event.includes('FLC')) deck.community = 'Format Library'
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
                    event: tournament.shortName,
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
            console.log(endDate === deck.createdAt)
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
updateDeckTypes()
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