

import * as formats from '../static/formats.json'
import {capitalize} from './utility.js'

const atkASC = (a, b) => b.atk - a.atk
const atkDESC = (a, b) => a.atk - b.atk

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

const defASC = (a, b) => b.def - a.def
const defDESC = (a, b) => a.def - b.def

const levelASC = (a, b) => b.level - a.level
const levelDESC = (a, b) => a.level - b.level

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
    if (a.createdAt < b.createdAt) return 1
    if (a.createdAt > b.createdAt) return -1
    return 0
}

const placeASC = (a, b) => parseInt(a.placement, 10) - parseInt(b.placement, 10)
const placeDESC = (a, b) => parseInt(b.placement, 10) - parseInt(a.placement, 10)

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
    const eventA = a.eventName ? a.eventName.toLowerCase() : null
    const eventB = b.eventName ? b.eventName.toLowerCase() : null
    if (eventA < eventB) return -1
    if (eventA > eventB) return 1
    return 0
}

const eventDESC = (a, b) => {
    const eventA = a.eventName ? a.eventName.toLowerCase() : null
    const eventB = b.eventName ? b.eventName.toLowerCase() : null
    if (eventA < eventB) return 1
    if (eventA > eventB) return -1
    return 0
}

const typeASC = (a, b) => {
    if (a.type < b.type) return -1
    if (a.type > b.type) return 1
    return 0
}

const typeDESC = (a, b) => {
    if (a.type < b.type) return 1
    if (a.type > b.type) return -1
    return 0
}

const categoryASC = (a, b) => {
    if (a.category < b.category) return -1
    if (a.category > b.category) return 1
    return 0
}

const categoryDESC = (a, b) => {
    if (a.category < b.category) return 1
    if (a.category > b.category) return -1
    return 0
}

const formatASC = (a, b) => {
    const formatA = formats[capitalize(a.format || a.formatName, true)]
    const formatB = formats[capitalize(b.format || b.formatName, true)]
    const dateA = `${formatA.year}-${formatA.month}`
    const dateB = `${formatB.year}-${formatB.month}`
    if (dateA < dateB) return 1
    if (dateA > dateB) return -1
    return 0
}

const formatDESC = (a, b) => {
    const formatA = formats[capitalize(a.format || a.formatName, true)]
    const formatB = formats[capitalize(b.format || b.formatName, true)]
    const dateA = `${formatA.year}-${formatA.month}`
    const dateB = `${formatB.year}-${formatB.month}`
    if (dateA < dateB) return -1
    if (dateA > dateB) return 1
    return 0
}

const startDateASC = (a, b) => {
    if (a.startDate < b.startDate) return -1
    if (a.startDate > b.startDate) return 1
    return 0
}

const startDateDESC = (a, b) => {
    if (a.startDate < b.startDate) return 1
    if (a.startDate > b.startDate) return -1
    return 0
}

const sizeASC = (a, b) => parseInt(b.size, 10) - parseInt(a.size, 10)
const sizeDESC = (a, b) => parseInt(a.size, 10) - parseInt(b.size, 10)

export {
    startDateASC,
    startDateDESC,
    sizeASC,
    sizeDESC,
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
