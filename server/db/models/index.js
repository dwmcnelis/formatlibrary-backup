
const BlogPost = require('./BlogPost')
const Card = require('./Card')
const Deck = require('./Deck')
const DeckType = require('./DeckType')
const Format = require('./Format')
const Player = require('./Player')
const Print = require('./Print')
const Set = require('./Set')
const Stats = require('./Stats')
const Status = require('./Status')
const Tournament = require('./Tournament')

Player.hasMany(BlogPost)
BlogPost.belongsTo(Player)

Card.hasOne(Status)
Status.belongsTo(Card)

Card.hasMany(Print)
Print.belongsTo(Card)

// DeckType.hasMany(Deck)
// Deck.belongsTo(DeckType)

Player.hasMany(Deck)
Deck.belongsTo(Player)

Player.hasMany(Stats)
Stats.belongsTo(Player)

// Player.hasMany(Tournament)
// Tournament.belongsTo(Player)

Set.hasMany(Print)
Print.belongsTo(Set)

Tournament.hasMany(Deck)
Deck.belongsTo(Tournament)

module.exports = {
  BlogPost,
  Card,
  Deck,
  DeckType,
  Format,
  Player,
  Print,
  Set,
  Stats,
  Status,
  Tournament
}
