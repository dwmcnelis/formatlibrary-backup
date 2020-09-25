import React from 'react'
import {Link} from 'react-router-dom'
import Logo from '../../public/images/logo.png'

const Navbar = () => (
  <div className="nav-bar">
    <div id="logo">
      <img src={Logo} />
    </div>
    <div id="title">
      <Link to="/">
        <h1 style={{color: 'white'}}>Card Database</h1>
      </Link>
    </div>
  </div>
)

export default Navbar
