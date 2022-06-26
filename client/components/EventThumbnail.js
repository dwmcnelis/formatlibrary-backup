
import React from 'react'
import {capitalize} from '../../functions/utility'
import { Link } from 'react-router-dom'

const EventThumbnail = (props = {}) => {
    const {event, winner} = props
    if (!event || !winner) return <div/>

  return (
        <Link className='link' to={`/events/${event.abbreviation}`}>
          <div className="eventThumbnail">  
              <h3>{capitalize(event.abbreviation, true)}</h3>
              <div className="eventThumbnail-flexbox">
                  <img 
                    className="eventThumbnail-image" 
                    src={`/images/emojis/${event.format.icon}`}
                  />
                  <img 
                    className="eventThumbnail-player-pfp" 
                    src={`https://cdn.discordapp.com/avatars/${winner.id}.png`} 
                    onError={(e) => {
                            e.target.onerror = null
                            e.target.src="https://cdn.discordapp.com/embed/avatars/1.png"
                        }
                    }
                  />
                  <img 
                    className="eventThumbnail-image" 
                    src={`/images/logos/${event.community}.png`} 
                  />
              </div>
          </div>
        </Link>
  )
}

export default EventThumbnail