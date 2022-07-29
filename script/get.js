
/*eslint-disable*/
const axios = require('axios')
const fs = require('fs')
const { Card, Set } = require('../server/db/models')
const { Op } = require('sequelize')

// GET LINK ARROWS
const getLinkArrows = (directionsArr = []) => {
    const arrows = []
    directionsArr.forEach((dir) => {
        let abbr = ''
        const cardinals = dir.split('-')
        cardinals.forEach((car) => {
            abbr = abbr + car.charAt(0)
        })

        arrows.push(abbr)
    })

    return arrows.join('-')
}

// GET SORT PRIORITY
const getSortPriority = (type = '') => {
    const sortPriority = type.includes('Trap') ? 11 :
        type.includes('Spell') ? 10 :
        type.includes('Link') ? 9 :
        type.includes('Xyz') ? 8 :
        type.includes('Synchro') ? 7 :
        type.includes('Fusion') ? 6 :
        type.includes('Ritual') ? 5 :
        type.includes('Pendulum') && !type.includes('Normal') ? 4 :
        type.includes('Effect') ? 3 :
        type.includes('Pendulum') && type.includes('Normal') ? 2 :
        type.includes('Normal') ? 1 :
        null

    return sortPriority
}

// GET COLOR
const getColor = (type = '') => {
    const color = type.includes('Trap') ? 'violet' :
        type.includes('Spell') ? 'green' :
        type.includes('Link') ? 'dark-blue' :
        type.includes('Xyz') ? 'black' :
        type.includes('Synchro') ? 'white' :
        type.includes('Fusion') ? 'purple' :
        type.includes('Ritual') ? 'light-blue' :
        type.includes('Pendulum') && !type.includes('Normal') ? 'orange-green' :
        type.includes('Effect') ? 'orange' :
        type.includes('Pendulum') && type.includes('Normal') ? 'yellow-green' :
        type.includes('Normal') ? 'yellow' :
        null

    return color
}

// DOWNLOAD CARD IMAGE
const downloadCardImage = async (id) => {
    const {data} = await axios({
        method: 'GET',
        url: `https://storage.googleapis.com/ygoprodeck.com/pics/${id}.jpg`,
        responseType: 'stream'
    })

    data.pipe(fs.createWriteStream(`../public/images/cards/${id}.jpg`))
}

// DOWNLOAD NEW CARDS
const downloadNewCards = async () => {
    let b = 0
    let c = 0
    let t = 0
    let o = 0
    let e = 0
    const { data } = await axios.get('https://db.ygoprodeck.com/api/v7/cardinfo.php?misc=yes')
    for (let i = 0; i < data.data.length; i++) {
        const datum = data.data[i]
        if (datum.type === 'Token' || datum.type === 'Skill Card') continue
        const id = datum.id.toString()
        if (
            id === '501000000' || 
            id === '501000001' || 
            id === '501000002' || 
            id === '501000003' || 
            id === '501000004' || 
            id === '501000006' || 
            id === '501000007' || 
            id === '111000561'
        ) continue

        try {
            const card = await Card.findOne({
                where: {
                    [Op.or]: [
                        {ypdId: id},
                        {name: datum.name}
                    ]
                    
                }
            })
    
            if (!card) {
                b++
                let konamiCode = id
                while (konamiCode.length < 8) konamiCode = '0' + konamiCode
                const type = datum.type
                const category = type.includes('Monster') ? 'Monster' :
                    type.includes('Spell') ? 'Spell' :
                    type.includes('Trap') ? 'Trap' :
                    null

                if (!category) console.log(`No category for ${datum.type}`)
                        
                await Card.create({
                    name: datum.name,
                    konamiCode: konamiCode,
                    ypdId: id,
                    tcgLegal: !!datum.misc_info[0].tcg_date,
                    ocgLegal: !!datum.misc_info[0].ocg_date,
                    category: category,
                    icon: category !== 'Monster' ? datum.race : null,
                    normal: category === 'Monster' && type.includes('Normal'),
                    effect: category === 'Monster' &&
                        !type.includes('Normal') && 
                        (
                            type.includes('Effect') || 
                            type.includes('Flip') || 
                            type.includes('Gemini') || 
                            type.includes('Spirit') || 
                            type.includes('Toon') || 
                            type.includes('Union') || 
                            type.includes('Tuner')
                        ),
                    fusion: category === 'Monster' && type.includes('Fusion'),
                    ritual: category === 'Monster' && type.includes('Ritual'),
                    synchro: category === 'Monster' && type.includes('Synchro'),
                    xyz: category === 'Monster' && type.includes('Xyz'),
                    pendulum: category === 'Monster' && type.includes('Pendulum'),
                    link: category === 'Monster' && type.includes('Link'),
                    flip: category === 'Monster' && type.includes('Flip'),
                    gemini: category === 'Monster' && type.includes('Gemini'),
                    spirit: category === 'Monster' && type.includes('Spirit'),
                    toon: category === 'Monster' && type.includes('Toon'),
                    tuner: category === 'Monster' && type.includes('Tuner'),
                    union: category === 'Monster' && type.includes('Union'),
                    attribute: datum.attribute,
                    type: category === 'Monster' ? datum.race : null,
                    level: category === 'Monster' && !type.includes('Link') ? datum.level : null,
                    rating: category === 'Monster' && type.includes('Link') ? datum.linkval : null,
                    arrows: category === 'Monster' && type.includes('Link') ? getLinkArrows(datum.linkmarkers) : null,
                    scale: category === 'Monster' && type.includes('Pendulum') ? datum.scale : null,
                    atk: category === 'Monster' ? datum.atk : null,
                    def: category === 'Monster' && !type.includes('Link') ? datum.def : null,
                    description: datum.desc,
                    tcgDate: datum.misc_info[0].tcg_date ? datum.misc_info[0].tcg_date : null,
                    ocgDate: datum.misc_info[0].ocg_date ? datum.misc_info[0].ocg_date : null,
                    extraDeck: type.includes('Fusion') || type.includes('Synchro') || type.includes('Xyz') || type.includes('Link'),
                    color: getColor(datum.type),
                    sortPriority: getSortPriority(datum.type)
                })
                console.log(`New card: ${datum.name} (TCG Date: ${datum.misc_info[0].tcg_date}, OCG Date: ${datum.misc_info[0].ocg_date})`)
                await downloadCardImage(datum.id)
                console.log(`IMAGE SAVED`)
            } else if (card && (card.name !== datum.name)) {
                c++
                card.name = datum.name
                card.description = datum.desc
                card.tcgLegal = !!datum.misc_info[0].tcg_date
                card.ocgLegal = !!datum.misc_info[0].ocg_date
                card.tcgDate = datum.misc_info[0].tcg_date ? datum.misc_info[0].tcg_date : null
                card.ocgDate = datum.misc_info[0].ocg_date ? datum.misc_info[0].ocg_date : null
                await card.save()
                console.log(`New name: ${card.name} is now: ${datum.name}`)
            } else if (card && (!card.tcgDate || !card.tcgLegal) && datum.misc_info[0].tcg_date) {
                t++
                card.name = datum.name
                card.description = datum.desc
                card.tcgDate = datum.misc_info[0].tcg_date
                card.tcgLegal = true
                await card.save()
                console.log(`New TCG Card: ${card.name}`)
            } else if (card && (!card.ocgDate || !card.ocgLegal) && datum.misc_info[0].ocg_date) {
                o++
                card.name = datum.name
                card.description = datum.desc
                card.ocgDate = datum.misc_info[0].ocg_date
                card.ocgLegal = true
                await card.save()
                console.log(`New OCG Card: ${card.name}`)
            }
        } catch (err) {
            e++
            console.log(err)
        }
    }

    return console.log(`Found ${b} new cards, ${c} new names, ${t} new TCG cards, ${o} new OCG cards, encountered ${e} errors`)
}

// UPDATE SETS
const updateSets = async () => {
    let b = 0
    let c = 0
    const { data } = await axios.get('https://db.ygoprodeck.com/api/v7/cardsets.php')
    for (let i = 0; i < data.length; i++) {
        try {
            const datum = data[i]
            if (!datum.set_name.includes('(POR)') && datum.tcg_date) {
                let set = await Set.findOne({
                    where: {
                        [Op.and]: [
                            {setName: {[Op.iLike]: datum.set_name}},
                            {tcgPlayerGroupId: {[Op.not]: null}}
                        ]
                    }
                })
    
                if (set && set.size !== datum.num_of_cards) {
                    console.log(`updating size of ${set.setName} from ${set.size} to ${datum.num_of_cards}`)
                    set.size = datum.num_of_cards
                    await set.save()
                    c++

                    try {
                        await findNewPrints(set, set.tcgPlayerGroupId)
                        console.log(`collected prints for old set: ${datum.set_name} (${datum.set_code})`)
                    } catch (err) {
                        console.log(err)
                    }
                } else if (!set) {
                    set = await Set.create({
                        setName: datum.set_name,
                        setCode: datum.set_code,
                        size: datum.num_of_cards,
                        tcgDate: datum.tcg_date
                    })

                    b++

                    console.log(`created new set: ${datum.set_name} (${datum.set_code})`)
                    const groupId = await getNewGroupId(set.id)

                    try {
                        await findNewPrints(set, groupId)
                        console.log(`collected prints for new set: ${datum.set_name} (${datum.set_code})`)
                    } catch (err) {
                        console.log(err)
                    }
                }
            }
        } catch (err) {
            console.log(err)
        }
    }

    return console.log(`created ${b} new sets and updated ${c} other(s)`)
}

// addGroupIdsToSets()
// updateSets()
// downloadNewCards()
// addTCGPlayerPrintData()
// addMissingTCGPlayerPrintData()
// addShatterfoils()