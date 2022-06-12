/* eslint-disable complexity */
/* eslint-disable max-statements */

import React, { useState, useEffect, useLayoutEffect } from 'react'
import { Link } from 'react-router-dom'
import NotFound from './NotFound'
import axios from 'axios'
import { challongeAPIKeys } from '../../secrets.js'

const AdminPortal = () => {
    const [isAdmin, setIsAdmin] = useState(false)
    const [view, setView] = useState(false)
    const [formats, setFormats] = useState([])
    const [format, setFormat] = useState(null)
    const [community, setCommunity] = useState(null)
    const [events, setEvents] = useState([])
    const [event, setEvent] = useState(null)
    const [placement, setPlacement] = useState(1)
    const [deckTypes, setDeckTypes] = useState([])
    const [deckType, setDeckType] = useState(null)
    const [display, setDisplay] = useState(true)
    const [startDate, setStartDate] = useState(null)
    const [url, setUrl] = useState(null)
    const [fullName, setFullName] = useState(null)
    const [abbreviation, setAbbreviation] = useState(null)
    const [size, setSize] = useState(null)
    const [isSeries, setIsSeries] = useState(true)
    const [tournamentType, setTournamentType] = useState(true)
    const [tournamentId, setTournamentId] = useState(null)
    const [ydk, setYDK] = useState(null)
    const [players, setPlayers] = useState([])
    const [player, setPlayer] = useState(null)
    const placementArr = event ? Array.from({length: event.size}, (_, i) => i + 1) : []
    const eventButtonClass = view === 'events' ? 'clicked-admin-button' : 'admin-button'
    const deckButtonClass = view === 'decks' ? 'clicked-admin-button' : 'admin-button'

    const reset = async () => {
        setFormat(null)
        setCommunity(null)
        setEvent(null)
        setPlacement(1)
        setDeckType(null)
        setDisplay(true)
        setStartDate(null)
        setUrl(null)
        setFullName(null)
        setAbbreviation(null)
        setSize(null)
        setIsSeries(true)
        setTournamentType(true)
        setTournamentId(null)
        setYDK(null)
        setPlayer(null)        
    }

    const createDeck = async () => {
        if (!player) return alert('No Player found.')
        if (!event) return alert('No Event found.')
        if (!ydk) return alert('Missing YDK file.')
        if (!deckType) return alert('Please select a Deck Type.')
        if (!placement) return alert('Please select a Placement.')
        
        try {
            const { data } = await axios.post('/api/decks/create', {
                builder: player.name,
                name: deckType.name,
                deckType: deckType.name,
                deckCategory: deckType.category,
                format: event.format,
                ydk: ydk,
                event: event.shortName,
                placement: placement,
                community: community,
                display: display,
                playerId: player.id,
                tournamentId: event.id
            })

            alert(`Success! New Event: https://formatlibrary.com/decks/${data.id}`)
            return reset()
        } catch (err) {
            console.log(err)
        }
    }

    const createEvent = async () => {
        if (!community) return alert('Please Select a Community.')
        if (!url) return alert('No URL Found.')
        if (!fullName) return alert('Please provide a Full Name.')
        if (!abbreviation) return alert('Please provide an Abbreviation.')
        if (!format) return alert('Please select a Format.')
        if (!size) return alert('Please specify the Tournament Size.')
        if (!tournamentType) return alert('Please select a Tournament Type.')
        if (!tournamentId) return alert('Tournament not found on Challonge.')
        if (!player) return alert('No Winner Found.')
        if (!startDate) return alert('Please select a Start Date.')
        
        try {
            const { data } = await axios.post('/api/tournaments/create', {
                id: tournamentId,
                community: community,
                url: url,
                name: fullName,
                cleanName: fullName,
                shortName: abbreviation,
                format: format,
                size: size,
                series: isSeries,
                type: tournamentType,
                winner: player.name,
                playerId: player.id,
                startDate: startDate
            })

            alert(`Success! New Event: https://formatlibrary.com/events/${data.shortName}`)
            return reset()
        } catch (err) {
            console.log(err)
        }
    }

    const getTournament = async (url) => {
        setUrl(url)

        try {
            const name = url.slice(url.indexOf('challonge.com/') + 14)
            const {data} = await axios.get(`/api/tournaments/challonge/${name}`, {
                headers: {
                    community: community
                }
            })
            
            setTournamentId(data.id.toString())
        } catch (err) {
            console.log(err)
        }
    }

    const read = (file) => {
        const reader = new FileReader()
        reader.readAsBinaryString(file)
        reader.onloadend = () => setYDK(reader.result)
    }

    const findPlayers = async (query) => {
        const {data} = await axios.get(`/api/players/query/${query}`)
        setPlayers(data)
        setPlayer(data[0])
    }

    const getPlayer = async (name) => {
        const elem = players.filter((e) => e.name === name)[0]
        return setPlayer(elem)
    }

    const getDeckType = async (name) => {
        const elem = deckTypes.filter((e) => e.name === name)[0]
        return setDeckType(elem)
    }

    const getEvent = async (cleanName) => {
        const elem = events.filter((e) => e.cleanName === cleanName)[0]
        return setEvent(elem)
    }

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

        const fetchDeckTypes = async () => {
            const {data} = await axios.get(`/api/decks/types`)
            setDeckTypes(data)
        }

        const fetchFormats = async () => {
            const {data} = await axios.get(`/api/formats`)
            setFormats(data)
        }
        
        checkIfAdmin()
        fetchDeckTypes()
        fetchFormats()
    }, [])

    // USE EFFECT
    useEffect(() => {
        const fetchEvents= async () => {
            const {data} = await axios.get(`/api/tournaments/community/${community}`)
            setEvents(data)
        }

        fetchEvents()
    }, [community])

    if (isAdmin) {
        return (
            <div className="body">
                <h1>Admin Portal</h1>
                    <div className="admin-menu">
                        <div onClick={() => setView('events')} className={eventButtonClass}>Create Event</div>
                        <div onClick={() => setView('decks')} className={deckButtonClass}>Upload Deck</div>
                    </div>
                <div>
                {
                    view === 'decks' ? (
                        <div className="admin-portal">
                            <label>Builder:
                                <input
                                    id="builder"
                                    className="login"
                                    type="search"
                                    onKeyDown={(e) => { if (e.key === 'Enter') findPlayers(e.target.value)}}
                                />
                                <select
                                    id="builder"
                                    className="login"
                                    onChange={(e) => getPlayer(e.target.value)}
                                >
                                {
                                    players.map((e) => <option value={e.name}>{e.name}</option>)
                                }
                                </select>
                            </label>
                            <label>Deck Type:
                                <select
                                    id="deck-type"
                                    className="login"
                                    onChange={(e) => getDeckType(e.target.value)}
                                >
                                <option value={null}></option>
                                {
                                    deckTypes.map((e) => <option value={e.name}>{e.name}</option>)
                                }
                                </select>
                            </label>
                            <label>
                                Community:
                                <select
                                    id="community"
                                    className="login"
                                    onChange={(e) => setCommunity(e.target.value)}
                                >
                                    <option value={null}></option>
                                    <option value="Format Library">Format Library</option>
                                    <option value="GoatFormat.com">GoatFormat.com</option>
                                    <option value="Goat Format Europe">Goat Format Europe</option>
                                    <option value="EdisonFormat.com">EdisonFormat.com</option>
                                    <option value="Konami">Konami</option>
                                    <option value="Upper Deck Entertainment">Upper Deck Entertainment</option>
                                </select>
                            </label>
                            <label>Event:
                                <select
                                    id="event"
                                    className="login"
                                    onChange={(e) => getEvent(e.target.value)}
                                >
                                <option value={null}></option>
                                {
                                    events.map((e) => <option value={e.cleanName}>{e.cleanName}</option>)
                                }
                                </select>
                            </label>
                            <label>Placement:
                                <select
                                    id="placement"
                                    className="login"
                                    onChange={(e) => setPlacement(e.target.value)}
                                >
                                {
                                    placementArr.map((e) => <option value={e}>{e}</option>)
                                }
                                </select>
                            </label>
                            <label>Display:
                                <select
                                    id="display"
                                    className="login"
                                    onChange={(e) => setDisplay(e.target.value)}
                                >
                                    <option value="true">True</option>
                                    <option value="false">False</option>
                                </select>
                            </label>
                            <label>YDK:
                                <input
                                    id="ydk"
                                    className="login"
                                    type="file"
                                    accept=".ydk"
                                    onChange={(e) => read(e.target.files[0])}
                                />
                            </label>
                            <a
                                className="admin-button"
                                type="submit"
                                onClick={() => createDeck()}
                            >
                                Submit
                            </a>
                        </div>
                    ) : view === 'events' ? (
                        <div className='admin-portal'>
                            <label>
                                Community:
                                <select
                                    id="community"
                                    className="login"
                                    onChange={(e) => setCommunity(e.target.value)}
                                >
                                    <option value={null}></option>
                                    <option value="Format Library">Format Library</option>
                                    <option value="GoatFormat.com">GoatFormat.com</option>
                                    <option value="Goat Format Europe">Goat Format Europe</option>
                                    <option value="EdisonFormat.com">EdisonFormat.com</option>
                                    <option value="Konami">Konami</option>
                                    <option value="Upper Deck Entertainment">Upper Deck Entertainment</option>
                                </select>
                            </label>
                            <label>URL:
                                <input
                                    id="url"
                                    className="login"
                                    type="text"
                                    onChange={(e) => getTournament(e.target.value)}
                                />
                            </label>
                            <label>Full Name:
                                <input
                                    id="full-name"
                                    className="login"
                                    type="text"
                                    onChange={(e) => setFullName(e.target.value)}
                                />
                            </label>
                            <label>Abbbreviation:
                                <input
                                    id="short-name"
                                    className="login"
                                    type="text"
                                    onChange={(e) => setAbbreviation(e.target.value)}
                                />
                            </label>
                            <label>Format:
                                <select
                                    id="format"
                                    className="login"
                                    onChange={(e) => setFormat(e.target.value)}
                                >
                                <option value={null}></option>
                                {
                                    formats.map((e) => <option value={e.name}>{e.name}</option>)
                                }
                                </select>
                            </label>
                            <label>Size:
                                <input
                                    id="ydk"
                                    className="size"
                                    type="text"
                                    onChange={(e) => setSize(e.target.value)}
                                />
                            </label>
                            <label>
                                Type:
                                <select
                                    id="type"
                                    className="login"
                                    onChange={(e) => setTournamentType(e.target.value)}
                                >
                                    <option value={null}></option>
                                    <option value="Double Elimination">Double Elimination</option>
                                    <option value="Single Elimination">Single Elimination</option>
                                    <option value="Swiss">Swiss</option>
                                    <option value="Round Robin">Round Robin</option>
                                </select>
                            </label>
                            <label>Series:
                                <select
                                    id="series"
                                    className="login"
                                    onChange={(e) => setIsSeries(e.target.value)}
                                >
                                    <option value="true">True</option>
                                    <option value="false">False</option>
                                </select>
                            </label>
                            <label>Winner:
                                <input
                                    id="winner"
                                    className="login"
                                    type="search"
                                    onKeyDown={(e) => { if (e.key === 'Enter') findPlayers(e.target.value)}}
                                />
                                <select
                                    id="winner"
                                    className="login"
                                    onChange={(e) => setPlayer(e.target.value)}
                                >
                                {
                                    players.map((e) => <option value={e.name}>{e.name}</option>)
                                }
                                </select>
                            </label>
                            <label>Start Date:
                                <input
                                    id="start-date"
                                    className="login"
                                    type="date"
                                    onChange={(e) => setStartDate(e.target.value)}
                                />
                            </label>
                            <a
                                className="admin-button"
                                type="submit"
                                onClick={() => createEvent()}
                            >
                                Submit
                            </a>
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