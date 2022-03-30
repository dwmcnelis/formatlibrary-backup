
import React, { useState, useEffect, useLayoutEffect } from 'react'
import BanList from './BanList'
import DeckThumbnail from './DeckThumbnail'
import LeaderBoard from './LeaderBoard'
import PopularDecks from './PopularDecks'
import axios from 'axios'
import * as artworks from '../../public/images/artworks'

const FormatIntro = (props = {}) => {
  const [format, setFormat] = useState(null)

  // USE LAYOUT EFFECT
  useLayoutEffect(() => window.scrollTo(0, 0))

  // USE EFFECT SET CARD
  useEffect(() => {
    const fetchData = async () => {
      try {
        const {data} = await axios.get(`/api/formats/${props.match.params.id}`)
        setFormat(data)
      } catch (err) {
        console.log(err)
      }
    }

    fetchData()
  }, [])

  if (!format) return <div />

  return (
    <div className="body">
      <div className="format-icon-flexbox">
        <div className="format-text">
          <h1>{format.name} Format</h1>
          <h2>{format.event}</h2>
          {
            format.description ? <p className="format-desc">{format.description}</p> : ''
          }
          <li>
            <a href="#popular-decks">Popular Decks</a>
          </li>
          <li>
            <a href="#recent-events">Recent Events</a>
          </li>
          <li>
            <a href="#leaderboard">Leaderboard</a>
          </li>
          <li>
            <a href="#banlist">Ban List</a>
          </li>
        </div>
        <img className="format-icon-large" src={artworks[format.icon]} />
      </div>

      <PopularDecks format={format}/>

      <div className="divider"/>
      <LeaderBoard format={format}/>

      <div className="divider"/>
      <BanList format={format}/>
    </div>
  )
}

export default FormatIntro