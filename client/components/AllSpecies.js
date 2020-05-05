import React from 'react'
import {connect} from 'react-redux'
import Species from './Species'
import {fetchAllSpecies} from '../store/species'

/**
 * COMPONENT
 */
class AllSpecies extends React.Component {
  componentDidMount() {
    this.props.fetchAllSpecies()
  }

  render() {
    const {species} = this.props
    return (
      <div>
        <br />
        <h2>Browse by Species:</h2>
        <div className="all-species-container">
          {species.length ? (
            <div className="all-species">
              {species.map(function(lifeform) {
                return <Species key={lifeform.id} lifeform={lifeform} />
              })}
            </div>
          ) : (
            <h3>'No Species'</h3>
          )}
        </div>
      </div>
    )
  }
}

/**
 * CONTAINER
 */
const mapState = state => {
  return {
    species: state.species.allSpecies
  }
}

const mapDispatch = dispatch => ({
  fetchAllSpecies: () => dispatch(fetchAllSpecies())
})

export default connect(mapState, mapDispatch)(AllSpecies)
