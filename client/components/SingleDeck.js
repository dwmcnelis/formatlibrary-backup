
import React, { useState, useEffect, useLayoutEffect } from 'react'
import { useHistory } from 'react-router-dom'
import CardImage from './CardImage'
import axios from 'axios'
import {capitalize, dateToVerbose, ordinalize} from '../../functions/utility'
import formats from '../../static/formats.json'
import * as emojis from '../../public/images/emojis'
import { FL, GF, EF } from '../../public/images/logos'

const SingleDeck = (props) => {
    const [deck, setDeck] = useState({})
    const history = useHistory()
    const goToEvent = () => history.push(`/events/${deck.event}`)
    const goToFormat = () => history.push(`/formats/${deck.format}`)
    const goToPlayer = () => history.push(`/players/${deck.player.tag.slice(0, -5)}${deck.player.tag.slice(-4)}`)

  // USE LAYOUT EFFECT
  useLayoutEffect(() => window.scrollTo(0, 0), [])

  // USE EFFECT SET CARD
  useEffect(() => {
    const uploadDeck = async () => {
      try {
        const {data} = await axios.get(`/api/decks/${props.match.params.id}`)
        setDeck(data)
      } catch (err) {
        console.log(err)
      }
    }

    uploadDeck()
  }, [])

  if (!deck.id) return <div />
  const formatName = capitalize(deck.format, true) || '?'
  const formatImage = emojis[formats[formatName].logo] || ''
  const communityLogo = deck.community === 'Format Library' ? FL :
      deck.community === 'GoatFormat.com' ? GF :
      deck.community === 'EdisonFormat.com' ? EF :
      ''

  const categoryImage = deck.deckCategory === 'aggro' ? emojis.Helmet :
    deck.deckCategory === 'combo' ? emojis.Controller :
    deck.deckCategory === 'control' ? emojis.Orb :
    deck.deckCategory === 'lockdown' ? emojis.Lock :
    emojis.Thinking

  const placementImage = deck.placement === 1 ? emojis.First :
    deck.placement === 2 ? emojis.Second :
    deck.placement === 3 ? emojis.Third :
    emojis.Consolation

  const addLike = async () => {
    const res = await axios.get(`/api/decks/like/${props.match.params.id}`)
    if (res.status === 200) {
      const rating = deck.rating++
      setDeck({rating, ...deck})
    }
  }

  const addDownload = async () => {
    const downloads = deck.downloads++
    setDeck({downloads, ...deck})
  }

  return (
    <div className="body">
      <div className="myDiv">
        <div className="single-deck-title">{capitalize(deck.deckType, true)}</div>
        <a
          className="downloadButton"
          href={`/api/decks/download/${props.match.params.id}`}
          download={`${deck.builder}-${deck.deckType}.ydk`}
          onClick={()=> addDownload()}
        >
          Download
        </a>
      </div>
      <table className="single-deck-table">
        <tbody>
          <tr className="single-deck-info-1">
            <td>
              <div className="single-deck-cell">
                {
                  deck.player && deck.player.tag ? (
                    <div onClick={() => goToPlayer()} className="single-deck-builder-link" style={{paddingRight:'7px'}}><b>Builder:</b> {deck.player.name}</div>
                  ) : (
                    <div style={{paddingRight:'7px'}}><b>Builder:</b> {deck.builder}</div>
                  )
                }
              </div>       
            </td>
            <td>
              <div className="single-deck-cell">
                <div style={{paddingRight:'7px'}}><b>Category:</b> {capitalize(deck.deckCategory, true)}</div>
                <img style={{width:'28px'}} src={categoryImage}/>
              </div>
            </td>
            <td>
              <div onClick={() => goToEvent()} className="single-deck-cell">
                <div className="single-deck-event-link" style={{paddingRight:'7px'}}><b>Event:</b> {deck.event}</div> 
                <img style={{width:'28px'}} src={communityLogo}/>
              </div>   
            </td>
          </tr>
          <tr className="single-deck-info-2">
            <td>
              <div onClick={() => goToFormat()} className="single-deck-cell">
                <div className="single-deck-format-link" style={{paddingRight:'7px'}}><b>Format:</b> {capitalize(deck.format, true)}</div>
                <img style={{width:'28px'}} src={formatImage}/>
              </div>       
            </td>
            <td>
              <div className="single-deck-cell">
                <div style={{paddingRight:'7px'}}><b>Uploaded:</b> {dateToVerbose(deck.createdAt)}</div>
              </div>
            </td>
            <td>
              <div className="single-deck-cell">
                <div style={{paddingRight:'7px'}}><b>Place:</b> {ordinalize(deck.placement)}</div> 
                <img style={{width:'28px'}} src={placementImage}/>
              </div>   
            </td>
          </tr>
        </tbody>
      </table>
      <div id="main" className="deck-bubble">
          <div id="main" className="deck-flexbox">
          {
            deck.main.map((card, index) => <CardImage width='72px' padding='1px' margin='0px' key={`${deck.id}-${index}-${card.id}`} card={card}/>)
          }
          </div>
      </div>
      {
        deck.side.length ? (
          <div id="side" className="deck-bubble">
            <div id="side" className="deck-flexbox">
              {
                deck.side.map((card, index) => <CardImage width='48px' padding='0.5px' margin='0px' key={`${deck.id}-${index}-${card.id}`} card={card}/>)
              }
            </div>
          </div>
        ) : ''
      }
      {
        deck.extra.length ? (
          <div id="extra" className="deck-bubble">
            <div id="extra" className="deck-flexbox">
              {
                deck.extra.map((card, index) => <CardImage width='48px' padding='0.5px' margin='0px' key={`${deck.id}-${index}-${card.id}`} card={card}/>)
              }
            </div>
          </div>
        ) : ''
      }
      <table className='deck-stats-table'>
        <tbody>
          <tr>
            <td>
              <div className="deck-stats-cell">
                <div style={{paddingRight:'7px'}}>Likes: {deck.rating}</div>
                <img className="likeImg" onClick={() => addLike()} style={{width:'28px'}} src={emojis.Heart}/>
              </div>   
            </td>
            <td>
              <div className="deck-stats-cell">
                <div style={{paddingRight:'7px'}}>Downloads: {deck.downloads}</div> 
                <a
                  href={`/api/decks/download/${props.match.params.id}`} 
                  download={`${deck.builder}-${deck.deckType}.ydk`}
                  onClick={()=> addDownload()}
                >
                  <img style={{width:'28px'}} src={emojis.Disk}/>
                </a>
              </div>   
            </td>
            <td>
              <div className="deck-stats-cell">
                <div style={{paddingRight:'7px'}}>Views: {deck.views}</div> 
                <img style={{width:'28px'}} src={emojis.Eye}/>
              </div>   
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}

export default SingleDeck