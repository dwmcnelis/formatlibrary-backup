import React from 'react'
import {connect} from 'react-redux'

/**
 * COMPONENT
 */
export const NewSighting = props => {
  const {email} = props

  return (
    <div>
      <h3>New Sighting Form:</h3>
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

export default connect(mapState)(NewSighting)
