
import React, { useState, useEffect, useLayoutEffect } from 'react'
import { useHistory } from 'react-router-dom'
import axios from 'axios'
import DeckImage from './DeckImage'
import {capitalize, dateToVerbose, ordinalize} from '../../functions/utility'
import formats from '../../static/formats.json'
import * as emojis from '../../public/images/emojis'
import * as artworks from '../../public/images/artworks'
import { FL, GF, EF } from '../../public/images/logos'

import { Chart as ChartJS, ArcElement, CategoryScale, BarElement, Title, LinearScale, Tooltip, Legend } from 'chart.js'
import { Bar, Doughnut } from 'react-chartjs-2'
ChartJS.register(ArcElement, CategoryScale, LinearScale,  BarElement, Title, Tooltip, Legend)

const SingleEvent = (props) => {
  const [event, setEvent] = useState({})
  const [winner, setWinner] = useState({})
  const [topDecks, setTopDecks] = useState([])
  const [metagame, setMetagame] = useState({
    deckTypes: [],
    deckCategories: [],
    topMainDeckCards: [],
    topSideDeckCards: []
  })

  const history = useHistory()
  const goToFormat = () => history.push(`/formats/${event.format}`)
  const goToPlayer = () => history.push(`/players/${winner.tag.slice(0, -5)}${winner.tag.slice(-4)}`)

  // USE LAYOUT EFFECT
  useLayoutEffect(() => window.scrollTo(0, 0), [])

  // USE EFFECT SET CARD
  useEffect(() => {
    const uploadEvent = async () => {
      try {
        const {data} = await axios.get(`/api/tournaments/${props.match.params.id}`)
        setEvent(data.event)
        setWinner(data.winner)
        setTopDecks(data.topDecks)
        setMetagame(data.metagame)
      } catch (err) {
        console.log(err)
      }
    }

    uploadEvent()
  }, [])

  if (!event.cleanName || !topDecks.length || !metagame.deckTypes.length) return <div></div>
  const formatName = capitalize(event.format, true) || '?'
  const formatEmoji = emojis[formats[formatName].logo] || ''
  const formatArtwork = artworks[formats[formatName].logo] || ''
  const communityLogo = event.community === 'Format Library' ? FL :
      event.community === 'GoatFormat.com' ? GF :
      event.community === 'EdisonFormat.com' ? EF :
      ''

  const colors = [
      '#3d72e3', '#ff3c2e', '#ffd000', '#47ad53', '#43578f', '#b25cd6',
      '#6d9399', '#f5881b', '#31ada5', '#ffcd19', '#cf8ac5', '#8a8dcf', 
      '#d65180', '#307a3a', '#735645', '#fc8c1c', '#8dc276', '#c4495f', 
  ]

  const deckTypeData = {
    labels: metagame.deckTypes.map((e) => e[0]),
    datasets: [
      {
        data: metagame.deckTypes.map((e) => e[1]),
        backgroundColor: colors.slice(0, metagame.deckTypes.length),
        borderWidth: 1,
      },
    ]
  }

  const deckCategoryData = {
    labels: metagame.deckCategories.map((e) => e[0]),
    datasets: [
      {
        data: metagame.deckCategories.map((e) => e[1]),
        backgroundColor: colors.slice(0, metagame.deckCategories.length),
        borderWidth: 1,
      },
    ]
  }

  const topMainDeckCardsData = {
    labels: metagame.topMainDeckCards.map((e) => e[0].name.length <= 30 ? e[0].name : e[0].name.slice(0, 30).split(' ').slice(0, -1).join(' ')),
    datasets: [
      {
        label: 'Main Deck Count',
        data: metagame.topMainDeckCards.map((e) => e[1]),
        backgroundColor: '#1f4ed1'
      }
    ]
  }

  const topSideDeckCardsData = {
    labels: metagame.topSideDeckCards.map((e) => e[0].name),
    datasets: [
      {
        label: 'Side Deck Count',
        data: metagame.topSideDeckCards.map((e) => e[1]),
        backgroundColor: '#c24225'
      }
    ]
  }

  const options = {
    responsive: false,
    maintainAspectRatio: true,
    plugins: {
      legend: {
          display: true,
          position: 'bottom',
          align: 'start'
      }
    }
  }

  return (
    <div className="body">
      <div className="event-title-flexbox">
        <div className="event-info-container">
          <div className="single-event-title">{event.cleanName}</div>
            <table className="single-event-table">
            <tbody>
              <tr className="single-event-info-1">
                <td>
                  <div className="single-event-cell">
                    <div onClick={() => goToFormat()} className="single-event-format-link" style={{paddingRight:'7px'}}><b>Format:</b> {capitalize(event.format, true)}</div>
                    <img style={{width:'32px'}} src={formatEmoji}/>
                  </div>     
                </td>
                <td>
                  <div className="single-event-cell">
                    <div onClick={() => goToPlayer()} className="single-event-winner-link" style={{paddingRight:'7px'}}><b>Winner:</b> {event.winner}</div>
                    <img style={{width:'32px'}} src={emojis.First}/>
                  </div>  
                </td>
                <td>   
                  <div className="single-event-cell">
                    <div style={{paddingRight:'7px'}}><b>Players:</b> {event.size} 👤</div> 
                  </div>
                </td>
              </tr>
              <tr className="single-event-info-2">
                <td>
                  <div className="single-event-cell">
                    <div style={{paddingRight:'7px'}}><b>Community:</b> {event.community}</div> 
                    <img style={{width:'32px'}} src={communityLogo}/>
                  </div>   
                </td>
                <td>
                  <div className="single-event-cell">
                    <div style={{paddingRight:'7px'}}><b>Date:</b> {dateToVerbose(event.startDate)}</div> 
                  </div>
                </td>
                <td>   
                  <div className="single-event-cell">
                    <div style={{paddingRight:'7px'}}><b>Structure:</b> {capitalize(event.tournamentType, true)}</div> 
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
          <br/>
          <li>
            <a href="#bracket">Bracket</a>
          </li>
          <li>
            <a href="#top-decks">Top Decks</a>
          </li>
          <li>
            <a href="#metagame-stats">Metagame Stats</a>
          </li>
        </div>
        <img className="format-icon-large" src={formatArtwork} />
      </div>

      <div className="divider"/>

      <div id="bracket">
        <div className="leaderboard-title-flexbox">
          <img style={{ width:'64px'}} src={communityLogo}/>
          <h2 className="leaderboard-title">{event.shortName} Top 8 Bracket:</h2>
          <img style={{ width:'64px'}} src={'/images/logos/Challonge.png'}/>
        </div>
        <img className="bracket" src={`/brackets/${event.shortName}.png`}/>
        <a 
          className="bracket-link"
          href={`https://challonge.com/${event.url}`} 
          target="_blank"
        >
          Click Here for Full Bracket
        </a>
      </div>

      <div className="divider"/>

      <div id="top-decks">
        <div className="leaderboard-title-flexbox">
          <img style={{ width:'64px'}} src={communityLogo}/>
          <h2 className="leaderboard-title">{event.shortName} {topDecks.length > 1 ? `Top ${topDecks.length} Decks` : 'Winning Deck'}:</h2>
          <img style={{ height:'64px'}} src={'/images/emojis/deckbox.png'}/>
        </div>
        <div id="deckGalleryFlexBox">
          {
            topDecks.map((deck, index) => {
              return <
                        DeckImage 
                        key={deck.id} 
                        index={index} 
                        deck={deck}
                        width="360px"
                        margin="10px 5px"
                        padding="5px"
                        coverage={true}
                      />
            })
          }
        </div>
      </div>

      <div className="divider"/>

      <div id="metagame-stats">
        <div className="leaderboard-title-flexbox">
          <img style={{ width:'64px'}} src={communityLogo}/>
          <h2 className="leaderboard-title">{event.shortName} Metagame Stats:</h2>
          <img style={{ height:'64px'}} src={'/images/emojis/microscope.png'}/>
        </div>

        <div className="chart-flexbox">
          <div>
            <h2>Deck Type Representation</h2>
            <br/>
            <Doughnut 
              height="500px"
              width="500px"
              data={deckTypeData}
              options={options}
            />
          </div>
          <div>
            <h2>Deck Category Representation</h2>
            <br/>
            <Doughnut 
              height={parseInt(500 - (20 * Math.ceil(metagame.deckTypes.length / 4)))}
              width="500px"
              data={deckCategoryData}
              options={options}
            />
          </div>
        </div>

        <div className="chart-flexbox">
          <div>
            <h2>Top Main Deck Cards</h2>
            <br/>
            <Bar 
              height="400px"
              width="500px"
              data={topMainDeckCardsData}
              options={options}
            />
          </div>
          <div>
            <h2>Top Side Deck Cards</h2>
            <br/>
            <Bar 
              height="400px"
              width="500px"
              data={topSideDeckCardsData}
              options={options}
            />
          </div>
        </div>

      </div>

    </div>
  )
}

export default SingleEvent