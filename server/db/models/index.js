
const BlogPost = require('./BlogPost')
const Card = require('./Card')
const Deck = require('./Deck')
const DeckType = require('./DeckType')
const Event = require('./Event')
const Format = require('./Format')
const Player = require('./Player')
const Print = require('./Print')
const Set = require('./Set')
const Server = require('./Server')
const Stats = require('./Stats')
const Status = require('./Status')
const Tournament = require('./Tournament')

Player.hasMany(BlogPost)
BlogPost.belongsTo(Player)

Stats.belongsTo(Player)
Player.hasMany(Stats)

Tournament.belongsTo(Server)
Server.hasMany(Tournament)

Tournament.belongsTo(Event)
Event.hasOne(Tournament)

Status.belongsTo(Card)
Card.hasMany(Status)

Print.belongsTo(Card)
Card.hasMany(Print)

Print.belongsTo(Set)
Set.hasMany(Print)

Stats.belongsTo(Server)
Server.hasMany(Stats)

Player.hasMany(Deck)
Deck.belongsTo(Player)

Tournament.hasMany(Deck)
Deck.belongsTo(Tournament)

Event.hasMany(Deck)
Deck.belongsTo(Event)

DeckType.hasMany(Deck)
Deck.belongsTo(DeckType)

module.exports = {
  BlogPost,
  Card,
  Deck,
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
}
