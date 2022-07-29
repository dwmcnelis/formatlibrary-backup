import React from 'react'
import {Link} from 'react-router-dom'

const CardImage = (props = {}) => {
  const {card, status, width, margin, padding} = props

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
              <div className="card-image-cell">
                {
                  status ? <img src={`/images/emojis/${status}.png`} className="status-icon"/> : null
                }
                <img
                  src={`/images/cards/${card.ypdId}.jpg`}
                  card={card}
                  style={{width, margin, padding}}
                  className="CardImages"
                  alt={card.name}
                />
              </div>
        </Link>
        )
      }
    </div>
  )
}

export default CardImage
