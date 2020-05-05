import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {Link} from 'react-router-dom'
import {logout} from '../store'

const Navbar = ({handleClick, isLoggedIn}) => (
  <div>
    <h1 id="title">Nature Spotter</h1>
    <nav id="navbar">
      {isLoggedIn ? (
        <div>
          {/* The navbar will show these links after you log in */}
          <Link to="/home" className="nav-item">
            Home
          </Link>
          <Link to="/about" className="nav-item">
            About
          </Link>
          <Link to="/species" className="nav-item">
            Species
          </Link>
          {/*<Link to="/locations" className="nav-item">
            Locations
          </Link>*/}
          <Link to="/newsighting" className="nav-item">
            New Sighting
          </Link>
          <a href="#" onClick={handleClick} className="nav-item">
            Logout
          </a>
        </div>
      ) : (
        <div>
          {/* The navbar will show these links before you log in */}
          <Link to="/species" className="nav-item">
            Species
          </Link>
          {/*<Link to="/locations" className="nav-item">
            Locations
          </Link>*/}
          <Link to="/about" className="nav-item">
            About
          </Link>
          <Link to="/login" className="nav-item">
            Login
          </Link>
          <Link to="/signup" className="nav-item">
            Sign Up
          </Link>
        </div>
      )}
    </nav>
    <hr />
  </div>
)

/**
 * CONTAINER
 */
const mapState = state => {
  return {
    isLoggedIn: !!state.user.id
  }
}

const mapDispatch = dispatch => {
  return {
    handleClick() {
      dispatch(logout())
    }
  }
}

export default connect(mapState, mapDispatch)(Navbar)

/**
 * PROP TYPES
 */
Navbar.propTypes = {
  handleClick: PropTypes.func.isRequired,
  isLoggedIn: PropTypes.bool.isRequired
}
