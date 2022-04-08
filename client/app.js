
import React from 'react'
import Footer from './components/Footer'
import NavBar from './components/NavBar'
import Routes from './routes'

const App = () => {
  return (
    <div className="app">
      <NavBar />
      <Routes />
      <Footer />
    </div>
  )
}

export default App
