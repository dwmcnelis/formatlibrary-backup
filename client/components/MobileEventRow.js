
import React from 'react'
import { Link } from 'react-router-dom'
import { dateToSimple } from '../../functions/utility'

/*eslint-disable*/
const MobileEventRow = (props) => {
  const {event} = props
  const evenOrOdd = props.index % 2 ? 'even' : 'odd'
  const format = event.format || {}
  
  return (
      <tr className={`${evenOrOdd}-search-results-row`}>
        <td className="no-padding">
          <Link className="black-text" to={`/events/${event.abbreviation}`}>
            <div className="format-cell-flexbox">
              <img src={`/images/emojis/${format.icon}.png`}/>
              <div>{format.name}</div>
            </div>
          </Link>
        </td>
        <td className="no-padding">
          <Link className="black-text" to={`/events/${event.abbreviation}`}>
            <div className="event-name-cell">
              {event.abbreviation}
            </div>
          </Link>
        </td>
        <td className="no-padding">
            <Link className="black-text" to={`/events/${event.abbreviation}`}>
              <div className="date-cell">
                  {dateToSimple(event.startDate)}
              </div>
            </Link>
        </td>
      </tr>
  )
}

export default MobileEventRow
