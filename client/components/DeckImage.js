import React from 'react'
import {Link} from 'react-router-dom'
import {capitalize, ordinalize} from '../../functions/utility'

const DeckImage = (props = {}) => {
  const {deck, width, margin, padding, coverage} = props
  if (!deck) return <div/>
  const deckType = capitalize(deck.deckType, true)
  const fullName = deck.player ? deck.player.name : deck.builder
  const displayName = fullName.length <= 17 ? fullName : fullName.slice(0, 17).split(' ').slice(0, -1).join(' ')
  const placement = ordinalize(deck.placement)
  const title = coverage ? `${deckType} - ${displayName} - ${placement}` :
    `${deckType} - ${displayName} - ${deck.event}`

  return (
    <div className="DeckImage-box">
      <Link to={`/decks/${deck.id}`}>
        <div id="main" className="DeckImages">
          <h4 style={{width}}>{title}</h4>
          <div id="main" style={{width, margin, padding}} className="deck-flexbox">
            <img src={`/images/decks/thumbnails/${deck.id}.png`}></img>
          </div>
        </div>
      </Link>
    </div>
  )
}

export default DeckImage
