import React from 'react'
import {connect} from 'react-redux'

/**
 * COMPONENT
 */
export const SingleLocation = props => {
  const {email} = props

  return (
    <div>
      <h3>Selected Location:</h3>
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
