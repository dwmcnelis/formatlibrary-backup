
import axios from 'axios'
import { Card, Format, Set, Print } from  '../server/db/models'
import { Op } from  'sequelize'
import { tcgPlayerAPI } from  '../secrets'

const test = async () => {
    const productName = `Number 92: Heart-eartH Dragon`
    const endpoint = `https://api.tcgplayer.com/v1.39.0/catalog/products?categoryId=2&productName=${productName}&getExtendedFields=true&limit=100`
    const { data } = await axios.get(endpoint, {
        headers: {
            "Accept": "application/json",
            "Authorization": `bearer ${tcgPlayerAPI.access_token}`
        }
    })

    for (let i = 0; i < data.results.length; i++) {
        const r = data.results[i]
        console.log('r', r)
    }

    return console.log('data.results.length', data.results.length)
}

/*eslint-disable*/
const addTCGPlayerPrintData = async () => {
    let c = 0
    let n = 0
    let w = 0
    let z = 0
    const cards = await Card.findAll()
    for (let i = 0; i < cards.length; i++) {
        try {
            const card = cards[i]
            const prints = await Print.findAll({
                where: {
                    cardName: card.name
                }
            })
    
            if (!prints.length) continue
            const endpoint = `https://api.tcgplayer.com/v1.39.0/catalog/products?categoryId=2&productName=${card.name}&getExtendedFields=true&limit=100`
            console.log(`looking up ${card.name}`)

            const { data } = await axios.get(endpoint, {
                headers: {
                    "Accept": "application/json",
                    "Authorization": `bearer ${tcgPlayerAPI.access_token}`
                }
            })
    
            for (let j = 0; j < data.results.length; j++) {
                const result = data.results[j]
                const cardCode = result.extendedData[0].value
                const url = result.url
                const print = await Print.findOne({
                    where: {
                        cardCode: cardCode
                    }
                })
    
                if (!print) {
                    try {
                        await Print.create({
                            cardName: card.name,
                            cardCode: cardCode,
                            setName: url.slice(url.indexOf("yugioh-") + 7, url.length - card.name.length - 1),
                            rarity: result.extendedData[1].value,
                            cardId: card.id,
                            tcgPlayerUrl: result.url,
                            tcgPlayerProductId: result.productId
                        })
        
                        n++
                    } catch (err) {
                        console.log(err)
                        w++
                    }
                } else {
                    print.tcgPlayerUrl = result.url
                    print.tcgPlayerProductId = result.productId
                    await print.save()
                    c++
                }
            }
        } catch (err) {
            console.log(err)
            z++
        }
    }
    
    return console.log(`- added TCGPlayer data for ${c} prints\n- created ${n} new prints\n- failed to create ${w} new prints\n- encountered ${z} errors in the upper scope`)
}

/*eslint-disable*/
const addMissingTCGPlayerPrintData = async () => {
    let c = 0
    let d = 0
    let w = 0
    let z = 0
    let n = 0
    
    for (let i = 0; i < 31275; i += 100) {
        try {
            const endpoint = `https://api.tcgplayer.com/v1.39.0/catalog/products?categoryId=2&getExtendedFields=true&offset=${i}&limit=100`
    
            const { data } = await axios.get(endpoint, {
                headers: {
                    "Accept": "application/json",
                    "Authorization": `bearer ${tcgPlayerAPI.access_token}`
                }
            })
        
            for (let j = 0; j < data.results.length; j++) {
                const result = data.results[j]
                const name = result.name.replace(' (UTR)', '')
                    .replace(' (SE)', '')
                    .replace(' (Secret)', '')
                    .replace(' (Shatterfoil)', '')
                    .replace(' (Starfoil)', '')
                    .replace(' (Duel Terminal)', '')
                    .replace(' (The Sacred Cards)', '')
                    .replace (' (Dark Duel Stories)', '')
                    .replace (' (Forbidden Memories)', '')
                    .replace(' (Power of Chaos: Kaiba the Revenge)', '')
                    .replace(' (Reshef of Destruction)', '')
                    .replace(' (Ultra Rare)', '')

                const cardCode = result.extendedData[0].value
                const rarity = result.extendedData[1].value
                const url = result.url
                const print = await Print.findOne({
                    where: {
                        cardCode: cardCode,
                        rarity: rarity
                    }
                })

                if (!print) {
                    try {
                        const card = await Card.findOne({
                            where: {
                                name: {[Op.iLike]: name }
                            }
                        })
    
                        if(!card) {
                            console.log(`no card for ${result.name}`)
                            w++
                            continue
                        }
    
                        console.log(`creating NEW print ${cardCode} - ${name} - ${rarity}`)
                        await Print.create({
                            cardName: name,
                            cardCode: cardCode,
                            setName: url.slice(url.indexOf("yugioh-") + 7, url.length - card.name.length - 1),
                            rarity: rarity,
                            cardId: card.id,
                            tcgPlayerUrl: result.url,
                            tcgPlayerProductId: result.productId
                        })
        
                        n++
                    } catch (err) {
                        console.log(err)
                        w++
                    }
                } else if (print && print.tcgPlayerUrl) {
                    console.log(`already have Url for printId ${print.id}`)
                    d++
                    continue
                } else {
                    print.tcgPlayerUrl = result.url
                    print.tcgPlayerProductId = result.productId
                    console.log(`updating printId ${print.id}`)
                    await print.save()
                    c++
                }
            }
        } catch (err) {
            console.log(err)
            z++
        }
    }
    
    return console.log(`- already had TCGPlayer data for ${d} prints\n- added TCGPlayer data for ${c} prints\n- created ${n} new prints\n- failed to create ${w} new prints\n- encountered ${z} errors in the upper scope`)
}


/*eslint-disable*/
const addShatterfoils = async () => {
    let c = 0
    let z = 0

    const prints = await Print.findAll({
        where: {
            rarity: 'Shatterfoil Rare'
        }
    })
    
    for (let i = 0; i < prints.length; i++) {
        const print = prints[i]
        const productName = print.cardName + ' (Shatterfoil)'
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


 test()
// addTCGPlayerPrintData()
// addMissingTCGPlayerPrintData()
// addShatterfoils()