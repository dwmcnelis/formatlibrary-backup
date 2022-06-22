/* eslint-disable complexity */
/* eslint-disable max-statements */

import React, { useState, useEffect } from 'react'
import BanListCreator from './BanListCreator'
import DeckCreator from './DeckCreator'
import DeckTypeCreator from './DeckTypeCreator'
import EventCreator from './EventCreator'
import NotFound from './NotFound'
import axios from 'axios'

const AdminPortal = () => {
    const [isAdmin, setIsAdmin] = useState(false)
    const [view, setView] = useState(false)

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
                    <div className="admin-menu">
                        <div onClick={() => setView('events')} className={view === 'events' ? 'clicked-admin-button' : 'admin-button'}>New Event</div>
                        <div onClick={() => setView('decks')} className={view === 'decks' ? 'clicked-admin-button' : 'admin-button'}>Upload Deck</div>
                        <div onClick={() => setView('deckTypes')} className={view === 'deckTypes' ? 'clicked-admin-button' : 'admin-button'}>New Deck Type</div>
                        <div onClick={() => setView('banLists')} className={view === 'banLists' ? 'clicked-admin-button' : 'admin-button'}>New Ban List</div>
                    </div>
                <div>
                {
                    view === 'decks' ? (
                        <DeckCreator/>
                    ) : view === 'events' ? (
                        <EventCreator/>
                    ) : view === 'deckTypes' ? (
                        <DeckTypeCreator/>
                    ) : view === 'banLists' ? (
                        <BanListCreator/>
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