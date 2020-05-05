import React from 'react'

// THIS IS NEEDED FOR GOOGLE MAPS API
const script = document.createElement('script')
script.src =
  'https://maps.googleapis.com/maps/api/js?key=AIzaSyBxBpwc5WSEJbcis3OdtHj1uVvqlO9yuxY&callback=initMap'
script.defer = true
script.async = true

class Map extends React.Component {
  render() {
    let sightings = this.props.sightings

    if (sightings.length) {
      let locations = sightings.map(function(sighting) {
        return {
          lat: sighting.latitude,
          lng: sighting.longitude
        }
      })

      // Attach your callback function to the `window` object
      window.initMap = function initMap() {
        let map = new google.maps.Map(document.getElementById('map'), {
          center: locations[0],
          zoom: 8
        })

        locations.forEach(function(location) {
          let marker = new google.maps.Marker({position: location, map: map})
        })
      }

      // Append the 'script' element to 'head'
      document.head.appendChild(script)
    }

    return <div id="map" />
  }
}

export default Map
