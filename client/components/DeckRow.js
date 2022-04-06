
import React from 'react'
import { useHistory } from 'react-router-dom'
import { capitalize, ordinalize } from '../../functions/utility'
import formats from '../../static/formats.json'
import * as emojis from '../../public/images/emojis'
import { FL, GF, EF } from '../../public/images/logos'

/*eslint-disable*/
const DeckRow = (props) => {
  const {deck} = props
  const evenOrOdd = props.index % 2 ? 'even' : 'odd'
  const history = useHistory()
  const goToDeck = () => history.push(`/decks/${deck.id}`)
  const formatName = capitalize(deck.format, true) || '?'
  const backgroundImage = emojis[formats[formatName].logo] || ''
  const communityLogo = deck.community === 'Format Library' ? FL :
      deck.community === 'GoatFormat.com' ? GF :
      deck.community === 'EdisonFormat.com' ? EF :
      ''

  const tag = deck.player && deck.player.tag ? deck.player.tag : ''
  
  return (
      <tr style={{textAlign:'center'}} onClick={() => goToDeck()} className={`${evenOrOdd}-search-results-row`}>
        <td>
          <div className="format-cell-flexbox">
            <img src={backgroundImage}/>
            <div>{formatName}</div>
          </div>
        </td>
        <td>{capitalize(deck.deckType, true) || '?'}</td>
        <td>{capitalize(deck.deckCategory, true) || '?'}</td>
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
            <div>{deck.builder || '?'}</div>
          </div>
        </td>
        <td>{ordinalize(deck.placement) || 'N/A'}</td>
        <td>
          <div className="community-cell-flexbox">
            <img src={communityLogo}/>
            <div>{deck.event || '-'}</div>
          </div>
        </td>
        <td>{deck.createdAt.substring(0, 10)}</td>
      </tr>
  )
}

export default DeckRow
