import React from 'react'
import Logo from '../../public/images/logo.png'

const Navbar = () => (
  <div className="nav-bar">
    <div id="logo">
      <img src={Logo} />
    </div>
    <div id="title">
      <h1>Card Database</h1>
      <h3 style={{fontStyle: 'italic'}}>Beta Version</h3>
    </div>
  </div>
)

export default Navbar
