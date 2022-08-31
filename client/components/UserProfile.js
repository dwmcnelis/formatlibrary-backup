
/* eslint-disable max-statements */

import React, { useState, useEffect, useLayoutEffect } from 'react'
import axios from 'axios'
import Badge from './Badge'
import Placement from './Placement'
import DeckThumbnail from './DeckThumbnail'
import NotFound from './NotFound'

const UserProfile = (props = {}) => {
    const [user, setUser] = useState({})
    const [stats, setStats] = useState([])
    const [decks, setDecks] = useState([])
    const [deckTypes, setDeckTypes] = useState([])

    // USE LAYOUT EFFECT
    useLayoutEffect(() => window.scrollTo(0, 0))

    // USE EFFECT SET USER
    useEffect(() => {
        const fetchData = async () => {
            try {
                const {data} = await axios.get(`/api/users/${props.match.params.id}`)
                setUser(data)
            } catch (err) {
                console.log(err)
                setUser(null)
            }
        }

        fetchData()
    }, [props.match.params])

    // USE EFFECT SET STATS
    useEffect(() => {
        const fetchData = async () => {
            try {
                const {data} = await axios.get(`/api/stats/${user.id}`)
                setStats(data)
            } catch (err) {
                console.log(err)
            } 
        }

        fetchData()
    }, [user])

    // USE EFFECT SET DECKS
    useEffect(() => {
        const fetchData = async () => {
            try {
                const {data} = await axios.get(`/api/decks/user/${user.id}`)
                setDecks(data)
            } catch (err) {
                console.log(err)
            } 
        }

        fetchData()
    }, [user])


    // USE EFFECT SET DECKS
    useEffect(() => {
        const fetchData = async () => {
            try {
                const {data} = await axios.get(`/api/decks/frequent/${user.id}`)
                setDeckTypes(data)
            } catch (err) {
                console.log(err)
            }
        }

        fetchData()
    }, [user])

    if (user === null) return <NotFound/>
    if (!user.id) return <div />

    return (
        <div className="body">
            <div className="user-profile-flexbox">
                <div className="user-info">
                    <div className="user-profile-title">{user.discordName}</div>
                    <img
                        className="user-pfp" 
                        src={`/images/pfps/${user.id}.png`} 
                        onError={(e) => {
                                e.target.onerror = null
                                e.target.src="https://cdn.discordapp.com/embed/avatars/1.png"
                            }
                        }
                    />
                    <table className="user-profile-table">
                        <tbody>
                            <tr className="user-profile-info">
                                <td>
                                    <div className="user-profile-cell">
                                        <div><b>Name:</b> {user.firstName || 'N/A'} {user.lastName || ''}</div>
                                    </div>       
                                </td>
                            </tr>
                            <tr className="user-profile-info">
                                <td>
                                    <div className="user-profile-cell">
                                        <div>
                                            <span>
                                                <b>Discord:</b> {user.discordName}
                                            </span>
                                            <span style={{color:"gray"}}>
                                                {user.discriminator} 
                                            </span>
                                        </div>
                                    </div>       
                                </td>
                            </tr>
                            <tr className="user-profile-info">
                                <td>
                                    <div className="user-profile-cell">
                                        <div><b>DuelingBook:</b> {user.duelingBook || 'N/A'}</div>
                                    </div>       
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div className="user-awards">
                {
                    stats.length ? (   
                        <div> 
                            <div className="badges-title">Best Formats:</div>
                            <div className="badges-flexbox">
                                {
                                    stats.map((s) => <Badge key={s.format} stats={s}/>)
                                }
                            </div>
                        </div>   
                    ) : ''
                }
                {
                    decks.length ? (   
                        <div> 
                            <div className="badges-title">Top Finishes:</div>
                            <div className="badges-flexbox">
                                {
                                    decks.map((d) => <Placement key={d.tournamentId} deck={d}/>)
                                }
                            </div>
                        </div>   
                    ) : ''
                }
                </div>
            </div>
            {
                deckTypes.length ? (  
                    <div id="popular-decks" className="popular-decks">
                        <h2>Favorite Decks:</h2>
                        <div className="popular-decks-flexbox">
                        {
                            deckTypes.map((dt) => <DeckThumbnail deck={dt} key={dt.id}/>)
                        }
                        </div>
                    </div>
                ) : ''
            }
        </div>
    )
}

export default UserProfile