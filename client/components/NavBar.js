import React from 'react'
import {Link} from 'react-router-dom'

//NavBar
const NavBar = () => (
  <div className="nav-bar">
    <Link to="/">
      <div id="logo">
        <img src={'/favicon.ico'} />
        <h1>Format Library</h1>
      </div>
    </Link>
    <div id="nav-menu">
      <Link to="/">
        <h2 className="nav-item">HOME</h2>
      </Link>
      <Link to="/cards/">
        <h2 className="nav-item">CARDS</h2>
      </Link>
      <Link to="/decks/">
        <h2 className="nav-item">DECKS</h2>
      </Link>
      <Link to="/events/">
        <h2 className="nav-item">EVENTS</h2>
      </Link>
      <Link to="/formats/">
        <h2 className="nav-item">FORMATS</h2>
      </Link>
    </div>
  </div>
)

export default NavBar
