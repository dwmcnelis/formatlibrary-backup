
import React from 'react'
import {capitalize} from '../../functions/utility'
import { FL, GF, EF } from '../../public/images/logos'
import { Link } from 'react-router-dom'

const EventThumbnail = (props = {}) => {
    const {event, winner} = props
    console.log('event.format', event.format)
    if (!event || !winner || !event.format) return <div/>
    const communityLogo = event.community === 'Format Library' ? FL :
        event.community === 'GoatFormat.com' ? GF :
        event.community === 'EdisonFormat.com' ? EF :
        ''

  return (
        <Link className='link' to={`/events/${event.abbreviation}`}>
          <div className="eventThumbnail">  
              <h3>{capitalize(event.abbreviation, true)}</h3>
              <div className="eventThumbnail-flexbox">
                  <img 
                    className="eventThumbnail-image" 
                    src={`/images/emojis${event.format.icon}`}
                  />
                  <img 
                    className="eventThumbnail-player-pfp" 
                    src={`https://cdn.discordapp.com/avatars/${winner.id}/${winner.avatar}.webp`} 
                    onError={(e) => {
                            e.target.onerror = null
                            e.target.src="https://cdn.discordapp.com/embed/avatars/1.png"
                        }
                    }
                  />
                  <img 
                    className="eventThumbnail-image" 
                    src={communityLogo} 
                  />
              </div>
          </div>
        </Link>
  )
}

export default EventThumbnail