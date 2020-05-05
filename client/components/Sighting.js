import React from 'react'
import {Link} from 'react-router-dom'

/**
 * COMPONENT
 */
export const Sighting = props => {
  const {sighting} = props
  const NS = sighting.latitude > 0 ? 'N' : 'S'
  const EW = sighting.longitude > 0 ? 'E' : 'W'

  return (
    <div className="single-sighting">
      <Link to={`/sightings/${sighting.id}`} className="single-sighting-link">
        <img className="sighting-image" src={sighting.imageUrl} />
      </Link>
      <br />
      <h3>
        {sighting.latitude}
        {'\xB0'}
        {NS}, {sighting.longitude}
        {'\xB0'}
        {EW}
      </h3>
    </div>
  )
}

export default Sighting
