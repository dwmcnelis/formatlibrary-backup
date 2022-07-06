
import React from 'react'
import { Link } from 'react-router-dom'
import { capitalize, ordinalize } from '../../functions/utility'
import formats from '../../static/formats.json'
import * as emojis from '../../public/images/emojis'

/*eslint-disable*/
const DeckRow = (props) => {
  const {deck} = props
  const evenOrOdd = props.index % 2 ? 'even' : 'odd'
  const formatName = capitalize(deck.format, true) || '?'
  const backgroundImage = emojis[formats[formatName].logo] || ''
  
  return (
        <tr className={`${evenOrOdd}-search-results-row`}>
          <td className="no-padding">
            <Link className="black-text" to={`/decks/${deck.id}`}>
              <div className="format-cell-flexbox">
                <img src={backgroundImage}/>
                <div>{formatName}</div>
              </div>
            </Link>
          </td>
          <td className="no-padding">
            <Link className="black-text" to={`/decks/${deck.id}`}>
              <div className="deckType-cell">
                {capitalize(deck.type, true) || '?'}
              </div>
            </Link>
          </td>
          <td className="no-padding">
            <Link className="black-text" to={`/decks/${deck.id}`}>
              <div className="deckCategory-cell">
                {capitalize(deck.category, true) || '?'}
              </div>
            </Link>
          </td>
          <td className="no-padding">
            <Link className="black-text" to={`/decks/${deck.id}`}>
              <div className="player-cell">
                <img 
                    className="player-cell-pfp"
                    src={`/images/pfps/${deck.playerId}.png`}
                    onError={(e) => {
                            e.target.onerror = null
                            e.target.src="https://cdn.discordapp.com/embed/avatars/1.png"
                        }
                    }
                />
                <div>{deck.builder || '?'}</div>
              </div>
            </Link>
          </td>
          <td className="no-padding">
            <Link className="black-text" to={`/decks/${deck.id}`}>
              <div className="placement-cell">
                {ordinalize(deck.placement) || 'N/A'}
              </div>
            </Link>
          </td>
          <td className="no-padding">
            <Link className="black-text" to={`/decks/${deck.id}`}>
              <div className="community-cell-flexbox">
                <img src={`/images/logos/${deck.community}.png`}/>
                <div>{deck.eventName || '-'}</div>
              </div>
            </Link>
          </td>
          <td className="no-padding">
            <Link className="black-text" to={`/decks/${deck.id}`}>
              <div className="date-cell">
                {deck.eventDate ? deck.eventDate.substring(0, 10) : ''}
              </div>
            </Link>
          </td>
        </tr>
  )
}

export default DeckRow
