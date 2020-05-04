import React from 'react'
import {connect} from 'react-redux'

/**
 * COMPONENT
 */
export const SingleSpecies = props => {
  const {email} = props

  return (
    <div>
      <h3>Browse by Species:</h3>
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

export default connect(mapState)(SingleSpecies)
