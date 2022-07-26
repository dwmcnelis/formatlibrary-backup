const db = require('../server/db')
const blogposts = require('./data/blogposts.json')
const cards = require('./data/cards.json')
const decks = require('./data/decks.json')
const deckThumbs = require('./data/deckThumbs.json')
const deckTypes = require('./data/deckTypes.json')
const events = require('./data/events.json')
const formats = require('./data/formats.json')
const players = require('./data/players.json')
const prints = require('./data/prints.json')
const servers = require('./data/servers.json')
const sets = require('./data/sets.json')
const stats = require('./data/stats.json')
const statuses = require('./data/statuses.json')
const tournaments = require('./data/tournaments.json')

const {
  BlogPost,
  Card,
  Deck,
  DeckThumb,
  DeckType,
  Event,
  Format,
  Player,
  Print,
  Server,
  Set,
  Stats,
  Status,
  Tournament
} = require('../server/db/models')
    
const seed = async () => {
    await db.sync({force: false})
    console.log('db synced!')

    for (let i = 0; i < formats.length; i++) {
        console.log(`creating format ${i}`)
        const row = formats[i]
        await Format.create(row)
    }

    for (let i = 0; i < cards.length; i++) {
        console.log(`creating card ${i}`)
        const row = cards[i]
        await Card.create(row)
    }

    for (let i = 0; i < statuses.length; i++) {
        console.log(`creating status ${i}`)
        const row = statuses[i]
        await Status.create(row)
    }
    
    for (let i = 0; i < sets.length; i++) {
        console.log(`creating set ${i}`)
        const row = sets[i]
        await Set.create(row)
    }

    for (let i = 0; i < prints.length; i++) {
        console.log(`creating print ${i}`)
        const row = prints[i]
        await Print.create(row)
    }

    for (let i = 0; i < players.length; i++) {
        console.log(`creating player ${i}`)
        const row = players[i]
        await Player.create(row)
    }

    for (let i = 0; i < servers.length; i++) {
        console.log(`creating server ${i}`)
        const row = servers[i]
        await Server.create(row)
    }

    for (let i = 0; i < stats.length; i++) {
        console.log(`creating stats ${i}`)
        const row = stats[i]
        await Stats.create(row)
    }

    for (let i = 0; i < tournaments.length; i++) {
        console.log(`creating tournament ${i}`)
        const row = tournaments[i]
        await Tournament.create(row)
    }

    for (let i = 0; i < events.length; i++) {
        console.log(`creating event ${i}`)
        const row = events[i]
        await Event.create(row)
    }

    for (let i = 0; i < blogposts.length; i++) {
        console.log(`creating blogpost ${i}`)
        const row = blogposts[i]
        await BlogPost.create(row)
    }
    
    for (let i = 0; i < deckTypes.length; i++) {
        console.log(`creating deckType ${i}`)
        const row = deckTypes[i]
        await DeckType.create(row)
    }

    for (let i = 0; i < deckThumbs.length; i++) {
        console.log(`creating deckThumb ${i}`)
        const row = deckThumbs[i]
        await DeckThumb.create(row)
    }

    for (let i = 0; i < decks.length; i++) {
        console.log(`creating deck ${i}`)
        const row = decks[i]
        await Deck.create(row)
    }

    console.log(`seeded successfully`)
}

seed()


