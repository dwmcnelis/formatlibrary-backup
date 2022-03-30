
import React from 'react'
import { Link } from 'react-router-dom'
import { capitalize } from '../../functions/utility'
import * as emojis from '../../public/images/emojis'

//FORMAT BUTTONS
const FormatButton = (props) => {
  const { format } = props
  if (!format) return
  const month = capitalize(format.banlist.slice(0, 3))
  const period = month !== 'May' ? '.' : ''
  const year = `20${format.banlist.slice(-2)}`

  return (
    <Link to={`/formats/${format.id}`} className="format-link" style={{ backgroundImage:`url(${emojis[format.icon]})`}}>
      <div className="format-button">
        <div>{format.name}</div>
        <div>{`${month}${period} ${year}`}</div>
      </div>
    </Link>
  )
}

export default FormatButton
