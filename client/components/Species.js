import React from 'react'
import {connect} from 'react-redux'

/**
 * COMPONENT
 */
export const Species = props => {
  const {species} = props

  return (
    <div>
      <h3>{species.name}</h3>
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

export default connect(mapState)(Species)
