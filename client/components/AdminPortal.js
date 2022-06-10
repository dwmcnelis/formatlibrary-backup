
import React, { useState, useEffect, useLayoutEffect } from 'react'
import NotFound from './NotFound'
import axios from 'axios'

const AdminPortal = () => {
    const [isAdmin, setIsAdmin] = useState(false)
    console.log('isAdmin', isAdmin)

    // USE LAYOUT EFFECT
    useLayoutEffect(() => window.scrollTo(0, 0))

    useEffect(() => {
      const checkIfAdmin = async () => {
        const {data} = await axios.get(`/auth/admin`, {
            headers: {
                username: localStorage.getItem('username'),
                password: localStorage.getItem('password')
            }
        })

        console.log('data', data)

        setIsAdmin(data.isAdmin)
      }

      checkIfAdmin()
    })

    if (isAdmin) {
        return (
            <div className="body">
                <h1>Admin Portal</h1>
                <br />
                <div className="admin-menu">
                    <Link to={`/admin-portal/events`} className="admin-link">
                        <div className="admin-button">Create Events</div>
                    </Link>
                    <Link to={`/admin-portal/decks`} className="admin-link">
                        <div className="admin-button">Upload Decks</div>
                    </Link>
                </div>
            </div>
        )
    } else {
        return <NotFound />
    }
}

export default AdminPortal