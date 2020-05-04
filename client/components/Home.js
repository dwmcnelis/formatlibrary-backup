import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'

/**
 * COMPONENT
 */
export const Home = props => {
  const {email} = props

  return (
    <div id="bear-mountain">
      <div id="welcome">
        <div id="inner-welcome">
          <h1>Greetings, {email}</h1>
          <h2>Nature was meant to be shared.</h2>
        </div>
      </div>
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

export default connect(mapState)(Home)

/**
 * PROP TYPES
 */
Home.propTypes = {
  email: PropTypes.string
}
