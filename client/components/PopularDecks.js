
import React, { useState, useEffect } from 'react'
import DeckThumbnail from './DeckThumbnail'
import axios from 'axios'

const PopularDecks = (props) => {
    const [popularDecks, setPopularDecks] = useState([])
  
    // USE EFFECT
    useEffect(() => {
        const fetchData = async () => {
            try {
                const {data} = await axios.get(`/api/decks/popular/${props.format.name}`)
                setPopularDecks(data)
            } catch (err) {
                console.log(err)
            }
        }

        fetchData()
    }, [])

    if (!popularDecks.length) return <div/>

    return (
        <div>
            <div className="divider"/>
            <div id="popular-decks" className="popular-decks">
                <h2>Popular Decks:</h2>
                <div className="popular-decks-flexbox">
                {
                    popularDecks.map((deck) => <DeckThumbnail deck={deck} key={deck.id}/>)
                }
                </div>
            </div>
        </div>
    )
}

export default PopularDecks
