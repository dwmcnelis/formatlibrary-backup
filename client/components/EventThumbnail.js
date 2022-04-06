
import React from 'react'
import { useHistory } from 'react-router-dom'
import {capitalize} from '../../functions/utility'
import formats from '../../static/formats.json'
import * as emojis from '../../public/images/emojis'
import { FL, GF, EF } from '../../public/images/logos'

const EventThumbnail = (props = {}) => {
    const {event, winner} = props
    if (!event || !winner) return <div/>
    const communityLogo = event.community === 'Format Library' ? FL :
        event.community === 'GoatFormat.com' ? GF :
        event.community === 'EdisonFormat.com' ? EF :
        ''

    const formatName = capitalize(event.format, true) || '?'
    const backgroundImage = emojis[formats[formatName].logo] || ''
    const history = useHistory()
    const goToEvent = () => history.push(`/events/${event.shortName}`)

  return (
    <div className="eventThumbnail" onClick={() => goToEvent()}>
        <h3>{capitalize(event.shortName, true)}</h3>
        <div className="eventThumbnail-flexbox">
            <img 
              className="eventThumbnail-image" 
              src={backgroundImage}
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
  )
}

export default EventThumbnail