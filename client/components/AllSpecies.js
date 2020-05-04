import React from 'react'
import {connect} from 'react-redux'
import Species from 'Species'

/**
 * COMPONENT
 */
export const AllSpecies = props => {
  const {species} = props

  return (
    <div>
      <h3>Browse by Species:</h3>
      <div>
        {species.length ? (
          <div>
            {species.map(function(lifeform) {
              return <Species key={lifeform.id} name={lifeform.name} />
            })}
          </div>
        ) : (
          <h3>'No Species'</h3>
        )}
      </div>
    </div>
  )
}

/**
 * CONTAINER
 */
const mapState = state => {
  return {
    species: state.species
  }
}

export default connect(mapState)(AllSpecies)
