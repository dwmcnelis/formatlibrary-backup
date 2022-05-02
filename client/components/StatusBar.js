import React from 'react'
import {Link} from 'react-router-dom'
import { capitalize } from '../../functions/utility'

//STATUS BOX
const StatusBox = (props) => {
  const { date, status } = props
  const backgroundColor = status === 'forbidden' ? 'red' :
    status === 'limited' ? 'orange' :
    status === 'semi-limited' ? 'yellow' :
    status === 'unlimited' ? 'green' :
    '#e8e8e8'

    return (
        <Link to={`/banlists/${date}`} key={date} className="status-cell" style={{backgroundColor}}>
           <p>{`${capitalize(date.slice(0, 3))} '${date.slice(-2)}`}</p>
        </Link>
    )
} 

export default StatusBox