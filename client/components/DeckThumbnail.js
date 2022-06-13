
import React from 'react'
import {capitalize} from '../../functions/utility'

const DeckThumbnail = (props = {}) => {
  const {deck} = props
  if (!deck) return <div/>

  return (
    <div>
        <h3>{capitalize(deck.type, true)}</h3>
        <div className="deckThumbnail-flexbox">
            <img 
              className="deckThumbnail-image" 
              src={`/images/artworks/${deck.leftCard}.jpg`} 
              onError={(e) => {
                e.target.onerror = null
                e.target.src="/images/artworks/question.jpg"
              }}
            />
            <img 
              className="deckThumbnail-image" 
              src={`/images/artworks/${deck.centerCard}.jpg`}
              onError={(e) => {
                e.target.onerror = null
                e.target.src="/images/artworks/question.jpg"
              }}
            />
            <img 
              className="deckThumbnail-image" 
              src={`/images/artworks/${deck.rightCard}.jpg`}
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
