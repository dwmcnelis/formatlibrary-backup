
import React from 'react'
import { useHistory } from 'react-router-dom'
import { capitalize, ordinalize } from '../../functions/utility'
import formats from '../../static/formats.json'
import * as emojis from '../../public/images/emojis'
import { FL, GF, EF } from '../../public/images/logos'

/*eslint-disable*/
const EventRow = (props) => {
  const {event} = props
  const evenOrOdd = props.index % 2 ? 'even' : 'odd'
  const history = useHistory()
  const goToEvent = () => history.push(`/events/${event.shortName}`)
  const formatName = capitalize(event.format, true) || '?'
  const backgroundImage = emojis[formats[formatName].logo] || ''
  const communityLogo = event.community === 'Format Library' ? FL :
      event.community === 'GoatFormat.com' ? GF :
      event.community === 'EdisonFormat.com' ? EF :
      ''
      
  const tag = event.player && event.player.tag ? event.player.tag : ''
  
  return (
      <tr onClick={() => goToEvent()} className={`${evenOrOdd}-search-results-row`}>
        <td>
          <div className="format-cell-flexbox">
            <img src={backgroundImage}/>
            <div>{formatName}</div>
          </div>
        </td>
        <td>{event.cleanName}</td>
        <td>
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
            <div>{event.winner || 'N/A'}</div>
          </div>
        </td>
        <td>
          <div className="community-cell-flexbox">
            <img src={communityLogo}/>
            <div>{event.community}</div>
          </div>
        </td>
        <td className="event-size-cell">{event.size} 👤</td>
        <td className="event-date-cell">{event.startDate.substring(0, 10)}</td>
      </tr>
  )
}

export default EventRow
