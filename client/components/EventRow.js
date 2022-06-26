
import React from 'react'
import { Link } from 'react-router-dom'

/*eslint-disable*/
const EventRow = (props) => {
  const {event} = props
  const evenOrOdd = props.index % 2 ? 'even' : 'odd'
  const format = event.format || {}
  
  return (
      <tr className={`${evenOrOdd}-search-results-row`}>
        <td className="no-padding">
          <Link className="black-text" to={`/events/${event.abbreviation}`}>
            <div className="format-cell-flexbox">
              <img src={`/images/emojis/${format.icon}`}/>
              <div>{format.name}</div>
            </div>
          </Link>
        </td>
        <td className="no-padding">
          <Link className="black-text" to={`/events/${event.abbreviation}`}>
            <div className="event-name-cell">
              {event.name}
            </div>
          </Link>
        </td>
        <td className="no-padding">
          <Link className="black-text" to={`/events/${event.abbreviation}`}>
            <div className="player-cell">
              <img 
                  className="player-cell-pfp"
                  src={`/images/pfps/${event.playerId}.png`}
                  onError={(e) => {
                          e.target.onerror = null
                          e.target.src="https://cdn.discordapp.com/embed/avatars/1.png"
                      }
                  }
              />
              <div>{event.winner || 'N/A'}</div>
            </div>
          </Link>
        </td>
        <td className="no-padding">
          <Link className="black-text" to={`/events/${event.abbreviation}`}>
            <div className="community-cell-flexbox">
              <img src={`/images/logos/${event.community}.png`}/>
              <div>{event.community}</div>
            </div>
          </Link>
        </td>
        <td className="no-padding">
          <Link className="black-text" to={`/events/${event.abbreviation}`}>
            <div className="size-cell">
              {event.size} 👤
            </div>
          </Link>
        </td>
        <td className="no-padding">
            <Link className="black-text" to={`/events/${event.abbreviation}`}>
              <div className="date-cell">
                  {event.startDate ? event.startDate.substring(0, 10) : ''}
              </div>
            </Link>
        </td>
      </tr>
  )
}

export default EventRow
