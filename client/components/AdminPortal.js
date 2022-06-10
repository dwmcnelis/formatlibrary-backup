/* eslint-disable complexity */
/* eslint-disable max-statements */

import React, { useState, useEffect, useLayoutEffect } from 'react'
import { Link } from 'react-router-dom'
import NotFound from './NotFound'
import axios from 'axios'

const AdminPortal = () => {
    const [isAdmin, setIsAdmin] = useState(false)
    const [view, setView] = useState(false)

    // USE LAYOUT EFFECT
    useLayoutEffect(() => window.scrollTo(0, 0))

    // USE EFFECT
    useEffect(() => {
        const checkIfAdmin = async () => {
            const {data} = await axios.get(`/auth/admin`, {
                headers: {
                    username: localStorage.getItem('username'),
                    password: localStorage.getItem('password')
                }
            })
            
            setIsAdmin(data.isAdmin)
        } 

        checkIfAdmin()
    }, [])

    if (isAdmin) {
        return (
            <div className="body">
                <h1>Admin Portal</h1>
                <br />
                <div className="admin-menu">
                    <div onClick={() => setView('events')} className="admin-button">Create Event</div>
                    <div onClick={() => setView('decks')} className="admin-button">Upload Deck</div>
                </div>
                <div>
                {
                    view === 'decks' ? (
                        <div>
                            <p>Builder:</p>
                            <input
                                id="builder"
                                className="login"
                                type="text"
                            />
                            <p>Event:</p>
                            <input
                                id="event"
                                className="login"
                                type="text"
                            />
                            <p>Placement:</p>
                            <input
                                id="placement"
                                className="login"
                                type="text"
                            />
                            <p>Display:</p>
                            <input
                                id="display"
                                className="login"
                                type="text"
                            />
                            <p>YDK:</p>
                            <input
                                id="ydk"
                                className="login"
                                type="text"
                            />
                        </div>
                    ) : view === 'events' ? (
                        <div>
                            <p>Community:</p>
                            <input
                                id="community"
                                className="login"
                                type="text"
                            />
                            <p>Challonge URL:</p>
                            <input
                                id="url"
                                className="login"
                                type="text"
                            />
                            <p>Name:</p>
                            <input
                                id="name"
                                className="login"
                                type="text"
                            />
                            <p>Full Name:</p>
                            <input
                                id="full-name"
                                className="login"
                                type="text"
                            />
                            <p>Short Name:</p>
                            <input
                                id="short-name"
                                className="login"
                                type="text"
                            />
                            <p>Format:</p>
                            <input
                                id="format"
                                className="login"
                                type="text"
                            />
                            <p>Type:</p>
                            <input
                                id="type"
                                className="login"
                                type="text"
                            />
                            <p>Emoji:</p>
                            <input
                                id="emoji"
                                className="login"
                                type="text"
                            />
                            <p>Series:</p>
                            <input
                                id="series"
                                className="login"
                                type="text"
                            />
                            <p>Winner:</p>
                            <input
                                id="winner"
                                className="login"
                                type="text"
                            />
                            <p>Start Date:</p>
                            <input
                                id="start-date"
                                className="login"
                                type="text"
                            />
                        </div>
                    ) : ''
                }
                </div>
            </div>
        )
    } else {
        return <NotFound />
    }
}

export default AdminPortal