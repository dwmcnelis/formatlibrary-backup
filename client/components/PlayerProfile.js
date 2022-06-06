
/* eslint-disable max-statements */

import React, { useState, useEffect, useLayoutEffect } from 'react'
import axios from 'axios'
import Badge from './Badge'
import Placement from './Placement'
import DeckThumbnail from './DeckThumbnail'
import NotFound from './NotFound'

const PlayerProfile = (props = {}) => {
    const [player, setPlayer] = useState({})
    const [stats, setStats] = useState([])
    const [decks, setDecks] = useState([])
    const [deckTypes, setDeckTypes] = useState([])

    // USE LAYOUT EFFECT
    useLayoutEffect(() => window.scrollTo(0, 0))

    // USE EFFECT SET PLAYER
    useEffect(() => {
        const fetchData = async () => {
            try {
                const {data} = await axios.get(`/api/players/${props.match.params.id}`)
                setPlayer(data)
            } catch (err) {
                console.log(err)
                setPlayer(null)
            }
        }

        fetchData()
    }, [props.match.params])

    // USE EFFECT SET STATS
    useEffect(() => {
        const fetchData = async () => {
            try {
                const {data} = await axios.get(`/api/stats/${player.id}`)
                setStats(data)
            } catch (err) {
                console.log(err)
            } 
        }

        fetchData()
    }, [player])

    // USE EFFECT SET DECKS
    useEffect(() => {
        const fetchData = async () => {
            try {
                const {data} = await axios.get(`/api/decks/player/${player.id}`)
                setDecks(data)
            } catch (err) {
                console.log(err)
            } 
        }

        fetchData()
    }, [player])


    // USE EFFECT SET DECKS
    useEffect(() => {
        const fetchData = async () => {
            try {
                const {data} = await axios.get(`/api/decks/frequent/${player.id}`)
                setDeckTypes(data)
            } catch (err) {
                console.log(err)
            }
        }

        fetchData()
    }, [player])

    if (player === null) return <NotFound/>
    if (!player.id) return <div />

    return (
        <div className="body">
            <div className="player-profile-flexbox">
                <div className="player-info">
                    <div className="player-profile-title">{player.tag.slice(0, -5)}</div>
                    <img
                        className="player-pfp" 
                        src={`/images/pfps/${player.id}.png`} 
                        onError={(e) => {
                                e.target.onerror = null
                                e.target.src="https://cdn.discordapp.com/embed/avatars/1.png"
                            }
                        }
                    />
                    <table className="player-profile-table">
                        <tbody>
                            <tr className="player-profile-info">
                                <td>
                                    <div className="player-profile-cell">
                                        <div><b>Name:</b> {player.realName || 'N/A'}</div>
                                    </div>       
                                </td>
                            </tr>
                            <tr className="player-profile-info">
                                <td>
                                    <div className="player-profile-cell">
                                        <div>
                                            <span>
                                                <b>Discord:</b> {player.tag.slice(0, -5) + ' '}
                                            </span>
                                            <span style={{color:"gray"}}>
                                                {player.tag.slice(-5)} 
                                            </span>
                                        </div>
                                    </div>       
                                </td>
                            </tr>
                            <tr className="player-profile-info">
                                <td>
                                    <div className="player-profile-cell">
                                        <div><b>DuelingBook:</b> {player.duelingBook || 'N/A'}</div>
                                    </div>       
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div className="player-awards">
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

export default PlayerProfile