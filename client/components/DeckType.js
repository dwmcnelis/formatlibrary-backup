
import React, { useState, useEffect, useLayoutEffect } from 'react'
import { useHistory } from 'react-router-dom'
import CardImage from './CardImage'
import NotFound from './NotFound'
import axios from 'axios'
import * as emojis from '../../public/images/emojis'

const DeckType = (props) => {
  const [summary, setSummary] = useState({})
  const [banlist, setBanList] = useState({})
  const history = useHistory()
  const goToFormat = () => history.push(`/formats/${summary.format ? summary.format.name : ''}`)
    
  // USE LAYOUT EFFECT
  useLayoutEffect(() => window.scrollTo(0, 0), [])

  // USE EFFECT SET CARD
  useEffect(() => {
    const fetchData = async () => {
      const search = props.location ? props.location.search : null
      const format = search ? search.slice(search.indexOf('?format=') + 8) : null
      const headers = format ? { format: format } : {}

      try {
        const {data} = await axios.get(`/api/deckTypes/${props.match.params.id}`, {headers})
        setSummary(data)
      } catch (err) {
        console.log(err)
        setSummary(null)
      }
    }

    fetchData()
  }, [])

  // USE EFFECT SET CARD
  useEffect(() => {
    const fetchData = async () => {
      try {
        const {data} = await axios.get(`/api/banlists/simple/${summary.format.banlist}`)
        setBanList(data)
      } catch (err) {
        console.log(err)
      }
    }

    fetchData()
  }, [summary])

  if (!summary) return <NotFound/>
  if (!summary.deckType) return <div/>

  const categoryImage = summary.deckCategory === 'Aggro' ? emojis.Helmet :
    summary.deckCategory === 'Combo' ? emojis.Controller :
    summary.deckCategory === 'Control' ? emojis.Orb :
    summary.deckCategory === 'Lockdown' ? emojis.Lock :
    emojis.Thinking
  
  const addLike = async () => {
    const res = await axios.get(`/api/deckTypes/like/${props.match.params.id}`)
    if (res.status === 200) {
      const rating = summary.rating++
      setSummary({rating, ...deck})
    }
  }

  const addDownload = async () => {
    const downloads = summary.downloads++
    setSummary({downloads, ...deck})
  }

  const toggle = (category, index) => {
    let info = document.getElementById(`${category}-info-${index}`)
    let details = document.getElementById(`${category}-details-${index}`)
    
    if (getComputedStyle(details).display == "none") {
      details.style.display = "block"
    } else {
      details.style.display = "none"
    }

    if (getComputedStyle(info).display == "none") {
      info.style.display = "block"
    } else {
      info.style.display = "none"
    } 
  }

  return (
    <div className="body">
      <h1>{summary.deckType}</h1>
      <table className="single-deck-table">
        <tbody>
          <tr className="single-deck-info-1">
            <td>
              <div onClick={() => goToFormat()} className="single-deck-cell">
                <div className="single-deck-format-link" style={{paddingRight:'7px'}}><b>Format:</b> {summary.format.name}</div>
                <img style={{width:'28px'}} src={`/images/emojis/${summary.format.icon}.png`}/>
              </div>       
            </td>
            <td>
              <div className="single-deck-cell">
                <div className="single-deck-category" style={{paddingRight:'7px'}}><b>Category:</b> {summary.deckCategory}</div>
                <img className="single-deck-category-emoji" style={{width:'28px'}} src={categoryImage}/>
              </div>
            </td>
            <td>
              <div className="single-deck-cell">
                <div className="single-deck-category" style={{paddingRight:'7px'}}><b>Frequency:</b> {summary.percent}%</div>
                <img className="single-deck-category-emoji" style={{width:'28px'}} src={`/images/emojis/math.png`}/>
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      <h2>Popular Main Deck Cards</h2>
      <div id="main" className="deck-bubble">
          <div id="main" className="deck-flexbox">
          {
            summary.mainMonsters.map((data, index) => {
              const info = data['1'] > data['2'] && data['1'] > data['3'] ? `1x in ${Math.round(data['1'] / summary.analyzed * 100)}%` :
                data['2'] >= data['1'] && data['2'] >= data['3'] ? `2x in ${Math.round(data['2'] / summary.analyzed * 100)}%` :
                `3x in ${Math.round(data['3'] / summary.analyzed * 100)}%` 

                const details = (data['3'] ? `3x in ${Math.round(data['3'] / summary.analyzed * 100)}%\n` : '') +
                  (data['2'] ? `2x in ${Math.round(data['2'] / summary.analyzed * 100)}%\n` : '') +
                  (data['1'] ? `1x in ${Math.round(data['1'] / summary.analyzed * 100)}%\n` : '') +
                  ((summary.analyzed - data.decks) ? `0x in ${Math.round((summary.analyzed - data.decks) / summary.analyzed * 100)}%` : '')

                return (
                  <div className="popular-main" key={'m' + data.card.ypdId}>
                    <CardImage className="popular-main-card" width='72px' padding='1px' margin='0px' card={data.card} status={banlist[data.card.id]}/>
                    <div onClick={() => toggle('main-monsters', index)}>
                      <div id={'main-monsters-info-' + index} className="deckType-info">{info}</div>
                      <div id={'main-monsters-details-' + index} className="expanded-info">{details}</div>
                    </div>
                  </div>
                )
            })
          }
          {
            summary.mainSpells.map((data, index) => {
              const info = data['1'] > data['2'] && data['1'] > data['3'] ? `1x in ${Math.round(data['1'] / summary.analyzed * 100)}%` :
                data['2'] >= data['1'] && data['2'] >= data['3'] ? `2x in ${Math.round(data['2'] / summary.analyzed * 100)}%` :
                `3x in ${Math.round(data['3'] / summary.analyzed * 100)}%` 

                const details = (data['3'] ? `3x in ${Math.round(data['3'] / summary.analyzed * 100)}%\n` : '') +
                  (data['2'] ? `2x in ${Math.round(data['2'] / summary.analyzed * 100)}%\n` : '') +
                  (data['1'] ? `1x in ${Math.round(data['1'] / summary.analyzed * 100)}%\n` : '') +
                  ((summary.analyzed - data.decks) ? `0x in ${Math.round((summary.analyzed - data.decks) / summary.analyzed * 100)}%` : '')

                return (
                  <div className="popular-main" key={'m' + data.card.ypdId} >
                    <CardImage width='72px' padding='1px' margin='0px' card={data.card} status={banlist[data.card.id]}/>
                    <div onClick={() => toggle('main-spells', index)}>
                      <div id={'main-spells-info-' + index} className="deckType-info">{info}</div>
                      <div id={'main-spells-details-' + index} className="expanded-info">{details}</div>
                    </div>
                  </div>
                )
            })
          }
          {
            summary.mainTraps.map((data, index) => {
              const info = data['1'] > data['2'] && data['1'] > data['3'] ? `1x in ${Math.round(data['1'] / summary.analyzed * 100)}%` :
                data['2'] >= data['1'] && data['2'] >= data['3'] ? `2x in ${Math.round(data['2'] / summary.analyzed * 100)}%` :
                `3x in ${Math.round(data['3'] / summary.analyzed * 100)}%` 

                const details = (data['3'] ? `3x in ${Math.round(data['3'] / summary.analyzed * 100)}%\n` : '') +
                  (data['2'] ? `2x in ${Math.round(data['2'] / summary.analyzed * 100)}%\n` : '') +
                  (data['1'] ? `1x in ${Math.round(data['1'] / summary.analyzed * 100)}%\n` : '') +
                  ((summary.analyzed - data.decks) ? `0x in ${Math.round((summary.analyzed - data.decks) / summary.analyzed * 100)}%` : '')

                return (
                  <div className="popular-main" key={'m' + data.card.ypdId} >
                    <CardImage width='72px' padding='1px' margin='0px' card={data.card} status={banlist[data.card.id]}/>
                    <div onClick={() => toggle('main-traps', index)}>
                      <div id={'main-traps-info-' + index} className="deckType-info">{info}</div>
                      <div id={'main-traps-details-' + index} className="expanded-info">{details}</div>
                    </div>
                  </div>
                )
            })
          }
          </div>
      </div>

      {
        summary.extraMonsters.length ? (
          <>
            <br/>
            <h2>Popular Extra Deck Cards</h2>
            <div id="extra" className="deck-bubble">
                <div id="extra" className="deck-flexbox">
                {
                  summary.extraMonsters.map((data, index) => {
                    const info = data['1'] > data['2'] && data['1'] > data['3'] ? `1x in ${Math.round(data['1'] / summary.analyzed * 100)}%` :
                      data['2'] >= data['1'] && data['2'] >= data['3'] ? `2x in ${Math.round(data['2'] / summary.analyzed * 100)}%` :
                      `3x in ${Math.round(data['3'] / summary.analyzed * 100)}%` 

                      const details = (data['3'] ? `3x in ${Math.round(data['3'] / summary.analyzed * 100)}%\n` : '') +
                      (data['2'] ? `2x in ${Math.round(data['2'] / summary.analyzed * 100)}%\n` : '') +
                      (data['1'] ? `1x in ${Math.round(data['1'] / summary.analyzed * 100)}%\n` : '') +
                      ((summary.analyzed - data.decks) ? `0x in ${Math.round((summary.analyzed - data.decks) / summary.analyzed * 100)}%` : '')
    
                      return (
                        <div className="popular-side" key={'e' + data.card.ypdId} >
                          <CardImage width='72px' padding='1px' margin='0px' card={data.card} status={banlist[data.card.id]}/>
                          <div onClick={() => toggle('extra', index)}>
                            <div id={'extra-info-' + index} className="deckType-info">{info}</div>
                            <div id={'extra-details-' + index} className="expanded-info">{details}</div>
                          </div>
                        </div>
                      )
                  })
                }
                </div>
            </div>
          </>
        ) : ''
      }


      <br/>
      <h2>Popular Side Deck Cards</h2>
      <div id="side" className="deck-bubble">
          <div id="side" className="deck-flexbox">
          {
            summary.sideMonsters.map((data, index) => {
              const info = data['1'] > data['2'] && data['1'] > data['3'] ? `1x in ${Math.round(data['1'] / summary.analyzed * 100)}%` :
                data['2'] >= data['1'] && data['2'] >= data['3'] ? `2x in ${Math.round(data['2'] / summary.analyzed * 100)}%` :
                `3x in ${Math.round(data['3'] / summary.analyzed * 100)}%` 

                const details = (data['3'] ? `3x in ${Math.round(data['3'] / summary.analyzed * 100)}%\n` : '') +
                  (data['2'] ? `2x in ${Math.round(data['2'] / summary.analyzed * 100)}%\n` : '') +
                  (data['1'] ? `1x in ${Math.round(data['1'] / summary.analyzed * 100)}%\n` : '') +
                  ((summary.analyzed - data.decks) ? `0x in ${Math.round((summary.analyzed - data.decks) / summary.analyzed * 100)}%` : '')

                return (
                  <div className="popular-side" key={'s' + data.card.ypdId} >
                    <CardImage width='72px' padding='1px' margin='0px' card={data.card} status={banlist[data.card.id]}/>
                    <div onClick={() => toggle('side-monsters', index)}>
                      <div id={'side-monsters-info-' + index} className="deckType-info">{info}</div>
                      <div id={'side-monsters-details-' + index} className="expanded-info">{details}</div>
                    </div>
                  </div>
                )
            })
          }
          {
            summary.sideSpells.map((data, index) => {
              const info = data['1'] > data['2'] && data['1'] > data['3'] ? `1x in ${Math.round(data['1'] / summary.analyzed * 100)}%` :
                data['2'] >= data['1'] && data['2'] >= data['3'] ? `2x in ${Math.round(data['2'] / summary.analyzed * 100)}%` :
                `3x in ${Math.round(data['3'] / summary.analyzed * 100)}%` 

                const details = (data['3'] ? `3x in ${Math.round(data['3'] / summary.analyzed * 100)}%\n` : '') +
                  (data['2'] ? `2x in ${Math.round(data['2'] / summary.analyzed * 100)}%\n` : '') +
                  (data['1'] ? `1x in ${Math.round(data['1'] / summary.analyzed * 100)}%\n` : '') +
                  ((summary.analyzed - data.decks) ? `0x in ${Math.round((summary.analyzed - data.decks) / summary.analyzed * 100)}%` : '')

                return (
                  <div className="popular-side" key={'s' + data.card.ypdId}>
                    <CardImage width='72px' padding='1px' margin='0px' card={data.card} status={banlist[data.card.id]}/>
                    <div onClick={() => toggle('side-spells', index)}>
                      <div id={'side-spells-info-' + index} className="deckType-info">{info}</div>
                      <div id={'side-spells-details-' + index} className="expanded-info">{details}</div>
                    </div>
                  </div>
                )
            })
          }
          {
            summary.sideTraps.map((data, index) => {
              const info = data['1'] > data['2'] && data['1'] > data['3'] ? `1x in ${Math.round(data['1'] / summary.analyzed * 100)}%` :
                data['2'] >= data['1'] && data['2'] >= data['3'] ? `2x in ${Math.round(data['2'] / summary.analyzed * 100)}%` :
                `3x in ${Math.round(data['3'] / summary.analyzed * 100)}%` 

                const details = (data['3'] ? `3x in ${Math.round(data['3'] / summary.analyzed * 100)}%\n` : '') +
                  (data['2'] ? `2x in ${Math.round(data['2'] / summary.analyzed * 100)}%\n` : '') +
                  (data['1'] ? `1x in ${Math.round(data['1'] / summary.analyzed * 100)}%\n` : '') +
                  ((summary.analyzed - data.decks) ? `0x in ${Math.round((summary.analyzed - data.decks) / summary.analyzed * 100)}%` : '')

                return (
                  <div className="popular-side" key={'s' + data.card.ypdId}>
                    <CardImage width='72px' padding='1px' margin='0px' card={data.card} status={banlist[data.card.id]}/>
                      <div onClick={() => toggle('side-traps', index)}>
                        <div id={'side-traps-info-' + index} className="deckType-info">{info}</div>
                        <div id={'side-traps-details-' + index} className="expanded-info">{details}</div>
                      </div>
                  </div>
                )
            })
          }
          </div>
      </div>
    </div>
  )
}

export default DeckType