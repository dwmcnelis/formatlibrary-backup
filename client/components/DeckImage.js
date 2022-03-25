import React from 'react'
import {Link} from 'react-router-dom'
import CardImage from './CardImage'
import {capitalize, ordinalize} from '../../functions/utility'

const DeckImage = (props = {}) => {
  const {deck, width, margin, padding} = props
  if (!deck || !deck.main) return <div/>
  const main = deck.main
  const title = `${capitalize(deck.deckType, true)} - ${deck.player ? deck.player.name : deck.builder} - ${ordinalize(deck.placement)} - ${deck.event}`

  return (
    <div className="DeckImage-box">
      <Link to={`/decks/${deck.id}`}>
        <div id="main" className="DeckImages">
          <h4>{title}</h4>
          <div id="main" style={{width, margin, padding}} className="deck-flex-box">
            {
              main.map((card, index) => <CardImage width='36px' padding='0px' margin='0px' key={`${card.id}.${index}`}  card={card}/>)
            }
          </div>
        </div>
      </Link>
    </div>
  )
}

export default DeckImage
