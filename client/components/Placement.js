
import React from 'react'
import {First, Second, Third, Consolation} from '../../public/images/emojis'

/*eslint-disable*/

//PLACEMENT
const Placement = (props) => {
  const { deck } = props
  if (!deck || !deck.display) return <div/>
  
  const placementImage = deck.placement === 1 ? First :
    deck.placement === 2 ? Second :
    deck.placement === 3 ? Third :
    Consolation

  return (
    <div className="badge">
        <img src={placementImage}/>
        <div className="badge-label">{deck.event}</div>
    </div>
  )
}

export default Placement
