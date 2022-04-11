


const axios = require('axios')
const Canvas = require('canvas')
const fs = require('fs')
const { BlogPost, Card, Deck, DeckType, Format, Player, Print, Set, Stats, Status, Tournament } = require('../server/db/models')
const { Op } = require('sequelize')
const { capitalize, arrayToObject, dateToVerbose } = require('../functions/utility')
const formats = require('../static/formats.json')
const playerJSON = require('../static/players.json')

const drawBlankDeck = async () => {
    const rows = 4
    const card_width = 72
    const card_height = 105
    const canvas = Canvas.createCanvas(card_width * 10 + 9, card_height * rows + rows - 1)
    const context = canvas.getContext('2d')

    for (let i = 0; i < 40; i++) {
        const row = Math.floor(i / 10)
        const col = i % 10
        const image = await Canvas.loadImage(`./public/images/back.png`) 
        context.drawImage(image, (card_width + 1) * col, row * (card_height + 1), card_width, card_height)
    }

    const buffer = canvas.toBuffer('image/png')
    fs.writeFileSync(`./public/images/blankDeck.png`, buffer)

    console.log('created blank deck')
}

const composeCongratsPost = async (shortName) => {
    const tournament = await Tournament.findOne({ 
        where: { 
            shortName: shortName,
            display: true
        },
        order: [["startDate", "ASC"]]
    })

        if (!tournament || !tournament.winner) return console.log('no tournament found')

        const deck = await Deck.findOne({
            where: {
                placement: 1,
                tournamentId: tournament.id
            }
        })
    
        if (!deck) return console.log('no deck found')

        const winner = await Player.findOne({
            where: {
                id: tournament.playerId
            }
        })
    
        if (!winner) return console.log('no winner found')

        const communityLogo = tournament.community === 'Format Library' ? "/images/logos/FL.png" :
            tournament.community === 'GoatFormat.com' ? "/images/logos/GF.png" :
            tournament.community === 'EdisonFormat.com' ? "/images/logos/EF.png" :
            ""

        const main = []
        const mainKonamiCodes = deck.ydk.split('#main')[1].split('#extra')[0].split('\n').filter((e) => e.length)

        for (let i = 0; i < mainKonamiCodes.length; i++) {
            let konamiCode = mainKonamiCodes[i]
            while (konamiCode.length < 8) konamiCode = '0' + konamiCode
            const card = await Card.findOne({ where: { konamiCode }})
            if (!card) continue
            main.push(card)
        }

        main.sort((a, b) => {
            if (a.sortPriority > b.sortPriority) {
                return 1
            } else if (b.sortPriority > a.sortPriority) {
                return -1
            } else if (a.name > b.name) {
                return 1
            } else if (b.name > a.name) {
                return -1
            } else {
                return false
            }
        })

        const decks = await Deck.findAll({ 
            where: {
                format: tournament.format.toLowerCase(),
                createdAt: {[Op.lte]: tournament.startDate }
            }
        })
    
        if (!decks.length) return console.log('no decks found')
        
        const freqs = decks.reduce((acc, curr) => (acc[curr.deckType] ? acc[curr.deckType]++ : acc[curr.deckType] = 1, acc), {})
        const popularDecks = Object.entries(freqs).sort((a, b) => b[1] - a[1]).map((e) => e[0]).slice(0, 6)
        const title = `Congrats to ${tournament.winner} on winning ${tournament.shortName}!`
        const blogTitleDate = dateToVerbose(tournament.createdAt, false, false, true)
        const publishDate = dateToVerbose(tournament.createdAt, true, true, false)

        const rows = Math.ceil(main.length / 10)
        const card_width = 72
        const card_height = 105
        const canvas = Canvas.createCanvas(card_width * 10 + 9, card_height * rows + rows - 1)
        const context = canvas.getContext('2d')

        for (let i = 0; i < main.length; i++) {
            const card = main[i]
            const row = Math.floor(i / 10)
            const col = i % 10
            const image = await Canvas.loadImage(`./public/images/cards/${card.ypdId}.jpg`) 
            context.drawImage(image, (card_width + 1) * col, row * (card_height + 1), card_width, card_height)
        }

        const message = tournament.series ? `Enter the next <i>${tournament.cleanName.replace(/[0-9]/g, '').trim()}</i> to see if you can knock out the reigning champ!` :
            tournament.worlds ? `And so the ${tournament.createdAt.getFullYear()} ${capitalize(tournament.format, true)} Format season comes to a close. Be sure to enter next year's qualifiers for your chance to compete in the World Championship!` :
            tournament.cleanName.includes('Last Chance') ? `And so the ${tournament.createdAt.getFullYear()} ${capitalize(tournament.format, true)} Format qualifying season comes to a close. Tune in to find out who wins the World Championship!` :
            tournament.cleanName.includes('Obelisk') || tournament.cleanName.includes('Ra') || tournament.cleanName.includes('Slifer') ? `Join the Goat Format Europe Discord community to compete in the <i>Academy series</i>!` :
            `Join the ${tournament.community} Discord community to compete in similar events!`

        const content = 
            `<div className="blogpost-title-flexbox">` +
                    `<div className="blogpost-title-text">` +
                        `<a href="/events/${tournament.shortName}">` +
                            `<h1 className="blogpost-title">${title}</h1>` +
                        `</a>` +
                        `<p className="blogpost-date">${blogTitleDate}</p>` +
                    `</div>` +
                `<div className="blogpost-title-emojis">` +
                    `<img className="blogpost-format-icon" src="/images/emojis/${formats[capitalize(tournament.format, true)].logo.toLowerCase()}.png"/>` +
                    `<img className="blogpost-event-icon" src="/images/emojis/event.png"/>` +
                `</div>` +
            `</div>` +
            `<div className="blogpost-content-flexbox">` +
                `<p className="blogpost-paragraph">` +
                    `${tournament.winner} won <a className="blogpost-event-link" href="/events/${tournament.shortName}">${tournament.cleanName}</a> on ${publishDate} with a ${popularDecks.includes(deck.deckType) ? 'popular' : 'rogue'} deck, ${capitalize(deck.deckType, true)}!` +
                `</p>` +
                `<div className="blogpost-images-flexbox">` +
                    `<div className="blogpost-pfp-community-flexbox">` +
                        `<img className="blogpost-pfp" src="/images/pfps/${winner.tag.slice(0, -5)}${winner.tag.slice(-4)}.png" />` +
                        `<img className="blogpost-community"  src=${communityLogo} />` +
                    `</div>` +
                    `<div className="blogpost-deck-box">` + 
                        `<a className="blogpost-deck-link" href="/decks/${deck.id}">` +
                            `<img className="blogpost-deck" src="/images/decks/previews/${deck.id}.png" />` +
                        `</a>` +
                    `</div>` +
                `</div>` +
                `<p className="blogpost-paragraph">${message}</p>` +
            `</div>`
    
        await BlogPost.create({
            title: title,
            content: content,
            publishDate: publishDate,
            author: 'RetroBot',
            format: tournament.format,
            playerId: deck.playerId,
            createdAt: tournament.startDate
        })

        const buffer = canvas.toBuffer('image/png')
        fs.writeFileSync(`./public/images/decks/previews/${deck.id}.png`, buffer)

        console.log('created congrats blogpost')
    
}

const composePreview = async (event) => {
    const deck = await Deck.findOne({
        where: {
            event: event,
            placement: 1
        }
    })

    if (!deck) return console.log('no decks found')

    const main = []
    const mainKonamiCodes = deck.ydk.split('#main')[1].split('#extra')[0].split('\n').filter((e) => e.length)

    for (let i = 0; i < mainKonamiCodes.length; i++) {
        let konamiCode = mainKonamiCodes[i]
        while (konamiCode.length < 8) konamiCode = '0' + konamiCode
        const card = await Card.findOne({ where: { konamiCode }})
        if (!card) continue
        main.push(card)
    }

    main.sort((a, b) => {
        if (a.sortPriority > b.sortPriority) {
            return 1
        } else if (b.sortPriority > a.sortPriority) {
            return -1
        } else if (a.name > b.name) {
            return 1
        } else if (b.name > a.name) {
            return -1
        } else {
            return false
        }
    })
    
    const rows = Math.ceil(main.length / 10)
    const card_width = 72
    const card_height = 105
    const canvas = Canvas.createCanvas(card_width * 10 + 9, card_height * rows + 3)
    const context = canvas.getContext('2d')

    for (let i = 0; i < main.length; i++) {
        const card = main[i]
        const row = Math.floor(i / 10)
        const col = i % 10
        const image = await Canvas.loadImage(`./public/images/cards/${card.ypdId}.jpg`) 
        context.drawImage(image, (card_width + 1) * col, row * (card_height + 1), card_width, card_height)
    }

    const buffer = canvas.toBuffer('image/png')
    fs.writeFileSync(`./public/images/decks/previews/${deck.id}.png`, buffer)
    console.log('saved deck preview')
}

const composeThumbnails = async (event) => {
    const decks = await Deck.findAll({
        where: {
            event: event
        }
    })

    if (!decks.length) return console.log('no decks found')

    for (let i = 0; i < decks.length; i++) {
        const deck = decks[i]
        const main = []
        const mainKonamiCodes = deck.ydk.split('#main')[1].split('#extra')[0].split('\n').filter((e) => e.length)

        for (let i = 0; i < mainKonamiCodes.length; i++) {
            let konamiCode = mainKonamiCodes[i]
            while (konamiCode.length < 8) konamiCode = '0' + konamiCode
            const card = await Card.findOne({ where: { konamiCode }})
            if (!card) continue
            main.push(card)
        }

        main.sort((a, b) => {
            if (a.sortPriority > b.sortPriority) {
                return 1
            } else if (b.sortPriority > a.sortPriority) {
                return -1
            } else if (a.name > b.name) {
                return 1
            } else if (b.name > a.name) {
                return -1
            } else {
                return false
            }
        })
        
        const rows = Math.ceil(main.length / 10)
        const card_width = 36
        const card_height = 52.5
        const canvas = Canvas.createCanvas(card_width * 10, card_height * rows)
        const context = canvas.getContext('2d')

        for (let i = 0; i < main.length; i++) {
            const card = main[i]
            const row = Math.floor(i / 10)
            const col = i % 10
            const image = await Canvas.loadImage(`./public/images/cards/${card.ypdId}.jpg`) 
            context.drawImage(image, (card_width) * col, row * (card_height), card_width, card_height)
        }

        const buffer = canvas.toBuffer('image/png')
        fs.writeFileSync(`./public/images/decks/thumbnails/${deck.id}.png`, buffer)
        console.log('saved deck thumbnail')
    }
}

const savePfps = async () => {
    for (let i = 0; i < playerJSON.length; i++) {
        const p = playerJSON[i]
        if (!p.avatar || !p.avatar.length) continue

        const count = await Player.count({
            where: {
                id: p.id,
                avatar: p.avatar
            }
        })

        if (count && fs.existsSync(`./public/images/pfps/${p.tag.slice(0, -5)}${p.tag.slice(-4)}.png`)) {
            continue
        } else {
            try {
                const player = await Player.findOne({
                    where: {
                        id: p.id
                    }
                })

                const canvas = Canvas.createCanvas(128, 128)
                const context = canvas.getContext('2d')
                const image = await Canvas.loadImage(`https://cdn.discordapp.com/avatars/${p.id}/${p.avatar}.png`) 
                context.drawImage(image, 0, 0, 128, 128)
                const buffer = canvas.toBuffer('image/png')
                fs.writeFileSync(`./public/images/pfps/${player.tag.slice(0, -5)}${player.tag.slice(-4)}.png`, buffer)
                console.log(`saved player pfp for ${player.tag}`)
                player.avatar = p.avatar
                await player.save()
            } catch (err) {
                console.log(`cannot load pfp for ${p.name}`)
                continue
            }
        }
    }
}

const purgePfps = async () => {
    fs.readdir(`./public/images/pfps/`, async (err, files) => {
        if (err) {
            console.log(err)
        } else {
            console.log('files', files)
            files.forEach(async (file) => {
                const query = `${file.slice(0, -8)}#${file.slice(-8, -4)}`
                // console.log(`file`, file)
                // console.log(`query`, query)
                const player = await Player.findOne({ where: { tag: query }})
                if (!player) {
                    return console.log('could not find player')
                }

                const stats = await Stats.count({ where: { playerId: player.id }})
                if (!stats) {
                    try {
                        fs.unlinkSync(`./public/images/pfps/${file}`)
                        console.log(`removed pfp for ${player.name}`)
                    } catch(err) {
                        console.error(err)
                    }
                }
            })
        }
    })
}

// purgePfps()
// savePfps()
// drawBlankDeck()
// composeThumbnails('KGP04')
composePreview('PWCQ14')
composePreview('KGP04')
// composeCongratsPost('KGP04')

