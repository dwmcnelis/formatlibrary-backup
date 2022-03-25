

const formats = require('../static/formats.json')
const { capitalize } = require('./utility.js')

const atkASC = (a, b) => {
    return b.atk - a.atk
}

const atkDESC = (a, b) => {
    return a.atk - b.atk
}

const dateASC = (a, b) => {
    if (a.tcgDate < b.tcgDate) return -1
    if (a.tcgDate > b.tcgDate) return 1
    return 0
}

const dateDESC = (a, b) => {
    if (a.tcgDate < b.tcgDate) return 1
    if (a.tcgDate > b.tcgDate) return -1
    return 0
}

const defASC = (a, b) => {
    return b.def - a.def
}

const defDESC = (a, b) => {
    return a.def - b.def
}

const levelASC = (a, b) => {
    return b.level - a.level
}

const levelDESC = (a, b) => {
    return a.level - b.level
}

const nameASC = (a, b) => {
    if (a.name < b.name) return -1
    if (a.name > b.name) return 1
    return 0
}

const nameDESC = (a, b) => {
    if (a.name < b.name) return 1
    if (a.name > b.name) return -1
    return 0
}

const uploadedASC = (a, b) => {
    if (a.createdAt < b.createdAt) return -1
    if (a.createdAt > b.createdAt) return 1
    return 0
}

const uploadedDESC = (a, b) => {
    if (a.tcgDate < b.tcgDate) return 1
    if (a.tcgDate > b.tcgDate) return -1
    return 0
}

const placeASC = (a, b) => {
    return parseInt(a.placement, 10) - parseInt(b.placement, 10)
}

const placeDESC = (a, b) => {
    return parseInt(b.placement, 10) - parseInt(a.placement, 10)
}

const builderASC = (a, b) => {
    const builderA = a.builder.toLowerCase()
    const builderB = b.builder.toLowerCase()
    if (builderA < builderB) return -1
    if (builderA > builderB) return 1
    return 0
}

const builderDESC = (a, b) => {
    const builderA = a.builder.toLowerCase()
    const builderB = b.builder.toLowerCase()
    if (builderA < builderB) return 1
    if (builderA > builderB) return -1
    return 0
}

const eventASC = (a, b) => {
    const eventA = a.event.toLowerCase()
    const eventB = b.event.toLowerCase()
    if (eventA < eventB) return -1
    if (eventA > eventB) return 1
    return 0
}

const eventDESC = (a, b) => {
    const eventA = a.event.toLowerCase()
    const eventB = b.event.toLowerCase()
    if (eventA < eventB) return 1
    if (eventA > eventB) return -1
    return 0
}

const typeASC = (a, b) => {
    if (a.deckType < b.deckType) return -1
    if (a.deckType > b.deckType) return 1
    return 0
}

const typeDESC = (a, b) => {
    if (a.deckType < b.deckType) return 1
    if (a.deckType > b.deckType) return -1
    return 0
}

const categoryASC = (a, b) => {
    if (a.deckCategory < b.deckCategory) return -1
    if (a.deckCategory > b.deckCategory) return 1
    return 0
}

const categoryDESC = (a, b) => {
    if (a.deckCategory < b.deckCategory) return 1
    if (a.deckCategory > b.deckCategory) return -1
    return 0
}

const formatASC = (a, b) => {
    const formatA = formats[capitalize(a.format, true)]
    const formatB = formats[capitalize(b.format, true)]
    const dateA = `${formatA.year}-${formatA.month}`
    const dateB = `${formatB.year}-${formatB.month}`
    if (dateA < dateB) return 1
    if (dateA > dateB) return -1
    return 0
}

const formatDESC = (a, b) => {
    const formatA = formats[capitalize(a.format, true)]
    const formatB = formats[capitalize(b.format, true)]
    const dateA = `${formatA.year}-${formatA.month}`
    const dateB = `${formatB.year}-${formatB.month}`
    if (dateA < dateB) return -1
    if (dateA > dateB) return 1
    return 0
}

module.exports = {
    atkASC,
    atkDESC,
    dateASC,
    dateDESC,
    defASC,
    defDESC,
    levelASC,
    levelDESC,
    nameASC,
    nameDESC,
    uploadedASC,
    uploadedDESC,
    placeASC,
    placeDESC,
    builderASC,
    builderDESC,
    eventASC,
    eventDESC,
    typeASC,
    typeDESC,
    categoryASC,
    categoryDESC,
    formatASC,
    formatDESC
}
