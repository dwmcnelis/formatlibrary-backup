import React from 'react'
import {connect} from 'react-redux'

// Create the script tag, set the appropriate attributes
const script = document.createElement('script')
script.src =
  'https://maps.googleapis.com/maps/api/js?key=AIzaSyBxBpwc5WSEJbcis3OdtHj1uVvqlO9yuxY&callback=initMap'
script.defer = true
script.async = true

// Attach your callback function to the `window` object
window.initMap = function initMap() {
  const map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: -34.397, lng: 150.644},
    zoom: 8
  })
}

// Append the 'script' element to 'head'
document.head.appendChild(script)

/**
 * COMPONENT
 */
export const SingleLocation = props => {
  const {location} = props

  return (
    <div>
      <h3>Selected Location:</h3>
      <h6>{location}</h6>
      <div id="map" />
    </div>
  )
}

/**
 * CONTAINER
 */
const mapState = state => {
  return {
    email: state.user.email
  }
}

export default connect(mapState)(SingleLocation)
