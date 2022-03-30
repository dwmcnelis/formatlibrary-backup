
import React from 'react'
import {capitalize} from '../../functions/utility'

const DeckThumbnail = (props = {}) => {
  const {deck} = props
  if (!deck) return <div/>

  return (
    <div>
        <h3>{capitalize(deck.name, true)}</h3>
        <div className="deckThumbnail-flex-box">
            <img className="deckThumbnail-image" src={`/images/artworks/${deck.leftCard}.jpg`}/>
            <img className="deckThumbnail-image" src={`/images/artworks/${deck.centerCard}.jpg`}/>
            <img className="deckThumbnail-image" src={`/images/artworks/${deck.rightCard}.jpg`}/>
        </div>
    </div>
  )
}

export default DeckThumbnail
