/* eslint-disable max-statements */

import React from 'react'
import { Link } from 'react-router-dom'
import { Aqua, Beast, BeastWarrior, Continuous, Counter, Cyberse, DARK, Dinosaur, 
  DIVINE, DivineBeast, Dragon, EARTH, Equip, Fairy, Field, Fiend, FIRE, Fish, 
  Insect, LIGHT, LinkSymbol, Machine, Normal, Plant, Psychic, Pyro, QuickPlay, Rank, 
  Reptile, Ritual, Rock, Scale, SeaSerpent, Spell, Spellcaster, Star, Thunder, Trap, Warrior, 
  WATER, WIND, WingedBeast, Wyrm, Zombie } from '../../public/images/symbols'

import { B_BL, B_L, B, BL_B, BR_B_BL, BR_BL, L_B_R, L, R_B, R_BL_L, R_BL, R_BR_B_L, 
  R_L, T_B_BL_L, T_B, T_BL, T_BR_B, T_BR_BL, T_L, T_R_B_L, T_R_B, T_R_BR_B, T_R_L, 
  T_R, T_TR_BR, T, TL } from '../../public/images/arrows'

const symbols = {
  Aqua, Beast, BeastWarrior, Continuous, Counter, Cyberse, DARK, Dinosaur, 
  DIVINE, DivineBeast, Dragon, EARTH, Equip, Fairy, Field, Fiend, FIRE, Fish, 
  Insect, LIGHT, LinkSymbol, Machine, Normal, Plant, Psychic, Pyro, QuickPlay, Rank, 
  Reptile, Ritual, Rock, Scale, SeaSerpent, Spell, Spellcaster, Star, Thunder, Trap, Warrior,
  WATER, WIND, WingedBeast, Wyrm, Zombie
}

const arrows = {
  B_BL, B_L, B, BL_B, BR_B_BL, BR_BL, L_B_R, L, R_B, R_BL_L, R_BL, R_BR_B_L, 
  R_L, T_B_BL_L, T_B, T_BL, T_BR_B, T_BR_BL, T_L, T_R_B_L, T_R_B, T_R_BR_B, T_R_L, 
  T_R, T_TR_BR, T, TL
}

/* eslint-disable complexity */
const CardRow = (props) => {
  const { card } = props
  const { category, attribute, level, rating, scale, atk, def } = card
  const stats = []

  if (category === 'Monster') {
    stats.push(card.type)
    if (card.normal) stats.push("Normal")
    if (card.fusion) stats.push("Fusion")
    if (card.ritual) stats.push("Ritual")
    if (card.synchro) stats.push("Synchro")
    if (card.xyz) stats.push("Xyz")
    if (card.pendulum) stats.push("Pendulum")
    if (card.link) stats.push("Link")
    if (card.flip) stats.push("Flip")
    if (card.gemini) stats.push("Gemini")
    if (card.spirit) stats.push("Spirit")
    if (card.toon) stats.push("Toon")
    if (card.tuner) stats.push("Tuner")
    if (card.union) stats.push("Union")
    if (card.effect) stats.push("Effect")
  }

  const line = stats.join(' / ')
  const symbol = symbols[card.attribute] || symbols[card.category]
  const symbol2 = card.link ? arrows[card.arrows] :
    card.xyz ? Rank :
    category === 'Monster' ? Star :
    symbols[card.icon.replace('-', '')]

  const line2 = card.link ? `Link ${rating}` :
  card.xyz ? `Rank ${level}` :
  category === 'Monster' ? `Level ${level}` :
  card.icon

  const symbol3 = category === 'Monster' ? symbols[card.type.replace(/[\s-]/g, '')] : null
  const evenOrOdd = props.index % 2 ? 'even' : 'odd'
  const filePath = `/images/cards/${card.ypdId}.jpg`
  // const history = useHistory()
  // const goToCard = () => history.push(``)
  
  return (
      <tr className={`${evenOrOdd}-search-results-row`}>
        <td className="no-padding-2" style={{verticalAlign: 'top'}}>
          <Link className="black-text" to={`/cards/${card.name.replaceAll('/', '%2F')}`}>
            <div className="card-image-cell">
              <img
                className="card-image"
                src={filePath}
                style={{width: '96px'}}
                alt={card.name}
              />
            </div>
          </Link>
        </td>
        <td className="no-padding-2" style={{verticalAlign: 'top'}}>
          <Link className="black-text" to={`/cards/${card.name.replaceAll('/', '%2F')}`}>
            <table className="inner-cardRow-table">
              <tbody>
                <tr>
                  <th
                    colSpan="4"
                    style={{
                      textAlign: 'left',
                      fontSize: '24px',
                      borderBottom: '2px solid #CFDCE5'
                    }}
                  >
                    {card.name}
                  </th>
                  <th
                    colSpan="2"
                    style={{
                      fontWeight: 'normal',
                      fontSize: '14px',
                      textAlign: 'right',
                      padding: '10px 20px 20px 10px',
                      borderBottom: '2px solid #CFDCE5'
                    }}
                  >
                    {card.tcgDate.substring(0, 10)}
                  </th>
                </tr>
                <tr>
                  <td height="25px" width="90px" style={{borderRight: '2px solid #CFDCE5'}}>
                    <img
                      src={symbol}
                      height="24px"
                      style={{verticalAlign: 'middle'}}
                      alt="symbol"
                    />
                    {' ' + (attribute || category.toUpperCase())}
                  </td>
                  {symbol2 ? (
                    <td height="25px" width="120px" style={{borderRight: '2px solid #CFDCE5'}}>
                      <img
                        src={symbol2}
                        margin="0px"
                        height="24px"
                        style={{verticalAlign: 'middle'}}
                        alt="level/category"
                      />
                      {' ' + line2}
                    </td>
                  ) : (
                    <td height="25px" width="120px" />
                  )}
                  {stats.length > 1 ? (
                    <td height="25px" width="300px" style={{borderRight: '2px solid #CFDCE5'}}>
                      <img
                        src={symbol3}
                        margin="0px"
                        height="24px"
                        style={{verticalAlign: 'middle'}}
                        alt="level/category"
                      />
                      {' ' + line}
                    </td>
                  ) : (
                    <td height="25px" width="220px" />
                  )}
                  {atk ? (
                    <td height="25px" width="100px" style={{borderRight: '2px solid #CFDCE5'}}>
                      {'ATK: ' + atk}
                    </td>
                  ) : (
                    <td height="25px" width="100px" />
                  )}
                  {def ? (
                    <td height="25px" width="100px" style={{borderRight: '2px solid #CFDCE5'}}>
                      {'DEF: ' + def}
                    </td>
                  ) : (
                    <td height="25px" width="100px" />
                  )}
                  <td />
                </tr>
                {card.pendulum ? (
                    <tr>
                      <td height="25px" width="110px" style={{borderRight: '2px solid #CFDCE5', borderTop: '2px solid #CFDCE5'}}>
                        <img
                          src={Scale}
                          height="24px"
                          style={{verticalAlign: 'middle'}}
                          alt="Scale"
                        />
                        {' Scale ' + scale}
                      </td>
                      <td
                        colSpan="5"
                        className="cardrow-description"
                        style={{fontSize: '16px', borderTop: '2px solid #CFDCE5'}}
                      >
                        {card.description.slice(21, card.description.indexOf('----'))}
                      </td>
                    </tr>
                  ) : (
                    <tr></tr>
                  )}
                {card.pendulum ? (
                    <tr>
                      <td
                        colSpan="6"
                        className="cardrow-description"
                        style={{padding: '10px 20px 20px 10px', fontSize: '16px', borderTop: '2px solid #CFDCE5'}}
                      >
                        {card.description.slice(card.description.indexOf('[ Monster Effect ]') + 20)}
                      </td>
                    </tr>
                  ) : (
                    <tr>
                      <td
                        colSpan="6"
                        className="cardrow-description"
                        style={{padding: '10px 20px 20px 10px', fontSize: '16px', borderTop: '2px solid #CFDCE5'}}
                      >
                        {card.description}
                      </td>
                    </tr>
                  )}
              </tbody>
            </table>
          </Link>
        </td>
      </tr>
  )
}

export default CardRow
