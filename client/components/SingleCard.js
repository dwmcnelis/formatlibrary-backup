/* eslint-disable max-statements */

import React from 'react'
import {connect} from 'react-redux'
import {fetchSingleCard} from '../store/cards'
import NavBar from './NavBar.js'

class SingleCard extends React.Component {
  componentDidMount() {
    const id = this.props.match.params.id
    const featuredCard = this.props.featuredCard || null
    const featuredId = featuredCard ? this.props.featuredCard.id : null
    if (featuredId === id) return
    this.props.fetchSingleCard(id)
  }

  // eslint-disable-next-line complexity
  render() {
    if (!this.props.featuredCard) return <div />

    const card = this.props.featuredCard.card

    const status = this.props.featuredCard.status || {
      id: card.id,
      name: card.name,
      may02: card.date <= '2002-07-01' ? 'unlimited' : null,
      jul02: card.date <= '2002-10-01' ? 'unlimited' : null,
      oct02: card.date <= '2002-12-01' ? 'unlimited' : null,
      dec02: card.date <= '2003-04-01' ? 'unlimited' : null,
      apr03: card.date <= '2003-05-01' ? 'unlimited' : null,
      may03: card.date <= '2003-07-01' ? 'unlimited' : null,
      jul03: card.date <= '2003-08-01' ? 'unlimited' : null,
      aug03: card.date <= '2003-11-01' ? 'unlimited' : null,
      nov03: card.date <= '2004-02-01' ? 'unlimited' : null,
      feb04: card.date <= '2004-04-01' ? 'unlimited' : null,
      apr04: card.date <= '2004-10-01' ? 'unlimited' : null,
      oct04: card.date <= '2005-04-01' ? 'unlimited' : null,
      apr05: card.date <= '2005-10-01' ? 'unlimited' : null,
      oct05: card.date <= '2006-04-01' ? 'unlimited' : null,
      apr06: card.date <= '2006-09-01' ? 'unlimited' : null,
      sep06: card.date <= '2007-03-01' ? 'unlimited' : null,
      mar07: card.date <= '2007-06-01' ? 'unlimited' : null,
      jun07: card.date <= '2007-09-01' ? 'unlimited' : null,
      sep07: card.date <= '2008-03-01' ? 'unlimited' : null,
      mar08: card.date <= '2008-05-01' ? 'unlimited' : null,
      may08: card.date <= '2008-09-01' ? 'unlimited' : null,
      sep08: card.date <= '2009-03-01' ? 'unlimited' : null,
      mar09: card.date <= '2009-09-01' ? 'unlimited' : null,
      sep09: card.date <= '2010-03-01' ? 'unlimited' : null,
      mar10: card.date <= '2010-09-01' ? 'unlimited' : null,
      sep10: card.date <= '2011-03-01' ? 'unlimited' : null,
      mar11: card.date <= '2011-09-01' ? 'unlimited' : null,
      sep11: card.date <= '2012-03-01' ? 'unlimited' : null,
      mar12: card.date <= '2012-09-01' ? 'unlimited' : null,
      sep12: card.date <= '2013-03-01' ? 'unlimited' : null,
      mar13: card.date <= '2013-09-01' ? 'unlimited' : null,
      sep13: card.date <= '2013-10-01' ? 'unlimited' : null,
      oct13: card.date <= '2014-01-01' ? 'unlimited' : null,
      jan14: card.date <= '2014-04-01' ? 'unlimited' : null,
      apr14: card.date <= '2014-07-01' ? 'unlimited' : null,
      jul14: card.date <= '2014-10-01' ? 'unlimited' : null,
      oct14: card.date <= '2015-01-01' ? 'unlimited' : null,
      jan15: card.date <= '2015-04-01' ? 'unlimited' : null,
      apr15: card.date <= '2015-07-01' ? 'unlimited' : null,
      jul15: card.date <= '2015-11-01' ? 'unlimited' : null,
      nov15: card.date <= '2016-02-01' ? 'unlimited' : null,
      feb16: card.date <= '2016-04-01' ? 'unlimited' : null,
      apr16: card.date <= '2016-08-01' ? 'unlimited' : null,
      aug16: card.date <= '2017-03-01' ? 'unlimited' : null,
      mar17: card.date <= '2017-06-01' ? 'unlimited' : null,
      jun17: card.date <= '2017-09-01' ? 'unlimited' : null,
      sep17: card.date <= '2017-11-01' ? 'unlimited' : null,
      nov17: card.date <= '2018-02-01' ? 'unlimited' : null,
      feb18: card.date <= '2018-05-01' ? 'unlimited' : null,
      may18: card.date <= '2018-09-01' ? 'unlimited' : null,
      sep18: card.date <= '2018-12-01' ? 'unlimited' : null,
      dec18: card.date <= '2019-01-01' ? 'unlimited' : null,
      jan19: card.date <= '2019-04-01' ? 'unlimited' : null,
      apr19: card.date <= '2019-07-01' ? 'unlimited' : null,
      jul19: card.date <= '2019-10-01' ? 'unlimited' : null,
      oct19: card.date <= '2020-01-01' ? 'unlimited' : null,
      jan20: card.date <= '2020-04-01' ? 'unlimited' : null,
      apr20: card.date <= '2020-06-01' ? 'unlimited' : null,
      jun20: card.date <= '2020-09-01' ? 'unlimited' : null,
      sep20: card.date <= '2020-12-01' ? 'unlimited' : null,
      dec20: card.date <= '2021-03-01' ? 'unlimited' : null,
      mar21: 'unlimited'
    }

    const statusArr = Object.entries(status)
    const slicedStatusArr = statusArr.slice(2, 60)

    let template
    let symbol
    let attribute
    let type
    let starType
    let starWord

    if (card.attribute === 'Divine') attribute = `/images/divine.png`
    if (card.attribute === 'Dark') attribute = `/images/dark.png`
    if (card.attribute === 'Light') attribute = `/images/light.png`
    if (card.attribute === 'Earth') attribute = `/images/earth.png`
    if (card.attribute === 'Wind') attribute = `/images/wind.png`
    if (card.attribute === 'Water') attribute = `/images/water.png`
    if (card.attribute === 'Fire') attribute = `/images/fire.png`

    if (card.type === 'Aqua') type = `/images/aqua.png`
    if (card.type === 'Beast') type = `/images/beast.png`
    if (card.type === 'Beast-Warrior') type = `/images/beast-warrior.png`
    if (card.type === 'Cyberse') type = `/images/cyberse.png`
    if (card.type === 'Dinosaur') type = `/images/dinosaur.png`
    if (card.type === 'Divine-Beast') type = `/images/divine-beast.png`
    if (card.type === 'Dragon') type = `/images/dragon.png`
    if (card.type === 'Fairy') type = `/images/fairy.png`
    if (card.type === 'Fiend') type = `/images/fiend.png`
    if (card.type === 'Fish') type = `/images/fish.png`
    if (card.type === 'Insect') type = `/images/insect.png`
    if (card.type === 'Machine') type = `/images/machine.png`
    if (card.type === 'Plant') type = `/images/plant.png`
    if (card.type === 'Psychic') type = `/images/psychic.png`
    if (card.type === 'Pyro') type = `/images/pyro.png`
    if (card.type === 'Reptile') type = `/images/reptile.png`
    if (card.type === 'Rock') type = `/images/rock.png`
    if (card.type === 'Sea Serpent') type = `/images/sea-serpent.png`
    if (card.type === 'Spellcaster') type = `/images/spellcaster.png`
    if (card.type === 'Thunder') type = `/images/thunder.png`
    if (card.type === 'Warrior') type = `/images/warrior.png`
    if (card.type === 'Winged Beast') type = `/images/winged-beast.png`
    if (card.type === 'Wyrm') type = `/images/wyrm.png`
    if (card.type === 'Zombie') type = `/images/zombie.png`

    if (card.card === 'Monster') {
      starType = `/images/star.png`
      starWord = 'Level'
      if (card.category === 'Normal') template = `/images/monsterCard.jpg`
      if (card.category === 'Effect') template = `/images/effectCard.png`
      if (card.category === 'Fusion') template = `/images/fusionCard.jpg`
      if (card.category === 'Ritual') template = `/images/ritualCard.jpg`
      if (card.category === 'Synchro') template = `/images/synchroCard.png`
      if (card.category === 'Xyz') template = `/images/xyzCard.png`
      if (card.category === 'Pendulum') template = `/images/pendulumCard.png`
      if (card.category === 'Link') template = `/images/linkCard.png`
    }

    if (card.card === 'Spell') {
      template = `/images/spellCard.png`
      if (card.category === 'Continuous') symbol = `/images/continuous.png`
      if (card.category === 'Field') symbol = `/images/field.png`
      if (card.category === 'Ritual') symbol = `/images/ritual.png`
      if (card.category === 'Quick-Play') symbol = `/images/quick-play.png`
      if (card.category === 'Normal') symbol = `/images/normal.png`
      if (card.category === 'Equip') symbol = `/images/equip.png`
    }

    if (card.card === 'Trap') {
      template = `/images/trapCard.jpeg`
      if (card.category === 'Continuous') symbol = `/images/continuous.png`
      if (card.category === 'Counter') symbol = `/images/counter.png`
      if (card.category === 'Normal') symbol = `/images/normal.png`
    }

    if (
      card.category === 'Xyz' ||
      card.class === 'Xyz' ||
      card.subclass === 'Xyz'
    ) {
      starType = `/images/rank.png`
      starWord = 'Rank'
    }

    if (
      card.category === 'Link' ||
      card.class === 'Link' ||
      card.subclass === 'Link'
    ) {
      starType = `/images/link`
      starWord = 'Link'
    }

    const imagePath = `/card-images/${card.image}`
    let cardType = `${card.card} / ${card.category}`
    if (card.class) cardType += ` / ${card.class}`
    if (card.subclass) cardType += ` / ${card.subclass}`

    return (
      <div style={{margin: '12px'}}>
        <NavBar />
        <br />
        {card.id ? (
          <div>
            <br />
            <div className="flexy">
              <img className="single-card-image" src={imagePath} />
              <table className="single-card-table">
                <thead>
                  <tr>
                    <th colSpan="5" className="single-card-title">
                      {card.name}
                    </th>
                  </tr>
                </thead>
                {card.card === 'Monster' ? (
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
                        {card.attribute.toUpperCase()}
                      </td>
                      <td className="single-card-symbol-td">
                        <img src={type} className="single-card-symbol" />
                      </td>
                      <td colSpan="2" className="single-card-label-td">
                        {card.type}
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
                        {card.description}
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
                        {starWord} {card.level}
                      </td>
                      <td className="single-card-label-inner-td">
                        ATK: {card.atk}
                      </td>
                      <td className="single-card-label-td">DEF: {card.def}</td>
                    </tr>
                    <tr className="single-card-date-row">
                      <td colSpan="5">
                        Release Date - {card.date.slice(0, 10)}
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
                        {card.card}
                      </td>
                      <td className="single-card-symbol-td">
                        <img src={symbol} className="single-card-symbol" />
                      </td>
                      <td colSpan="2" className="single-card-label-td">
                        {card.category}
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
                        {card.description}
                      </td>
                    </tr>
                    <tr className="blank-row">
                      <td colSpan="5">
                        <div />
                      </td>
                    </tr>
                    <tr className="single-card-date-row">
                      <td colSpan="5">
                        Release Date - {card.date.slice(0, 10)}
                      </td>
                    </tr>
                  </tbody>
                )}
              </table>
            </div>
            <br />
            <span style={{padding: '10px', position: 'relative', left: '2.5%'}}>
              Status History:
            </span>
            <div className="status-box">
              {slicedStatusArr ? (
                slicedStatusArr.map(function(elem) {
                  const date = `${elem[0]
                    .slice(0, 1)
                    .toUpperCase()}${elem[0].slice(1, 3)} '${elem[0].slice(3)}`
                  if (elem[1] === null)
                    return (
                      <div
                        key={elem[0]}
                        className="status-cell"
                        style={{backgroundColor: '#e8e8e8'}}
                      >
                        <p>
                          {date}
                          <span>***</span>
                        </p>
                      </div>
                    )
                  if (elem[1] === 'forbidden')
                    return (
                      <div
                        key={elem[0]}
                        className="status-cell"
                        style={{backgroundColor: 'red'}}
                      >
                        <p>{date}</p>
                      </div>
                    )
                  if (elem[1] === 'limited')
                    return (
                      <div
                        key={elem[0]}
                        className="status-cell"
                        style={{backgroundColor: 'orange'}}
                      >
                        <p>{date}</p>
                      </div>
                    )
                  if (elem[1] === 'semi-limited')
                    return (
                      <div
                        key={elem[0]}
                        className="status-cell"
                        style={{backgroundColor: 'yellow'}}
                      >
                        <p>{date}</p>
                      </div>
                    )
                  if (elem[1] === 'unlimited')
                    return (
                      <div
                        key={elem[0]}
                        className="status-cell"
                        style={{backgroundColor: 'green'}}
                      >
                        <p>{date}</p>
                      </div>
                    )
                })
              ) : (
                <div style={{backgroundColor: 'white'}} />
              )}
            </div>
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
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
    featuredCard: state.cards.featuredCard
  }
}

const mapDispatch = dispatch => ({
  fetchSingleCard: id => dispatch(fetchSingleCard(id))
})

export default connect(mapState, mapDispatch)(SingleCard)
