import React from 'react'
import {connect} from 'react-redux'
import PropTypes from 'prop-types'
import {auth} from '../store'

/**
 * COMPONENT
 */
const AuthForm = props => {
  const {method, displayName, handleSubmit, error} = props

  return (
    <div className="auth-container">
      <form
        onSubmit={evt => handleSubmit(evt, method)}
        method={method}
        className="auth-form"
      >
        {method === 'signup' && (
          <div className="auth-item">
            {/* <label htmlFor="firstName">
            <small>First Name</small>
          </label> */}
            <input name="firstName" type="text" placeholder="First Name" />
          </div>
        )}
        {method === 'signup' && (
          <div className="auth-item">
            {/* <label htmlFor="lastName">
            <small>Last Name</small>
          </label> */}
            <input name="lastName" type="text" placeholder="Last Name" />
          </div>
        )}
        <div className="auth-item">
          {/* <label htmlFor="email">
            <small>Email</small>
          </label> */}
          <input name="email" type="text" placeholder="Email" />
        </div>
        <div className="auth-item">
          {/* <label htmlFor="password">
            <small>Password</small>
          </label> */}
          <input name="password" type="password" placeholder="Password" />
        </div>
        <div className="auth-item">
          <button type="submit" className="btn">
            {displayName}{' '}
          </button>
          <a className="btn-outline" href="/auth/google">
            {displayName} with Google
          </a>
        </div>
        {error && error.response && <div> {error.response.data} </div>}
      </form>
    </div>
  )
}

/**
 * CONTAINER
 *   Note that we have two different sets of 'mapStateToProps' functions -
 *   one for Login, and one for Signup. However, they share the same 'mapDispatchToProps'
 *   function, and share the same Component. This is a good example of how we
 *   can stay DRY with interfaces that are very similar to each other!
 */
const mapLogin = state => {
  return {
    method: 'login',
    displayName: 'Login',
    error: state.user.error
  }
}

const mapSignup = state => {
  return {
    method: 'signup',
    displayName: 'Sign Up',
    error: state.user.error
  }
}

const mapDispatch = dispatch => {
  return {
    handleSubmit(evt, method) {
      evt.preventDefault()
      const firstName = evt.target.firstName ? evt.target.firstName.value : ''
      const lastName = evt.target.lastName ? evt.target.lastName.value : ''
      const email = evt.target.email.value
      const password = evt.target.password.value
      dispatch(auth(email, password, firstName, lastName, method))
    }
  }
}

export const Login = connect(mapLogin, mapDispatch)(AuthForm)
export const Signup = connect(mapSignup, mapDispatch)(AuthForm)

/**
 * PROP TYPES
 */
AuthForm.propTypes = {
  method: PropTypes.string.isRequired,
  displayName: PropTypes.string.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  error: PropTypes.object
}
