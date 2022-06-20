
import React from 'react'
import {capitalize} from '../../functions/utility'

const DeckThumbnail = (props = {}) => {
  const {deck} = props
  console.log('deck', deck)
  if (!deck) return <div/>

  return (
    <div>
        <h3>{capitalize(deck.type || deck.name, true)}</h3>
        <div className="deckThumbnail-flexbox">
            <img 
              className="deckThumbnail-image" 
              src={`/images/artworks/${deck.leftCardYpdId}.jpg`} 
              onError={(e) => {
                e.target.onerror = null
                e.target.src="/images/artworks/question.jpg"
              }}
            />
            <img 
              className="deckThumbnail-image" 
              src={`/images/artworks/${deck.centerCardYpdId}.jpg`}
              onError={(e) => {
                e.target.onerror = null
                e.target.src="/images/artworks/question.jpg"
              }}
            />
            <img 
              className="deckThumbnail-image" 
              src={`/images/artworks/${deck.rightCardYpdId}.jpg`}
              onError={(e) => {
                e.target.onerror = null
                e.target.src="/images/artworks/question.jpg"
              }}
            />
        </div>
    </div>
  )
}

export default DeckThumbnail
