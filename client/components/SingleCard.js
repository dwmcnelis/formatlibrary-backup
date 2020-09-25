/* eslint-disable max-statements */

import React from 'react'
import {connect} from 'react-redux'
import {fetchSingleCard} from '../store/cards'
import NavBar from './NavBar.js'

class SingleCard extends React.Component {
  componentDidMount() {
    if (this.props.card.name) return
    const id = this.props.match.params.id
    this.props.fetchSingleCard(id)
  }

  // eslint-disable-next-line complexity
  render() {
    let template
    let symbol
    let attribute
    let type
    let starType
    let starWord

    if (this.props.card.attribute === 'Divine') attribute = `/images/divine.png`
    if (this.props.card.attribute === 'Dark') attribute = `/images/dark.png`
    if (this.props.card.attribute === 'Light') attribute = `/images/light.png`
    if (this.props.card.attribute === 'Earth') attribute = `/images/earth.png`
    if (this.props.card.attribute === 'Wind') attribute = `/images/wind.png`
    if (this.props.card.attribute === 'Water') attribute = `/images/water.png`
    if (this.props.card.attribute === 'Fire') attribute = `/images/fire.png`

    if (this.props.card.type === 'Aqua') type = `/images/aqua.png`
    if (this.props.card.type === 'Beast') type = `/images/beast.png`
    if (this.props.card.type === 'Beast-Warrior')
      type = `/images/beast-warrior.png`
    if (this.props.card.type === 'Cyberse') type = `/images/cyberse.png`
    if (this.props.card.type === 'Dinosaur') type = `/images/dinosaur.png`
    if (this.props.card.type === 'Divine-Beast')
      type = `/images/divine-beast.png`
    if (this.props.card.type === 'Dragon') type = `/images/dragon.png`
    if (this.props.card.type === 'Fairy') type = `/images/fairy.png`
    if (this.props.card.type === 'Fiend') type = `/images/fiend.png`
    if (this.props.card.type === 'Fish') type = `/images/fish.png`
    if (this.props.card.type === 'Insect') type = `/images/insect.png`
    if (this.props.card.type === 'Machine') type = `/images/machine.png`
    if (this.props.card.type === 'Plant') type = `/images/plant.png`
    if (this.props.card.type === 'Psychic') type = `/images/psychic.png`
    if (this.props.card.type === 'Pyro') type = `/images/pyro.png`
    if (this.props.card.type === 'Reptile') type = `/images/reptile.png`
    if (this.props.card.type === 'Rock') type = `/images/rock.png`
    if (this.props.card.type === 'Sea Serpent') type = `/images/sea-serpent.png`
    if (this.props.card.type === 'Spellcaster') type = `/images/spellcaster.png`
    if (this.props.card.type === 'Thunder') type = `/images/thunder.png`
    if (this.props.card.type === 'Warrior') type = `/images/warrior.png`
    if (this.props.card.type === 'Winged Beast')
      type = `/images/winged-beast.png`
    if (this.props.card.type === 'Wyrm') type = `/images/wyrm.png`
    if (this.props.card.type === 'Zombie') type = `/images/zombie.png`

    if (this.props.card.card === 'Monster') {
      starType = `/images/star.png`
      starWord = 'Level'
      if (this.props.card.category === 'Normal')
        template = `/images/monsterCard.jpg`
      if (this.props.card.category === 'Effect')
        template = `/images/effectCard.png`
      if (this.props.card.category === 'Fusion')
        template = `/images/fusionCard.jpg`
      if (this.props.card.category === 'Ritual')
        template = `/images/ritualCard.jpg`
      if (this.props.card.category === 'Synchro')
        template = `/images/synchroCard.png`
      if (this.props.card.category === 'Xyz') template = `/images/xyzCard.png`
      if (this.props.card.category === 'Pendulum')
        template = `/images/pendulumCard.png`
      if (this.props.card.category === 'Link') template = `/images/linkCard.png`
    }

    if (this.props.card.card === 'Spell') {
      template = `/images/spellCard.png`
      if (this.props.card.category === 'Continuous')
        symbol = `/images/continuous.png`
      if (this.props.card.category === 'Field') symbol = `/images/field.png`
      if (this.props.card.category === 'Ritual') symbol = `/images/ritual.png`
      if (this.props.card.category === 'Quick-Play')
        symbol = `/images/quick-play.png`
      if (this.props.card.category === 'Normal') symbol = `/images/normal.png`
      if (this.props.card.category === 'Equip') symbol = `/images/equip.png`
    }

    if (this.props.card.card === 'Trap') {
      template = `/images/trapCard.jpeg`
      if (this.props.card.category === 'Continuous')
        symbol = `/images/continuous.png`
      if (this.props.card.category === 'Counter') symbol = `/images/counter.png`
      if (this.props.card.category === 'Normal') symbol = `/images/normal.png`
    }

    if (
      this.props.card.category === 'Xyz' ||
      this.props.card.class === 'Xyz' ||
      this.props.card.subclass === 'Xyz'
    ) {
      starType = `/images/rank.png`
      starWord = 'Rank'
    }

    if (
      this.props.card.category === 'Link' ||
      this.props.card.class === 'Link' ||
      this.props.card.subclass === 'Link'
    ) {
      starType = `/images/link`
      starWord = 'Link'
    }

    const imagePath = `/card-images/${this.props.card.image}`
    let cardType = `${this.props.card.card} / ${this.props.card.category}`
    if (this.props.card.class) cardType += ` / ${this.props.card.class}`
    if (this.props.card.subclass) cardType += ` / ${this.props.card.subclass}`

    return (
      <div style={{margin: '12px'}}>
        <NavBar />
        <br />
        {this.props.card.id ? (
          <div>
            <br />
            <div className="flexy">
              <img className="single-card-image" src={imagePath} />
              <table className="single-card-table">
                <thead>
                  <tr>
                    <th colSpan="5" className="single-card-title">
                      {this.props.card.name}
                    </th>
                  </tr>
                </thead>
                {this.props.card.card === 'Monster' ? (
                  <tbody>
                    <tr className="single-card-standard-row">
                      <td className="single-card-symbol-td">
                        <img src={template} className="single-card-cardType" />
                      </td>
                      <td colSpan="4" className="single-card-large-label">
                        {cardType}
                      </td>
                    </tr>
                    <tr className="single-card-standard-row">
                      <td className="single-card-symbol-td">
                        <img src={attribute} className="single-card-symbol" />
                      </td>
                      <td className="single-card-label-inner-td">
                        {this.props.card.attribute.toUpperCase()}
                      </td>
                      <td className="single-card-symbol-td">
                        <img src={type} className="single-card-symbol" />
                      </td>
                      <td colSpan="2" className="single-card-label-td">
                        {this.props.card.type}
                      </td>
                    </tr>
                    <tr
                      style={{
                        alignContent: 'left',
                        fontSize: '16px',
                        fontStyle: 'italic'
                      }}
                    >
                      <td colSpan="5" style={{padding: '20px 0px 0px 10px'}}>
                        Description:
                      </td>
                    </tr>
                    <tr style={{alignContent: 'left', fontSize: '18px'}}>
                      <td colSpan="5" className="single-card-description-box">
                        {this.props.card.description}
                      </td>
                    </tr>
                    <tr className="blank-row">
                      <td colSpan="5">
                        <div />
                      </td>
                    </tr>
                    <tr className="single-card-bottom-row">
                      <td className="single-card-symbol-td">
                        <img src={starType} className="single-card-symbol" />
                      </td>
                      <td colSpan="2" className="single-card-label-inner-td">
                        {starWord} {this.props.card.level}
                      </td>
                      <td className="single-card-label-inner-td">
                        ATK: {this.props.card.atk}
                      </td>
                      <td className="single-card-label-td">
                        DEF: {this.props.card.def}
                      </td>
                    </tr>
                    <tr className="single-card-date-row">
                      <td colSpan="5">
                        Release Date - {this.props.card.date.slice(0, 10)}
                      </td>
                    </tr>
                  </tbody>
                ) : (
                  <tbody>
                    <tr className="single-card-standard-row">
                      <td className="single-card-symbol-td">
                        <img src={template} className="single-card-cardType" />
                      </td>
                      <td className="single-card-label-inner-td">
                        {this.props.card.card}
                      </td>
                      <td className="single-card-symbol-td">
                        <img src={symbol} className="single-card-symbol" />
                      </td>
                      <td colSpan="2" className="single-card-label-td">
                        {this.props.card.category}
                      </td>
                    </tr>
                    <tr
                      style={{
                        alignContent: 'left',
                        fontSize: '16px',
                        fontStyle: 'italic'
                      }}
                    >
                      <td colSpan="5" style={{padding: '20px 0px 0px 10px'}}>
                        Description:
                      </td>
                    </tr>
                    <tr style={{alignContent: 'left', fontSize: '18px'}}>
                      <td colSpan="5" className="single-card-description-box">
                        {this.props.card.description}
                      </td>
                    </tr>
                    <tr className="blank-row">
                      <td colSpan="5">
                        <div />
                      </td>
                    </tr>
                    <tr className="single-card-date-row">
                      <td colSpan="5">
                        Release Date - {this.props.card.date.slice(0, 10)}
                      </td>
                    </tr>
                  </tbody>
                )}
              </table>
            </div>
          </div>
        ) : (
          ''
        )}
      </div>
    )
  }
}

const mapState = state => {
  return {
    card: state.cards
  }
}

const mapDispatch = dispatch => ({
  fetchSingleCard: id => dispatch(fetchSingleCard(id))
})

export default connect(mapState, mapDispatch)(SingleCard)
