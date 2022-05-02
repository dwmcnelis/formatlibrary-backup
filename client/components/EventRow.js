
import React from 'react'
import { Link } from 'react-router-dom'
import { capitalize, ordinalize } from '../../functions/utility'
import formats from '../../static/formats.json'
import * as emojis from '../../public/images/emojis'
import { FL, GF, EF } from '../../public/images/logos'

/*eslint-disable*/
const EventRow = (props) => {
  const {event} = props
  const evenOrOdd = props.index % 2 ? 'even' : 'odd'
  const formatName = capitalize(event.format, true) || '?'
  const backgroundImage = emojis[formats[formatName].logo] || ''
  const communityLogo = event.community === 'Format Library' ? FL :
      event.community === 'GoatFormat.com' ? GF :
      event.community === 'EdisonFormat.com' ? EF :
      ''
      
  const tag = event.player && event.player.tag ? event.player.tag : ''
  
  return (
      <tr className={`${evenOrOdd}-search-results-row`}>
        <td className="no-padding">
          <Link className="black-text" to={`/events/${event.shortName}`}>
            <div className="format-cell-flexbox">
              <img src={backgroundImage}/>
              <div>{formatName}</div>
            </div>
          </Link>
        </td>
        <td className="no-padding">
          <Link className="black-text" to={`/events/${event.shortName}`}>
            <div className="event-name-cell">
              {event.cleanName}
            </div>
          </Link>
        </td>
        <td className="no-padding">
          <Link className="black-text" to={`/events/${event.shortName}`}>
            <div className="player-cell">
              <img 
                  className="player-cell-pfp"
                  src={`/images/pfps/${tag.slice(0, -5)}${tag.slice(-4)}.png`}
                  onError={(e) => {
                          e.target.onerror = null
                          e.target.src="https://cdn.discordapp.com/embed/avatars/1.png"
                      }
                  }
              />
              <div>{event.player.winner || 'N/A'}</div>
            </div>
          </Link>
        </td>
        <td className="no-padding">
          <Link className="black-text" to={`/events/${event.shortName}`}>
            <div className="community-cell-flexbox">
              <img src={communityLogo}/>
              <div>{event.community}</div>
            </div>
          </Link>
        </td>
        <td className="no-padding">
          <Link className="black-text" to={`/events/${event.shortName}`}>
            <div className="size-cell">
              {event.size} 👤
            </div>
          </Link>
        </td>
        <td className="no-padding">
            <Link className="black-text" to={`/events/${event.shortName}`}>
              <div className="date-cell">
                  {event.startDate.substring(0, 10)}
              </div>
            </Link>
        </td>
      </tr>
  )
}

export default EventRow
