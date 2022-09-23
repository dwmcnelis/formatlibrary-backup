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
const MobileCardRow = (props) => {
  const { card, status } = props
  const { category, attribute, level, rating, atk, def } = card
  const line = card.type
  
  const symbol = symbols[card.attribute] || symbols[card.category]
  const symbol2 = card.link ? arrows[card.arrows] :
    card.xyz ? Rank :
    category === 'Monster' ? Star :
    card.icon ? symbols[card.icon.replace('-', '')] :
    ''

  const line2 = card.link ? `Lk${rating}` :
  card.xyz ? `Rk${level}` :
  category === 'Monster' ? `Lv${level}` :
  card.icon

  const symbol3 = category === 'Monster' && card.type ? symbols[card.type.replace(/[\s-]/g, '')] : null
  const evenOrOdd = props.index % 2 ? 'even' : 'odd'
  const filePath = `/images/cards/${card.ypdId}.jpg`
  
  return (
      <tr className={`${evenOrOdd}-search-results-row`}>
                <td className="no-padding-2" style={{verticalAlign: 'top'}}>
                <Link className="black-text" to={`/cards/${
                    card.name.replaceAll('%', '%25')
                    .replaceAll('/', '%2F')
                    .replaceAll(' ', '_')
                    .replaceAll('#', '%23')
                    .replaceAll('?', '%3F')
                    }`}>
                    <div className='card-image-cell'>
                        <img
                        className="card-image"
                        src={filePath}
                        style={{width: '96px'}}
                        alt={card.name}
                        />
                        {
                        status ? (
                            <img
                            className="small-status-icon"
                            src={`/images/emojis/${status}.png`}
                            alt={status}
                            />
                        ) : ''
                        }
                    </div>
                </Link>
                </td>
                <td className="no-padding-2" style={{verticalAlign: 'top'}}>
                <Link className="black-text" to={`/cards/${
                    card.name.replaceAll('%', '%25')
                    .replaceAll('/', '%2F')
                    .replaceAll(' ', '_')
                    .replaceAll('#', '%23')
                    .replaceAll('?', '%3F')
                    }`}>
                    <table className="inner-cardRow-table">
                        <tbody>
                            <tr>
                            <th
                                colSpan="5"
                                style={{
                                textAlign: 'left',
                                fontSize: '24px',
                                borderBottom: '2px solid #CFDCE5'
                                }}
                            >
                                {card.name}
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
                            {
                                card.category === 'Monster' ? (
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
                                )
                            }
                            {
                                atk !== null ? (
                                    <td height="25px" width="100px" style={{borderRight: '2px solid #CFDCE5'}}>
                                        {'ATK: ' + atk}
                                    </td>
                                ) : (
                                    <td height="25px" width="100px" />
                                )
                            }
                            {
                                def !== null ? (
                                    <td height="25px" width="100px" style={{borderRight: '2px solid #CFDCE5'}}>
                                        {'DEF: ' + def}
                                    </td>
                                ) : (
                                    <td height="25px" width="100px" />
                                )
                            }
                            </tr>
                        </tbody>
                    </table>
                </Link>
                </td>
            </tr>
  )
}

export default MobileCardRow

