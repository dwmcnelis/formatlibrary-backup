import React from 'react'
import {Link} from 'react-router-dom'

//Footer
const Footer = () => (
  <div className="footer">
    <div style={{textAlign: "center", display: "flex", flexDirection: "column", justifyContent: "space-between"}}>
      <a 
        href="https://discord.com/invite/formatlibrary" 
        target="_blank"
        rel="noopener noreferrer"
      >
        <div className="discord-link">
          <div className="discord-logo"/>
          <p className="discord-desc">Join our Discord!</p>
        </div>
      </a>
      <br/>
      <a 
        href="https://www.buymeacoffee.com/danielmcnelis" 
        target="_blank"
        rel="noreferrer"
        className="desktop-only"
      >
        <img 
          src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" 
          alt="Buy Me A Coffee" 
          style={{height: "20%", width: "73%"}}
        />
      </a>
    </div>
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
        <p className="disclaimer">Format Library is a public resource for learning about the Yu-Gi-Oh! Trading Card Game and its history. Trademarked artwork and card text is used for informational purposes under U.S. fair use copyright policy. Not affiliated with 4K Media or Konami Digital Entertainment.</p>
    </div>
    
    <div style={{textAlign: "center", display: "flex", flexDirection: "column", justifyContent: "space-between"}}>
      <Link to="/">
          <div className="footer-logo"/>
      </Link>
      <br/>
      <a 
        href="https://www.tcgplayer.com/search/yugioh/product?productLineName=yugioh&view=grid&utm_campaign=affiliate&utm_medium=FormatLibrary&utm_source=FormatLibrary" 
        target="_blank"
        rel="noreferrer"
        className="desktop-only"
      >
        <img 
          src="/images/logos/TCGPlayer.png" 
          alt="TCG Player" 
          style={{height: "20%", width: "73%"}}
        />
        <p style={{color: "white", margin: "4px 0px"}}>Shop to support our site!</p>
      </a>
    </div>
  </div>
)

export default Footer
