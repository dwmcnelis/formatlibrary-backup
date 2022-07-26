
import React from 'react'
import {First, Second, Third, Consolation} from '../../public/images/emojis'
import { Link } from 'react-router-dom'

/*eslint-disable*/

//PLACEMENT
const Placement = (props) => {
  const { deck } = props
  if (!deck) return <div/>
  
  const placementImage = deck.placement === 1 ? First :
    deck.placement === 2 ? Second :
    deck.placement === 3 ? Third :
    Consolation

  return (
    <Link className='link' to={`/events/${deck.eventName}`}>
      <div className="badge">
          <img src={placementImage}/>
          <div className="badge-label">{deck.eventName}</div>
      </div>
    </Link>
  )
}

export default Placement
