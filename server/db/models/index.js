const Card = require('./card')
const Status = require('./status')

Status.belongsTo(Card)
Card.hasOne(Status)

module.exports = {
  Card,
  Status
}
