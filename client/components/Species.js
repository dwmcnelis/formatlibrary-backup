import React from 'react'
import {connect} from 'react-redux'
import {Link} from 'react-router-dom'

/**
 * COMPONENT
 */
export const Species = props => {
  const {lifeform} = props

  return (
    <div className="single-species">
      <h3>{lifeform.commonName}</h3>
      <br />
      <Link to={`/species/${lifeform.id}`} className="single-species-link">
        <img className="species-image" src={lifeform.imageUrl} />
      </Link>
    </div>
  )
}

/**
 * CONTAINER
 */
const mapState = state => {
  return {
    species: state.species.species
  }
}

export default connect(mapState)(Species)
