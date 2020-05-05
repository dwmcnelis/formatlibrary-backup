import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'

/**
 * COMPONENT
 */
export const Home = props => {
  const firstName = props.firstName

  return (
    <div id="bear-mountain">
      <div id="welcome">
        {firstName ? (
          <div id="inner-welcome">
            <h1>Greetings, {firstName}!</h1>
            <br />
            <h2 style={{fontStyle: 'italic'}}>
              Nature was meant to be shared.
            </h2>
          </div>
        ) : (
          <div id="inner-welcome">
            <h1>Greetings, friend!</h1>
            <br />
            <h2 style={{fontStyle: 'italic'}}>
              Login or Signup to contribute.
            </h2>
          </div>
        )}
      </div>
    </div>
  )
}

/**
 * CONTAINER
 */
const mapState = state => {
  return {
    firstName: state.user.firstName
  }
}

export default connect(mapState)(Home)

/**
 * PROP TYPES
 */
Home.propTypes = {
  firstName: PropTypes.string
}
