import React from 'react'
import {connect} from 'react-redux'
import {fetchSingleSighting, fetchPoster} from '../store/sightings'
import {fetchSingleSpecies} from '../store/species'
import Map from './Map'

/**
 * COMPONENT
 */
class SingleSighting extends React.Component {
  async componentDidMount() {
    const id = this.props.match.params.id
    await this.props.fetchSingleSighting(id)
    await this.props.fetchPoster(this.props.sighting.userId)
    await this.props.fetchSingleSpecies(this.props.sighting.speciesId)
  }

  render() {
    const {species, poster, sighting} = this.props
    const NS = sighting.latitude > 0 ? 'N' : 'S'
    const EW = sighting.longitude > 0 ? 'E' : 'W'

    return (
      <div>
        {sighting ? (
          <div>
            <br />
            <h3 style={{textAlign: 'center'}}>
              {poster.firstName}'s {species.commonName} Sighting:
            </h3>
            <br />
            <h5>
              {sighting.latitude}
              {'\xB0'}
              {NS}, {sighting.longitude}
              {'\xB0'}
              {EW}
            </h5>
            <br />
            <img className="single-sighting-image" src={sighting.imageUrl} />
            <p
              style={{
                textAlign: 'center',
                maxWidth: '75%',
                paddingLeft: '20%',
                paddingRight: '20%'
              }}
            >
              {sighting.description}
            </p>
            <br />
            <Map sightings={[sighting]} />
          </div>
        ) : (
          <h3>No Sighting</h3>
        )}
      </div>
    )
  }
}

/**
 * CONTAINER
 */
const mapState = state => {
  return {
    sighting: state.sightings.singleSighting,
    species: state.species.singleSpecies,
    poster: state.sightings.poster
  }
}

const mapDispatch = dispatch => ({
  fetchSingleSighting: id => dispatch(fetchSingleSighting(id)),
  fetchSingleSpecies: id => dispatch(fetchSingleSpecies(id)),
  fetchPoster: id => dispatch(fetchPoster(id))
})

export default connect(mapState, mapDispatch)(SingleSighting)
