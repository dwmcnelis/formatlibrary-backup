import React from 'react'
import {connect} from 'react-redux'
import {fetchSingleSpecies} from '../store/species'
import {fetchSpeciesSightings} from '../store/sightings'
import Sighting from './Sighting'
import Map from './Map'

// Create the script tag, set the appropriate attributes
// const script = document.createElement('script')
// script.src =
//   'https://maps.googleapis.com/maps/api/js?key=AIzaSyBxBpwc5WSEJbcis3OdtHj1uVvqlO9yuxY&callback=initMap'
// script.defer = true
// script.async = true

// // // Attach your callback function to the `window` object
// // window.initMap = function initMap() {
// //   let map = new google.maps.Map(document.getElementById('singleSpeciesMap'), {
// //     center: {lat: -34.397, lng: 150.644},
// //     zoom: 8
// //   })
// // }

// // Append the 'script' element to 'head'
// document.head.appendChild(script)

/**
 * COMPONENT
 */
class SingleSpecies extends React.Component {
  componentDidMount() {
    const id = this.props.match.params.id
    this.props.fetchSingleSpecies(id)
    this.props.fetchSpeciesSightings(id)
  }

  render() {
    const {species, sightings} = this.props
    return (
      <div>
        {species ? (
          <div>
            <br />
            <h3>{species.commonName}</h3>
            <p style={{fontStyle: 'italic', textAlign: 'center'}}>
              {species.scientificName}
            </p>
            <img className="single-species-image" src={species.imageUrl} />
            <p
              style={{
                textAlign: 'center',
                maxWidth: '75%',
                paddingLeft: '20%',
                paddingRight: '20%'
              }}
            >
              {species.description}
            </p>
            <div>
              <h3>Sightings:</h3>
              <br />
              {sightings.length ? (
                <div className="species-sightings">
                  <Map sightings={sightings} />
                  <br />
                  {sightings.map(function(sighting) {
                    console.log(sighting)
                    return <Sighting key={sighting.id} sighting={sighting} />
                  })}
                </div>
              ) : (
                <h3>No Sightings</h3>
              )}
            </div>
          </div>
        ) : (
          <h3>No Species</h3>
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
    species: state.species.singleSpecies,
    sightings: state.sightings.speciesSightings,
    sighting: state.sightings.singleSighting
  }
}

const mapDispatch = dispatch => ({
  fetchSingleSpecies: id => dispatch(fetchSingleSpecies(id)),
  fetchSpeciesSightings: id => dispatch(fetchSpeciesSightings(id))
})

export default connect(mapState, mapDispatch)(SingleSpecies)
