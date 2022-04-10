import React from 'react'
import {Link} from 'react-router-dom'

const toggle = () => {
  const menu = document.getElementById("hamburger-menu")
  menu.classList.toggle("open")
  menu.classList.toggle("closed")
}

//NavBar
const NavBar = () => (
  <div className="nav-bar">
    <Link to="/">
      <div id="logo">
        <img src={'/images/logos/FL.png'} />
        <h1>Format Library</h1>
      </div>
    </Link>
    <div id="nav-menu">
      <Link to="/">
        <h2 id="home-button" className="nav-item">HOME</h2>
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
    <div id="hamburger-menu" className="closed" onClick={() => toggle()}>
      <div id="hamburger-button" className="closed-b">≡</div>
      <div id="hamburger-button" className="open-b">⌄</div>
      <Link to="/cards/">
        <h3 className="hamburger-item">Cards</h3>
      </Link>
      <Link to="/decks/">
        <h3 className="hamburger-item">Decks</h3>
      </Link>
      <Link to="/events/">
        <h3 className="hamburger-item">Events</h3>
      </Link>
      <Link to="/formats/">
        <h3 className="hamburger-item">Formats</h3>
      </Link>
    </div>
  </div>
)

export default NavBar
