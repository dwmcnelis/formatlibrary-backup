
import React, { useState, useEffect, useLayoutEffect } from 'react'
import BanList from './BanList'
import MiniBoard from './MiniBoard'
import NotFound from './NotFound'
import PopularDecks from './PopularDecks'
import RecentEvents from './RecentEvents'
import axios from 'axios'

const FormatIntro = (props = {}) => {
  const [format, setFormat] = useState({})
  const [deckCount, setDeckCount] = useState(0)
  const [eventCount, setEventCount] = useState(0)
  const [statsCount, setStatsCount] = useState(0)

  // USE LAYOUT EFFECT
  useLayoutEffect(() => window.scrollTo(0, 0))

  // USE EFFECT SET CARD
  useEffect(() => {
    const fetchData = async () => {
      try {
        const {data} = await axios.get(`/api/formats/${props.match.params.id}`)
        setFormat(data.format)
        setDeckCount(data.deckCount)
        setEventCount(data.eventCount)
        setStatsCount(data.statsCount)
      } catch (err) {
        console.log(err)
        setFormat(null)
      }
    }

    fetchData()
  }, [])

  if (format === null) return <NotFound/>
  if (!format.id) return <div />

  return (
    <div className="body">
      <div className="format-icon-flexbox">
        <div className="format-text">
          <h1>{format.name} Format</h1>
          <h2>{format.event}</h2>
          {
            format.description ? <p className="desktop-only">{format.description}</p> : <br/>
          }
          {
            deckCount ? (
              <li>
                <a href="#popular-decks">Popular Decks</a>
              </li>
            ) : ''
          }
          {
            eventCount ? (
              <li>
                <a href="#recent-events">Recent Events</a>
              </li>
            ) : ''
          }
          {
            statsCount ? (
              <li>
                <a href="#leaderboard">Leaderboard</a>
              </li>
            ) : ''
          }
          <li>
            <a href="#banlist">Ban List</a>
          </li>
        </div>
        <img className="format-icon-large" src={`/images/artworks/${format.icon.toLowerCase()}.jpg`} />
      </div>
      {
        format.description ? (
          <div className="mobile-only">
            <p className="format-desc">{format.description}</p>
          </div>
        ) : ''
      }
      <PopularDecks format={format}/>
      <RecentEvents format={format}/>
      <MiniBoard limit={10} format={format}/>
      <div className="divider"/>
      <BanList format={format}/>
    </div>
  )
}

export default FormatIntro