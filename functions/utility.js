

//CAMELIZE
const camelize = (str) => str.replace(/['"]/g, "").replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, (match, index) => {
    if (+match === 0) return ""
    return index === 0 ? match.toLowerCase() : match.toUpperCase()
})

//CAPITALIZE
const capitalize = (str = '', eachWord = false) => {
    if (!str) return
    if (eachWord) {
        const splt = str.split(' ').map((s) => capitalize(s))
        return splt.join(' ')
    } else {
        const charZero = str.charAt(0) || ''
        return charZero.toUpperCase() + str.slice(1)
    }
}

//ARRAY TO OBJECT
const arrayToObject = (arr = []) => {
    const obj = {}
    arr.forEach(e => obj[e] ? obj[e]++ : obj[e] = 1)
    return obj
}

//DATE TO SIMPLE
const dateToSimple = (date) => {
    if (!date) return ''
    const year = typeof date === 'string' ? date.slice(2, 4) : date.getFullYear().slice(2, 4)
    const month = typeof date === 'string' ? parseInt(date.slice(5, 7), 10) : date.getMonth() + 1
    const day = typeof date === 'string' ? parseInt(date.slice(8, 10), 10) : date.getDate()
    const simple = `${month}/${day}/${year}`
    return simple
}

//DATE TO VERBOSE
const dateToVerbose = (date, long = true, ordinal = true, includeYear = true) => {
    if (!date) return ''
    const year = typeof date === 'string' ? date.slice(0, 4) : date.getFullYear()
    const longMonths = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
    const shortMonths = ["Jan.", "Feb.", "Mar.", "Apr.", "May", "Jun.", "Jul.", "Aug.", "Sep.", "Oct.", "Nov.", "Dec."]
    const month = typeof date === 'string' ? parseInt(date.slice(5, 7), 10) - 1 : date.getMonth()
    const monthStr = long ? longMonths[month] : shortMonths[month]
    const day = typeof date === 'string' ? parseInt(date.slice(8, 10), 10) : date.getDate()
    const dayStr = ordinal ? ordinalize(day) : day
    const verbose = includeYear ? `${monthStr} ${dayStr}, ${year}` :  `${monthStr} ${dayStr}`
    return verbose
}

//GENERATE DEFAULT STATUS ARRAY
const generateDefaultStatus = (card) => {
    return {
        id: card.id,
        name: card.name,
        may02: card.tcgDate <= '2002-07-01' ? 'unlimited' : null,
        jul02: card.tcgDate <= '2002-10-01' ? 'unlimited' : null,
        oct02: card.tcgDate <= '2002-12-01' ? 'unlimited' : null,
        dec02: card.tcgDate <= '2003-04-01' ? 'unlimited' : null,
        apr03: card.tcgDate <= '2003-05-01' ? 'unlimited' : null,
        may03: card.tcgDate <= '2003-07-01' ? 'unlimited' : null,
        jul03: card.tcgDate <= '2003-08-01' ? 'unlimited' : null,
        aug03: card.tcgDate <= '2003-11-01' ? 'unlimited' : null,
        nov03: card.tcgDate <= '2004-02-01' ? 'unlimited' : null,
        feb04: card.tcgDate <= '2004-04-01' ? 'unlimited' : null,
        apr04: card.tcgDate <= '2004-10-01' ? 'unlimited' : null,
        oct04: card.tcgDate <= '2005-04-01' ? 'unlimited' : null,
        apr05: card.tcgDate <= '2005-10-01' ? 'unlimited' : null,
        oct05: card.tcgDate <= '2006-04-01' ? 'unlimited' : null,
        apr06: card.tcgDate <= '2006-09-01' ? 'unlimited' : null,
        sep06: card.tcgDate <= '2007-03-01' ? 'unlimited' : null,
        mar07: card.tcgDate <= '2007-06-01' ? 'unlimited' : null,
        jun07: card.tcgDate <= '2007-09-01' ? 'unlimited' : null,
        sep07: card.tcgDate <= '2008-03-01' ? 'unlimited' : null,
        mar08: card.tcgDate <= '2008-05-01' ? 'unlimited' : null,
        may08: card.tcgDate <= '2008-09-01' ? 'unlimited' : null,
        sep08: card.tcgDate <= '2009-03-01' ? 'unlimited' : null,
        mar09: card.tcgDate <= '2009-09-01' ? 'unlimited' : null,
        sep09: card.tcgDate <= '2010-03-01' ? 'unlimited' : null,
        mar10: card.tcgDate <= '2010-09-01' ? 'unlimited' : null,
        sep10: card.tcgDate <= '2011-03-01' ? 'unlimited' : null,
        mar11: card.tcgDate <= '2011-09-01' ? 'unlimited' : null,
        sep11: card.tcgDate <= '2012-03-01' ? 'unlimited' : null,
        mar12: card.tcgDate <= '2012-09-01' ? 'unlimited' : null,
        sep12: card.tcgDate <= '2013-03-01' ? 'unlimited' : null,
        mar13: card.tcgDate <= '2013-09-01' ? 'unlimited' : null,
        sep13: card.tcgDate <= '2013-10-01' ? 'unlimited' : null,
        oct13: card.tcgDate <= '2014-01-01' ? 'unlimited' : null,
        jan14: card.tcgDate <= '2014-04-01' ? 'unlimited' : null,
        apr14: card.tcgDate <= '2014-07-01' ? 'unlimited' : null,
        jul14: card.tcgDate <= '2014-10-01' ? 'unlimited' : null,
        oct14: card.tcgDate <= '2015-01-01' ? 'unlimited' : null,
        jan15: card.tcgDate <= '2015-04-01' ? 'unlimited' : null,
        apr15: card.tcgDate <= '2015-07-01' ? 'unlimited' : null,
        jul15: card.tcgDate <= '2015-11-01' ? 'unlimited' : null,
        nov15: card.tcgDate <= '2016-02-01' ? 'unlimited' : null,
        feb16: card.tcgDate <= '2016-04-01' ? 'unlimited' : null,
        apr16: card.tcgDate <= '2016-08-01' ? 'unlimited' : null,
        aug16: card.tcgDate <= '2017-03-01' ? 'unlimited' : null,
        mar17: card.tcgDate <= '2017-06-01' ? 'unlimited' : null,
        jun17: card.tcgDate <= '2017-09-01' ? 'unlimited' : null,
        sep17: card.tcgDate <= '2017-11-01' ? 'unlimited' : null,
        nov17: card.tcgDate <= '2018-02-01' ? 'unlimited' : null,
        feb18: card.tcgDate <= '2018-05-01' ? 'unlimited' : null,
        may18: card.tcgDate <= '2018-09-01' ? 'unlimited' : null,
        sep18: card.tcgDate <= '2018-12-01' ? 'unlimited' : null,
        dec18: card.tcgDate <= '2019-01-01' ? 'unlimited' : null,
        jan19: card.tcgDate <= '2019-04-01' ? 'unlimited' : null,
        apr19: card.tcgDate <= '2019-07-01' ? 'unlimited' : null,
        jul19: card.tcgDate <= '2019-10-01' ? 'unlimited' : null,
        oct19: card.tcgDate <= '2020-01-01' ? 'unlimited' : null,
        jan20: card.tcgDate <= '2020-04-01' ? 'unlimited' : null,
        apr20: card.tcgDate <= '2020-06-01' ? 'unlimited' : null,
        jun20: card.tcgDate <= '2020-09-01' ? 'unlimited' : null,
        sep20: card.tcgDate <= '2020-12-01' ? 'unlimited' : null,
        dec20: card.tcgDate <= '2021-03-01' ? 'unlimited' : null,
        dec20: card.tcgDate <= '2021-07-01' ? 'unlimited' : null,
        dec20: card.tcgDate <= '2021-10-01' ? 'unlimited' : null,
        dec20: card.tcgDate <= '2022-02-01' ? 'unlimited' : null,
        dec20: card.tcgDate <= '2022-05-01' ? 'unlimited' : null,
        mar21: 'unlimited'
    }
}

const ordinalize = (int) => {
    const suffixes = ["th", "st", "nd", "rd", "th", "th", "th", "th", "th", "th"]
    switch (int % 100) {
    case 11:
    case 12:
    case 13:
        return int + "th"
    default:
        return int + suffixes[int % 10]
    }
}

const shouldDisplay = (placement = 1, size = 0) => {
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

    return display
}

//URLIZE
const urlize = (str) => str.replace(/[\s]/g, '-').toLowerCase()

module.exports = {
    camelize,
    capitalize,
    arrayToObject,
    dateToSimple,
    dateToVerbose,
    generateDefaultStatus,
    ordinalize,
    shouldDisplay,
    urlize
}