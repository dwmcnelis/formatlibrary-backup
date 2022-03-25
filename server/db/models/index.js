
const BlogPost = require('./BlogPost')
const Card = require('./Card')
const Deck = require('./Deck')
const Format = require('./Format')
const Player = require('./Player')
const Print = require('./Print')
const Set = require('./Set')
const Status = require('./Status')
const Tournament = require('./Tournament')

Player.hasMany(BlogPost)
BlogPost.belongsTo(Player)

Card.hasOne(Status)
Status.belongsTo(Card)

Card.hasMany(Print)
Print.belongsTo(Card)

Player.hasMany(Deck)
Deck.belongsTo(Player)

Set.hasMany(Print)
Print.belongsTo(Set)

Tournament.hasMany(Deck)
Deck.belongsTo(Tournament)

module.exports = {
  BlogPost,
  Card,
  Deck,
  Format,
  Player,
  Print,
  Set,
  Status,
  Tournament
}
