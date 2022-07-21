
import React, { useState, useEffect, useLayoutEffect } from 'react'
import DeckThumbnail from './DeckThumbnail'
import axios from 'axios'

const DeckGallery = (props) => {
    const [decks, setDecks] = useState([])
    const [format, setFormat] = useState({})
    
    // USE LAYOUT EFFECT
    useLayoutEffect(() => window.scrollTo(0, 0))
    
    // USE EFFECT
    useEffect(() => {
        const fetchData = async () => {
            try {
                const {data} = await axios.get(`/api/decks/gallery/${props.match.params.id}`)
                setDecks(data.decks)
                setFormat(data.format)
            } catch (err) {
                console.log(err)
            }
        }

        fetchData()
    }, [])

    if (!decks.length) return <div/>

    return (
        <div className="body">
            <div id="popular-decks" className="popular-decks">
                <div className="subcategory-title-flexbox">
                    <img style={{ width:'64px'}} src={`/images/emojis/${format.icon}.png`}/>
                    <h1 className="leaderboard-title">{format.name} Deck Gallery</h1>
                    <img style={{ width:'64px'}} src={`/images/emojis/${format.icon}.png`}/>
                </div>
                <div className="popular-decks-flexbox">
                {
                    decks.map((deck) => <DeckThumbnail format={props.match.params.id} deck={deck} key={deck.id}/>)
                }
                </div>
            </div>
        </div>
    )
}

export default DeckGallery