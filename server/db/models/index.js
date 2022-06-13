
const BlogPost = require('./BlogPost')
const Card = require('./Card')
const Deck = require('./Deck')
const DeckThumb = require('./DeckThumb')
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

//DECKTYPE
DeckType.hasMany(Deck)
Deck.belongsTo(DeckType)

DeckType.hasMany(DeckThumb)
DeckThumb.belongsTo(DeckType)

//EVENT
Event.hasMany(Deck)
Deck.belongsTo(Event)

//PLAYER
Player.hasMany(BlogPost)
BlogPost.belongsTo(Player)

Player.hasMany(Deck)
Deck.belongsTo(Player)

Player.hasMany(Event)
Event.belongsTo(Player)

//PRINT
Print.belongsTo(Card)
Card.hasMany(Print)

Print.belongsTo(Set)
Set.hasMany(Print)

//STATS
Stats.belongsTo(Player)
Player.hasMany(Stats)

Stats.belongsTo(Server)
Server.hasMany(Stats)

//STATUS
Status.belongsTo(Card)
Card.hasMany(Status)

//TOURNAMENT
Tournament.hasMany(Deck)
Deck.belongsTo(Tournament)

Tournament.belongsTo(Event)
Event.hasOne(Tournament)

Tournament.belongsTo(Server)
Server.hasMany(Tournament)

module.exports = {
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
}
