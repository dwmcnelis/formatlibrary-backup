/* eslint-disable max-statements */

import React, { useState, useEffect } from 'react'
import CardImage from './CardImage'
import axios from 'axios'

const BanList = (props = {}) => {
  const [banlist, setBanlist] = useState(null)
  const {format} = props
  const BL = format ? format.banlist : props.match.params.id
  console.log('BL', BL)
  console.log('banlist', banlist)

  // USE EFFECT SET CARD
  useEffect(() => {
    const fetchData = async () => {
      try {
        const {data} = await axios.get(`/api/banlists/${BL}`)
        return setBanlist(data)
      } catch (err) {
        console.log(err)
      }
    }

    fetchData()
  }, [])

  if (!banlist) return <div />
  const { forbidden, limited, semiLimited } = banlist

/* eslint-disable */
const convertToTitle = (param = '') => {
    const abbrev = param.slice(0, 3)
    const month = abbrev === 'jan' ? 'January' :
    abbrev === 'feb' ? 'February' :
    abbrev === 'mar' ? 'March' :
    abbrev === 'apr' ? 'April' :
    abbrev === 'may' ? 'May' :
    abbrev === 'jun' ? 'June' :
    abbrev === 'jul' ? 'July' :
    abbrev === 'aug' ? 'August' :
    abbrev === 'sep' ? 'September' :
    abbrev === 'oct' ? 'October' :
    abbrev === 'nov' ? 'November' :
    'December'

    const year = `20${param.slice(-2)}`
    return `${month} ${year}`
  }

  const date = convertToTitle(BL)

  return (
    <div id="banlist" className="banlist">
      <h2 className="banlist-title">{forbidden.length ? 'Forbidden & Limited List' : 'Limited List'}</h2>
      <h3 className="banlist-date">Effective - {date}</h3>
      <br />
      {
        forbidden.length ? (
          <div>
            <div id="forbidden" className="banlist-bubble">
              <div id="forbidden" className="banlist-category">Forbidden:</div>
                <div id="forbidden" className="banlist-flex-box">
                  {
                    forbidden.map((el) => 
                    <
                      CardImage 
                      width='72px' 
                      padding='1px' 
                      margin='0px'
                      key={el.card.id} 
                      card={el.card}
                      status="forbidden"
                    />
                  )
                  }
                </div>
            </div>
            <br />
          </div>
        ) : ''
      }
      
      <div id="limited" className="banlist-bubble">
        <div id="limited" className="banlist-category">Limited:</div>
          <div id="limited" className="banlist-flex-box">
          {
            limited.map((el) => 
            <
              CardImage 
              width='72px' 
              padding='1px' 
              margin='0px'
              key={el.card.id} 
              card={el.card}
              status="limited"
            />
          )
          }
          </div>
      </div>
      <br />
      <div id="semi-limited" className="banlist-bubble">
        <div id="semi-limited" className="banlist-category">Semi-Limited:</div>
          <div id="semi-limited" className="banlist-flex-box">
          {
            semiLimited.map((el) => 
              <
                CardImage 
                width='72px' 
                padding='1px' 
                margin='0px'
                key={el.card.id}
                card={el.card}
                status="semiLimited"
              />
            )
          }
        </div>
      </div>
      <br />
    </div>
  )
}

export default BanList