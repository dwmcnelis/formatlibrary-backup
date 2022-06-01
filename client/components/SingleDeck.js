
import React, { useState, useEffect, useLayoutEffect } from 'react'
import { useHistory } from 'react-router-dom'
import CardImage from './CardImage'
import NotFound from './NotFound'
import axios from 'axios'
import {capitalize, dateToSimple, dateToVerbose, ordinalize} from '../../functions/utility'
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
        const {data} = await axios.get({
          urL: `/api/decks/${props.match.params.id}`,
          headers: {
            username: localStorage.getItem('username'),
            password: localStorage.getItem('password')
          }
        })

        setDeck(data)
      } catch (err) {
        console.log(err)
        setDeck(null)
      }
    }

    uploadDeck()
  }, [])

  if (deck === null) return <NotFound/>
  if (!deck.id) return <div />
  const formatName = capitalize(deck.format, true) || '?'
  const formatImage = emojis[formats[formatName].logo] || ''
  const communityLogo = deck.community === 'Format Library' ? FL :
      deck.community === 'GoatFormat.com' ? GF :
      deck.community === 'EdisonFormat.com' ? EF :
      ''

  const categoryImage = deck.deckCategory.toLowerCase() === 'aggro' ? emojis.Helmet :
    deck.deckCategory.toLowerCase() === 'combo' ? emojis.Controller :
    deck.deckCategory.toLowerCase() === 'control' ? emojis.Orb :
    deck.deckCategory.toLowerCase() === 'lockdown' ? emojis.Lock :
    emojis.Thinking

  const placementImage = deck.placement === 1 ? emojis.First :
    deck.placement === 2 ? emojis.Second :
    deck.placement === 3 ? emojis.Third :
    emojis.Consolation
  
  const tag = deck.player && deck.player.tag ? deck.player.tag : ''

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
      <div className="single-deck-title-flexbox">
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
            <td id="single-deck-builder-td">
              <div className="single-deck-cell">
                {
                  deck.player && deck.player.tag ? (
                    <div onClick={() => goToPlayer()} className="single-deck-builder-link">
                      <b>Builder: </b>
                      <p>{deck.player.name}</p>
                      <img 
                        className="single-deck-builder-cell-pfp"
                        src={`/images/pfps/${tag.slice(0, -5)}${tag.slice(-4)}.png`}
                        onError={(e) => {
                                e.target.onerror = null
                                e.target.src="https://cdn.discordapp.com/embed/avatars/1.png"
                            }
                        }
                      />
                    </div>
                  ) : (
                    <div style={{paddingRight:'7px'}}><b>Builder:</b> {deck.builder}</div>
                  )
                }
              </div>       
            </td>
            <td>
              <div onClick={() => goToFormat()} className="single-deck-cell">
                <div className="single-deck-format-link" style={{paddingRight:'7px'}}><b>Format:</b> {capitalize(deck.format, true)}</div>
                <img style={{width:'28px'}} src={formatImage}/>
              </div>       
            </td>
            <td>
              <div className="single-deck-cell">
                <div className="single-deck-category" style={{paddingRight:'7px'}}><b>Category:</b> {capitalize(deck.deckCategory, true)}</div>
                <img className="single-deck-category-emoji" style={{width:'28px'}} src={categoryImage}/>
              </div>
            </td>
          </tr>
          <tr className="single-deck-info-2">
            <td>
              <div onClick={() => goToEvent()} className="single-deck-cell">
                <div className="single-deck-event-link" style={{paddingRight:'7px'}}><b>Event:</b> {deck.event}</div> 
                <img style={{width:'28px'}} src={communityLogo}/>
              </div>   
            </td>
            <td>
              <div className="single-deck-cell">
                <div style={{paddingRight:'7px'}}><b>Place:</b> {ordinalize(deck.placement)}</div> 
                <img style={{width:'28px'}} src={placementImage}/>
              </div>   
            </td>
            <td>
              <div className="single-deck-cell">
                <div className="desktop-only"><b>Uploaded:</b> {dateToVerbose(deck.createdAt, false, false)}</div>
                <div id="single-deck-uploaded-mobile" className="mobile-only"><b>Uploaded:</b> {dateToSimple(deck.createdAt)}</div>
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
                <div style={{paddingRight:'7px'}}><b className="deck-stats-label">Likes: </b>{deck.rating}</div>
                <img className="likeImg" onClick={() => addLike()} style={{width:'28px'}} src={emojis.Heart}/>
              </div>   
            </td>
            <td>
              <div className="deck-stats-cell">
                <div style={{paddingRight:'7px'}}><b className="deck-stats-label">Downloads: </b>{deck.downloads}</div> 
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
                <div style={{paddingRight:'7px'}}><b className="deck-stats-label">Views: </b>{deck.views}</div> 
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