import React from 'react'
import Map from './Map'
import {connect} from 'react-redux'

/**
 * COMPONENT
 */
export const Location = () => {
  return (
    <div>
      <br />
      <h3>Browse by Location:</h3>
      <br />
      <Map />
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

export default connect(mapState)(Location)
