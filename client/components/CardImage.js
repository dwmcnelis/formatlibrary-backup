import React from 'react'
import {Link} from 'react-router-dom'
import { camelize } from '../../functions/utility'
import * as emojis from '../../public/images/emojis'

const CardImage = (props = {}) => {
  const {card, status, width, margin, padding} = props
  console.log('status', status)
  return (
    <div className="CardImage-box">
      {
        parseInt(width, 10) < 48 ? (
          <img
            src={`/images/cards/${card.ypdId}.jpg`}
            card={card}
            style={{width, margin, padding}}
            className="SmallCardImages"
            alt={card.name}
          />
        ) : (
          <Link to={`/cards/${
            card.name.replaceAll('%', '%25')
              .replaceAll('/', '%2F')
              .replaceAll(' ', '_')
              .replaceAll('#', '%23')
              .replaceAll('?', '%3F')
            }`}>
          {
            status ? <img src={emojis[status].png} className="status-icon"/> : null
          }
          <img
            src={`/images/cards/${card.ypdId}.jpg`}
            card={card}
            style={{width, margin, padding}}
            className="CardImages"
            alt={card.name}
          />
        </Link>
        )
      }
    </div>
  )
}

export default CardImage
