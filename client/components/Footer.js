import React from 'react'
import {Link} from 'react-router-dom'

//Footer
const Footer = () => (
  <div className="footer">
    <a href="https://discord.com/invite/formatlibrary">
      <div className="discord-link">
          <div className="discord-logo"/>
          <p className="discord-desc">Join our Discord!</p>
      </div>
    </a>
    <div>
        <div id="footer-menu">
          <Link to="/cards/">
            <p className="footer-item">Card Database</p>
          </Link>
          <Link to="/decks/">
            <p className="footer-item">Deck Database</p>
          </Link>
          <Link to="/events/">
            <p className="footer-item">Event Coverage</p>
          </Link>
          <Link to="/formats/">
            <p className="footer-item">Format Intros</p>
          </Link>
        </div>
        <p className="disclaimer">Format Libray is a public resource for learning about the Yu-Gi-Oh! Trading Card Game and its history. Trademarked artwork and card text is used for informational purposes under U.S. fair use copyright policy. Not affiliated with 4K Media or Konami Digital Entertainment.</p>
    </div>
    <Link to="/">
      <div className="footer-logo"/>
    </Link>
  </div>
)

export default Footer
