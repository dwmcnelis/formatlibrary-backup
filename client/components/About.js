import React from 'react'
import {connect} from 'react-redux'

/**
 * COMPONENT
 */
export const About = props => {
  const {email} = props

  return (
    <div>
      <h3>Here at Nature Spotter...</h3>
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

export default connect(mapState)(About)
