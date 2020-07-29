/* eslint-disable max-statements */

import React from 'react'

import Divine from '../../public/images/divine.png'
import Light from '../../public/images/light.png'
import Dark from '../../public/images/dark.png'
import Earth from '../../public/images/earth.png'
import Wind from '../../public/images/wind.png'
import Water from '../../public/images/water.png'
import Fire from '../../public/images/fire.png'

import Spell from '../../public/images/spell.png'
import Trap from '../../public/images/trap.png'

import Star from '../../public/images/star.png'
import Rank from '../../public/images/rank.png'
import Link from '../../public/images/link.png'

import Continuous from '../../public/images/continuous.png'
import QuickPlay from '../../public/images/quick-play.png'
import Field from '../../public/images/field.png'
import Ritual from '../../public/images/ritual.png'
import Counter from '../../public/images/counter.png'

import Aqua from '../../public/images/aqua.png'
import Beast from '../../public/images/beast.png'
import BeastWarrior from '../../public/images/beast-warrior.png'
import Cyberse from '../../public/images/cyberse.png'
import Dinosaur from '../../public/images/dinosaur.png'
import DivineBeast from '../../public/images/divine-beast.png'
import Dragon from '../../public/images/dragon.png'
import Fairy from '../../public/images/fairy.png'
import Fiend from '../../public/images/fiend.png'
import Fish from '../../public/images/fish.png'
import Insect from '../../public/images/insect.png'
import Machine from '../../public/images/machine.png'
import Plant from '../../public/images/plant.png'
import Psychic from '../../public/images/psychic.png'
import Reptile from '../../public/images/reptile.png'
import Rock from '../../public/images/rock.png'
import SeaSerpent from '../../public/images/sea-serpent.png'
import Spellcaster from '../../public/images/spellcaster.png'
import Thunder from '../../public/images/thunder.png'
import Warrior from '../../public/images/warrior.png'
import WingedBeast from '../../public/images/winged-beast.png'
import Wyrm from '../../public/images/wyrm.png'
import Zombie from '../../public/images/zombie.png'

class Card extends React.Component {
  // eslint-disable-next-line complexity
  render() {
    const stats = []
    if (this.props.card.type) stats.push(this.props.card.type)
    if (this.props.card.category) stats.push(this.props.card.category)
    if (this.props.card.class) stats.push(this.props.card.class)
    if (this.props.card.subclass) stats.push(this.props.card.subclass)
    const line = stats.join(' / ')

    let symbol
    let symbol2 = Star
    let symbol3
    let word = 'Level'
    if (this.props.card.attribute === 'Divine') symbol = Divine
    if (this.props.card.attribute === 'Dark') symbol = Dark
    if (this.props.card.attribute === 'Light') symbol = Light
    if (this.props.card.attribute === 'Earth') symbol = Earth
    if (this.props.card.attribute === 'Wind') symbol = Wind
    if (this.props.card.attribute === 'Water') symbol = Water
    if (this.props.card.attribute === 'Fire') symbol = Fire

    if (this.props.card.type === 'Aqua') symbol3 = Aqua
    if (this.props.card.type === 'Beast') symbol3 = Beast
    if (this.props.card.type === 'Beast-Warrior') symbol3 = BeastWarrior
    if (this.props.card.type === 'Cyberse') symbol3 = Cyberse
    if (this.props.card.type === 'Dinosaur') symbol3 = Dinosaur
    if (this.props.card.type === 'Divine-Beast') symbol3 = DivineBeast
    if (this.props.card.type === 'Dragon') symbol3 = Dragon
    if (this.props.card.type === 'Fairy') symbol3 = Fairy
    if (this.props.card.type === 'Fiend') symbol3 = Fiend
    if (this.props.card.type === 'Fish') symbol3 = Fish
    if (this.props.card.type === 'Insect') symbol3 = Insect
    if (this.props.card.type === 'Machine') symbol3 = Machine
    if (this.props.card.type === 'Plant') symbol3 = Plant
    if (this.props.card.type === 'Psychic') symbol3 = Psychic
    if (this.props.card.type === 'Reptile') symbol3 = Reptile
    if (this.props.card.type === 'Rock') symbol3 = Rock
    if (this.props.card.type === 'Sea Serpent') symbol3 = SeaSerpent
    if (this.props.card.type === 'Spellcaster') symbol3 = Spellcaster
    if (this.props.card.type === 'Thunder') symbol3 = Thunder
    if (this.props.card.type === 'Warrior') symbol3 = Warrior
    if (this.props.card.type === 'Winged Beast') symbol3 = WingedBeast
    if (this.props.card.type === 'Wyrm') symbol3 = Wyrm
    if (this.props.card.type === 'Zombie') symbol3 = Zombie

    if (this.props.card.card === 'Spell') {
      symbol = Spell
      symbol2 = ''
      if (this.props.card.category === 'Continuous') symbol2 = Continuous
      if (this.props.card.category === 'Field') symbol2 = Field
      if (this.props.card.category === 'Ritual') symbol2 = Ritual
      if (this.props.card.category === 'Quick-Play') symbol2 = QuickPlay
    }

    if (this.props.card.card === 'Trap') {
      symbol = Trap
      symbol2 = ''
      if (this.props.card.category === 'Continous') symbol2 = Continuous
      if (this.props.card.category === 'Counter') symbol2 = Counter
    }

    if (
      this.props.card.category === 'Xyz' ||
      this.props.card.class === 'Xyz' ||
      this.props.card.subclass === 'Xyz'
    ) {
      symbol2 = Rank
      word = 'Rank'
    }

    if (
      this.props.card.category === 'Link' ||
      this.props.card.class === 'Link' ||
      this.props.card.subclass === 'Link'
    ) {
      symbol2 = Link
      word = 'Link'
    }

    const attribute = this.props.card.attribute
      ? this.props.card.attribute
      : this.props.card.card.toUpperCase()
    const level =
      this.props.card.level !== null ? `${word} ${this.props.card.level}` : line
    const atk =
      this.props.card.atk !== null ? `ATK ${this.props.card.atk}` : null
    const def =
      this.props.card.def !== null ? `DEF ${this.props.card.def}` : null
    const rowColor = this.props.index % 2 ? '#F7FAFC' : '#FFFFFF'

    return (
      <tr
        style={{
          borderBottom: '2px solid #9faac2',
          backgroundColor: `${rowColor}`
        }}
      >
        <td style={{verticalAlign: 'top'}}>
          <img src={this.props.card.image} alt={this.props.card.name} />
        </td>
        <td style={{paddingTop: '0px', verticalAlign: 'top'}}>
          <table style={{paddingTop: '0px', verticalAlign: 'top'}}>
            <tr>
              <th
                colSpan="5"
                style={{
                  textAlign: 'left',
                  fontSize: '19px',
                  borderBottom: '2px solid #CFDCE5'
                }}
              >
                {this.props.card.name}
              </th>
              <th
                style={{
                  fontWeight: 'normal',
                  fontSize: '15px',
                  textAlign: 'right',
                  borderBottom: '2px solid #CFDCE5'
                }}
              >
                {this.props.card.date.substring(0, 10)}
              </th>
            </tr>
            <tr>
              <td width="90px" style={{borderRight: '2px solid #CFDCE5'}}>
                <img
                  src={symbol}
                  height="20px"
                  style={{verticalAlign: 'middle'}}
                  alt="attribute/card-type"
                />{' '}
                {attribute.toUpperCase()}
              </td>
              {symbol2.length ? (
                <td width="120px" style={{borderRight: '2px solid #CFDCE5'}}>
                  <img
                    src={symbol2}
                    margin="0px"
                    height="20px"
                    style={{verticalAlign: 'middle'}}
                    alt="level/category"
                  />{' '}
                  {level}
                </td>
              ) : (
                <td width="120px" />
              )}
              {stats.length > 1 ? (
                <td width="220px" style={{borderRight: '2px solid #CFDCE5'}}>
                  <img
                    src={symbol3}
                    margin="0px"
                    height="20px"
                    style={{verticalAlign: 'middle'}}
                    alt="level/category"
                  />{' '}
                  {line}
                </td>
              ) : (
                <td width="220px" />
              )}
              {atk ? (
                <td width="100px" style={{borderRight: '2px solid #CFDCE5'}}>
                  {atk}
                </td>
              ) : (
                <td width="100px" />
              )}
              {def ? (
                <td width="100px" style={{borderRight: '2px solid #CFDCE5'}}>
                  {def}
                </td>
              ) : (
                <td width="100px" />
              )}
              <td />
            </tr>
            <tr>
              <td
                colSpan="6"
                style={{fontSize: '15px', borderTop: '2px solid #CFDCE5'}}
              >
                {this.props.card.description}
              </td>
            </tr>
          </table>
        </td>
      </tr>
    )
  }
}

export default Card
