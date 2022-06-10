
import React, { useState, useEffect, useLayoutEffect } from 'react'
import axios from 'axios'

const Login = () => {
    const [username, setUsername] = useState(null)
    const [password, setPassword] = useState(null)

  // USE LAYOUT EFFECT
  useLayoutEffect(() => window.scrollTo(0, 0))

  const login = async () => {
    const {data} = await axios.get(`/auth/login/${username}/${password}`)
    localStorage.setItem('username', data.username)
    localStorage.setItem('password', data.password)
    localStorage.setItem('isAdmin', data.isAdmin)
  }

  return (
      <div className="body">
            <p>Username:</p>
            <input
                id="username"
                className="login"
                type="text"
                onChange={(e) => setUsername(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === 'Enter') return login()
                }}
            />

            <p>Password:</p>
            <input
                id="username"
                className="login"
                type="text"
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === 'Enter') return login()
                }}
            />
      </div>
  )
}

export default Login