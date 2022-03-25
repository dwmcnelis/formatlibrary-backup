import React from 'react'
import {Link} from 'react-router-dom'

//STATUS BOX
const StatusBox = (props) => {
  const { status } = props
  const date = `${status[0].slice(0, 1).toUpperCase()}${status[0].slice(1, 3)} '${status[0].slice(3)}`
  const backgroundColor = status[1] === 'forbidden' ? 'red' :
    status[1] === 'limited' ? 'orange' :
    status[1] === 'semi-limited' ? 'yellow' :
    status[1] === 'unlimited' ? 'green' :
    '#e8e8e8'

    return (
        <Link to={`/formats/${status[0]}`} key={status[0]}className="status-cell" style={{backgroundColor}}>
           <p>{date}</p>
        </Link>
    )
} 

export default StatusBox