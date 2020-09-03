/* eslint-disable no-eval */
/* eslint-disable complexity */

import React from 'react'
import Card from './Card.js'
import NavBar from './NavBar.js'
import PrettoSlider from './Slider.js'
import Pagination from './Pagination.js'
import {connect} from 'react-redux'
import Star from '../../public/images/star.png'
import Swords from '../../public/images/swords.png'
import Shield from '../../public/images/shield.png'
import Calendar from '../../public/images/calendar.png'
import {fetchAllCards, fetchSomeCards, fetchFirstXCards} from '../store/cards'

import ABC from '../../public/images/abc.jpg'
import Altair from '../../public/images/altair.jpg'
import Bear from '../../public/images/bear.jpg'
import Blaster from '../../public/images/blaster.jpg'
import BLS from '../../public/images/bls.jpg'
import CED from '../../public/images/ced.jpg'
import Clown from '../../public/images/clown.jpg'
import Cydra from '../../public/images/cydra.jpg'
import DAD from '../../public/images/dad.jpg'
import Dandy from '../../public/images/dandy.jpg'
import DDWL from '../../public/images/ddwl.jpg'
import Drident from '../../public/images/drident.jpg'
import DSF from '../../public/images/dsf.jpg'
import ETele from '../../public/images/etele.jpg'
import Falco from '../../public/images/falco.jpg'
import Gala from '../../public/images/gala.jpg'
import Graff from '../../public/images/graff.jpg'
import Jackalope from '../../public/images/jackalope.jpg'
import Jinn from '../../public/images/jinn.jpg'
import Jinzo from '../../public/images/jinzo.jpg'
import Kuraz from '../../public/images/kuraz.jpg'
import LaDD from '../../public/images/ladd.jpg'
import Laq from '../../public/images/laq.jpg'
import Linde from '../../public/images/linde.jpg'
import Lumina from '../../public/images/lumina.jpg'
import Lunalight from '../../public/images/lunalight.jpg'
import Luster from '../../public/images/luster.jpg'
import Missus from '../../public/images/missus.jpg'
import Monkey from '../../public/images/monkey.jpg'
import Myrm from '../../public/images/myrm.jpg'
import Nekroz from '../../public/images/nekroz.jpg'
import Pulsar from '../../public/images/pulsar.jpg'
import QFix from '../../public/images/qfix.jpg'
import Rabbit from '../../public/images/rabbit.jpg'
import Ratpier from '../../public/images/ratpier.jpg'
import Reaper from '../../public/images/reaper.jpg'
import Rei from '../../public/images/rei.jpg'
import Riscorpio from '../../public/images/riscorpio.jpg'
import Rocket from '../../public/images/rocket.jpg'
import Sangan from '../../public/images/sangan.jpg'
import Shark from '../../public/images/shark.jpg'
import Sheep from '../../public/images/sheep.jpg'
import Shien from '../../public/images/shien.jpg'
import Sorc from '../../public/images/sorc.jpg'
import Spore from '../../public/images/spore.jpg'
import Stein from '../../public/images/stein.jpg'
import Subs from '../../public/images/subs.jpg'
import TDrag from '../../public/images/tdrag.jpg'
import TGU from '../../public/images/tgu.jpg'
import Tidal from '../../public/images/tidal.jpg'
import Tough from '../../public/images/tough.jpg'
import Trish from '../../public/images/trish.jpg'
import Trooper from '../../public/images/trooper.jpg'
import Tuning from '../../public/images/tuning.jpg'
import VLord from '../../public/images/vlord.jpg'
import Yata from '../../public/images/yata.jpg'

const currentCardCount = 9720

class CardTable extends React.Component {
  constructor() {
    super()
    this.state = {
      page: 1,
      cardsPerPage: 10,
      sortBy: null,
      format: 'All Formats',
      logo: BLS,
      event: 'May 2002 - Sept 2020',
      allFetched: false,
      advanced: false,
      queryParams: {
        name: null,
        description: null,
        card: null,
        attribute: {
          dark: false,
          light: false,
          earth: false,
          wind: false,
          water: false,
          fire: false,
          divine: false
        },
        category: {
          normal: false,
          continuous: false,
          counter: false,
          equip: false,
          field: false,
          ritual: false,
          quickPlay: false,
          normalMonster: false,
          effect: false,
          fusion: false,
          ritualMonster: false,
          synchro: false,
          xyz: false,
          pendulum: false,
          link: false
        },
        class: {
          flip: false,
          gemini: false,
          spirit: false,
          toon: false,
          tuner: false,
          union: false
        },
        type: {
          aqua: false,
          beast: false,
          beastWarrior: false,
          cyberse: false,
          dinosaur: false,
          divineBeast: false,
          dragon: false,
          fairy: false,
          fiend: false,
          fish: false,
          insect: false,
          machine: false,
          plant: false,
          psychic: false,
          pyro: false,
          reptile: false,
          rock: false,
          seaSerpent: false,
          spellcaster: false,
          thunder: false,
          warrior: false,
          wingedBeast: false,
          wyrm: false,
          zombie: false
        }
      }
    }

    this.applyFilter = this.applyFilter.bind(this)
    this.applySelector = this.applySelector.bind(this)
    this.setFormat = this.setFormat.bind(this)
    this.search = this.search.bind(this)
    this.changeSearchType = this.changeSearchType.bind(this)
    this.hideAdvancedOptions = this.hideAdvancedOptions.bind(this)
    this.changeCardsPerPage = this.changeCardsPerPage.bind(this)
    this.sortCards = this.sortCards.bind(this)
    this.previousPage = this.previousPage.bind(this)
    this.nextPage = this.nextPage.bind(this)
    this.goToPage = this.goToPage.bind(this)
  }

  changeCardsPerPage() {
    this.setState({
      cardsPerPage: Number(
        document.getElementById('cardsPerPageSelector').value
      ),
      page: 1
    })
  }

  sortCards() {
    this.setState({
      sortBy: document.getElementById('sortSelector').value,
      page: 1
    })
  }

  hideAdvancedOptions() {
    this.setState({advanced: false})
  }

  changeSearchType() {
    this.setState(state => {
      return {advanced: !state.advanced}
    })
  }

  goToPage(num, location) {
    this.setState({page: num})
    if (location === 'bottom') {
      const tableTop = document.getElementById('resultsWrapper0').offsetTop - 10
      window.scrollTo(0, tableTop)
    }
  }

  previousPage(location) {
    this.setState(state => {
      if (state.page <= 1) return
      return {page: state.page - 1}
    })
    if (location === 'bottom') {
      const tableTop = document.getElementById('resultsWrapper0').offsetTop - 10
      window.scrollTo(0, tableTop)
    }
  }

  nextPage(location) {
    this.setState(state => {
      if (state.page >= Math.ceil(this.props.cards.length / state.cardsPerPage))
        return
      return {page: state.page + 1}
    })
    if (location === 'bottom') {
      const tableTop = document.getElementById('resultsWrapper0').offsetTop - 10
      window.scrollTo(0, tableTop)
    }
  }

  // eslint-disable-next-line max-statements
  setFormat() {
    const format = document.getElementById('format').value || 'All Formats'
    let day, month, year, logo, event
    if (format === 'All Formats') {
      day = null
      month = null
      year = null
      logo = BLS
      event = 'May 2002 - Sept 2020'
    } else if (format === 'Yugi-Kaiba Format') {
      day = 1
      month = 5
      year = 2002
      logo = Jinn
      event = 'May 2002'
    } else if (format === 'Critter Format') {
      day = 1
      month = 7
      year = 2002
      logo = Sangan
      event = 'July 2002'
    } else if (format === 'Android Format') {
      day = 1
      month = 5
      year = 2003
      logo = Jinzo
      event = 'May 2003'
    } else if (format === 'Yata Format') {
      day = 10
      month = 8
      year = 2003
      logo = Yata
      event = 'Yu-Gi-Oh! World Championship - August 2003'
    } else if (format === 'Vampire Format') {
      day = 1
      month = 2
      year = 2004
      logo = VLord
      event = 'February 2004'
    } else if (format === 'Trad Chaos Format') {
      day = 26
      month = 6
      year = 2004
      logo = CED
      event = 'U.S. National Championship - June 2004'
    } else if (format === 'Chaos Warrior Format') {
      day = 13
      month = 2
      year = 2005
      logo = DDWL
      event = 'SJC Columbus - February 2005'
    } else if (format === 'Goat Format') {
      day = 20
      month = 8
      year = 2005
      logo = Sheep
      event = 'SJC Indianapolis - August 2005'
    } else if (format === 'CRV Goat Format') {
      day = 10
      month = 9
      year = 2005
      logo = Cydra
      event = 'SJC Boston - September 2005'
    } else if (format === 'Reaper Format') {
      day = 26
      month = 2
      year = 2006
      logo = Reaper
      event = 'SJC Durham - February 2006'
    } else if (format === 'Chaos Return Format') {
      day = 12
      month = 8
      year = 2006
      logo = Sorc
      event = 'SJC Indianapolis - August 2006'
    } else if (format === 'Stein Format') {
      day = 9
      month = 12
      year = 2006
      logo = Stein
      event = 'SJC San Jose - December 2006'
    } else if (format === 'Troop Dup Format') {
      day = 18
      month = 8
      year = 2007
      logo = Trooper
      event = 'SJC Indianapolis - August 2007'
    } else if (format === 'Perfect Circle Format') {
      day = 26
      month = 1
      year = 2008
      logo = LaDD
      event = 'SJC Orlando - January 2008'
    } else if (format === 'DAD Return Format') {
      day = 12
      month = 4
      year = 2008
      logo = DAD
      event = 'SJC Minneapolis - April 2008'
    } else if (format === 'Glad Beast Format') {
      day = 26
      month = 7
      year = 2008
      logo = Laq
      event = 'U.S. National Championship - July 2008'
    } else if (format === 'TeleDAD Format') {
      day = 17
      month = 1
      year = 2009
      logo = ETele
      event = 'SJC Houston - January 2009'
    } else if (format === 'Dark Strike Format') {
      day = 26
      month = 7
      year = 2009
      logo = DSF
      event = 'U.S. National Championship - July 2009'
    } else if (format === 'Lightsworn Format') {
      day = 27
      month = 2
      year = 2010
      logo = Lumina
      event = 'SJC Nashville - February 2010'
    } else if (format === 'Edison Format') {
      day = 24
      month = 4
      year = 2010
      logo = Dandy
      event = 'SJC Edison - April 2010'
    } else if (format === 'Frog Format') {
      day = 7
      month = 8
      year = 2010
      logo = Subs
      event = 'YCS Indianapolis - August 2010'
    } else if (format === 'Six Samurai Format') {
      day = 12
      month = 2
      year = 2011
      logo = Shien
      event = 'YCS Dallas - February 2011'
    } else if (format === 'Providence Format') {
      day = 18
      month = 6
      year = 2011
      logo = Trish
      event = 'YCS Providence - June 2011'
    } else if (format === 'Tengu Plant Format') {
      day = 22
      month = 10
      year = 2011
      logo = Spore
      event = 'YCS Columbus - October 2011'
    } else if (format === 'Long Beach Format') {
      day = 24
      month = 3
      year = 2012
      logo = Pulsar
      event = 'YCS Long Beach - March 2012'
    } else if (format === 'Dino Rabbit Format') {
      day = 30
      month = 6
      year = 2012
      logo = Rabbit
      event = 'NAWCQ - June 2012'
    } else if (format === 'Wind-Up Format') {
      day = 23
      month = 2
      year = 2013
      logo = Shark
      event = 'YCS Santiago - February 2013'
    } else if (format === 'Meadowlands Format') {
      day = 11
      month = 5
      year = 2013
      logo = Linde
      event = 'YCS Meadownlands - May 2013'
    } else if (format === 'Baby Ruler Format') {
      day = 13
      month = 7
      year = 2013
      logo = Tidal
      event = 'NAWCQ - July 2013'
    } else if (format === 'Ravine Ruler Format') {
      day = 26
      month = 10
      year = 2013
      logo = Blaster
      event = 'YCS San Mateo - October 2013'
    } else if (format === 'Fire-Water Format') {
      day = 22
      month = 3
      year = 2014
      logo = Bear
      event = 'YCS Chicago - March 2014'
    } else if (format === 'HAT Format') {
      day = 12
      month = 7
      year = 2014
      logo = Myrm
      event = 'NAWCQ - July 2014'
    } else if (format === 'Shaddoll Format') {
      day = 6
      month = 9
      year = 2014
      logo = Falco
      event = 'YCS Toronto - September 2014'
    } else if (format === 'London Format') {
      day = 25
      month = 10
      year = 2014
      logo = Altair
      event = 'YCS London - October 2014'
    } else if (format === 'Burning Abyss Format') {
      day = 6
      month = 12
      year = 2014
      logo = Graff
      event = 'YCS Milan - December 2014'
    } else if (format === 'Charleston Format') {
      day = 1
      month = 2
      year = 2015
      logo = TGU
      event = 'YCS Charleston - February 2015'
    } else if (format === 'Nekroz Format') {
      day = 27
      month = 6
      year = 2015
      logo = Nekroz
      event = 'NAWCQ - June 2015'
    } else if (format === 'Clown Format') {
      day = 3
      month = 10
      year = 2015
      logo = Clown
      event = 'YCS Dallas - October 2015'
    } else if (format === 'PePe Format') {
      day = 16
      month = 1
      year = 2016
      logo = Monkey
      event = 'YCS Sydney - January 2016'
    } else if (format === 'DracoPal Format') {
      day = 9
      month = 4
      year = 2016
      logo = Luster
      event = 'YCS Houston - April 2016'
    } else if (format === 'Monarch Format') {
      day = 9
      month = 7
      year = 2016
      logo = Kuraz
      event = 'NAWCQ - July 2016'
    } else if (format === 'ABC Format') {
      day = 15
      month = 1
      year = 2017
      logo = ABC
      event = 'YCS Sydney - January 2017'
    } else if (format === 'Grass Zoo Format') {
      day = 8
      month = 4
      year = 2017
      logo = Ratpier
      event = 'YCS Denver - April 2017'
    } else if (format === 'Draco Zoo Format') {
      day = 8
      month = 7
      year = 2017
      logo = Drident
      event = 'NAWCQ - July 2017'
    } else if (format === 'Link Zoo Format') {
      day = 30
      month = 10
      year = 2017
      logo = Missus
      event = 'YCS Toronto - October 2017'
    } else if (format === 'Quik-Fix Format') {
      day = 25
      month = 11
      year = 2017
      logo = QFix
      event = 'YCS London - November 2017'
    } else if (format === 'Tough Format') {
      day = 13
      month = 1
      year = 2018
      logo = Tough
      event = 'YCS Melbourne - January 2018'
    } else if (format === 'Magician Format') {
      day = 28
      month = 4
      year = 2018
      logo = Tuning
      event = 'YCS Santiago - April 2018'
    } else if (format === 'Gouki Format') {
      day = 30
      month = 6
      year = 2018
      logo = Riscorpio
      event = 'NAWCQ - June 2018'
    } else if (format === 'Danger Format') {
      day = 17
      month = 11
      year = 2018
      logo = Jackalope
      event = 'YCS Pasadena - November 2018'
    } else if (format === 'Prank-Kids Format') {
      day = 11
      month = 12
      year = 2018
      logo = Rocket
      event = 'YCS Milan - December 2018'
    } else if (format === 'Sky Striker Format') {
      day = 30
      month = 3
      year = 2019
      logo = Rei
      event = 'YCS Guatemala - March 2019'
    } else if (format === 'Thunder Dragon Format') {
      day = 23
      month = 6
      year = 2019
      logo = TDrag
      event = 'NAWCQ - June 2019'
    } else if (format === 'Lunalight Orcust Format') {
      day = 5
      month = 10
      year = 2019
      logo = Lunalight
      event = 'YCS Fort Worth - October 2019'
    } else if (format === 'Striker Orcust Format') {
      day = 15
      month = 1
      year = 2020
      logo = Gala
      event = 'YCS Las Vegas - January 2020'
    }

    console.log('day', day)
    console.log('month', month)
    console.log('year', year)
    console.log('format', format)
    console.log('logo', logo)
    console.log('event', event)

    this.setState({
      day,
      month,
      year,
      format,
      logo,
      event
    })

    const that = this

    setTimeout(function() {
      that.search()
    }, 100)
  }

  applySelector(selectorId) {
    this.setState(state => {
      return {
        queryParams: {
          ...state.queryParams,
          [selectorId]: document.getElementById(selectorId).value
        }
      }
    })

    const that = this

    setTimeout(function() {
      that.search()
    }, 100)
  }

  applyFilter(filterType, filterId) {
    this.setState(state => {
      return {
        queryParams: {
          ...state.queryParams,
          [filterType]: {...state.queryParams[filterType], [filterId]: true}
        }
      }
    })
  }

  removeFilter(filterType, filterId) {
    this.setState(state => {
      return {
        queryParams: {
          ...state.queryParams,
          [filterType]: {...state.queryParams[filterType], [filterId]: false}
        }
      }
    })
  }

  runSearch() {
    const filterId = document.getElementById('searchTypeSelector').value
    const otherFilterId = filterId === 'description' ? 'name' : 'description'
    this.setState(state => {
      return {
        queryParams: {
          ...state.queryParams,
          [filterId]: document.getElementById('searchBar').value,
          [otherFilterId]: null
        }
      }
    })
  }

  componentDidMount() {
    if (!this.props.cards.length) {
      this.props.fetchFirstXCards(this.state.cardsPerPage * 10)
    }
  }

  async search() {
    console.log('this.props.sliders', this.props.sliders)

    const sliders = {}

    sliders.year = this.state.year ? this.state.year : this.props.sliders.year
    sliders.month = this.state.month
      ? this.state.month
      : this.props.sliders.month
    sliders.day = this.state.day ? this.state.day : this.props.sliders.day

    console.log('SLIDERS', sliders)

    try {
      const filters = {...this.state.queryParams, ...sliders}
      await this.props.fetchSomeCards(filters)
      this.setState({page: 1})
    } catch (err) {
      console.log(err)
    }

    this.hideAdvancedOptions()
  }

  async componentDidUpdate() {
    if (!this.state.allFetched) {
      try {
        await this.props.fetchAllCards()
        this.setState({allFetched: true})
      } catch (err) {
        console.log(err)
      }
    }
  }

  render() {
    console.log('this.state', this.state)
    console.log('this.props', this.props)
    const lastIndex = this.state.page * this.state.cardsPerPage
    const firstIndex = lastIndex - this.state.cardsPerPage

    const nameDESC = (a, b) => {
      if (a.name < b.name) return 1
      if (a.name > b.name) return -1
      return 0
    }

    const nameASC = (a, b) => {
      if (a.name < b.name) return -1
      if (a.name > b.name) return 1
      return 0
    }

    const atkDESC = (a, b) => {
      return a.atk - b.atk
    }

    const atkASC = (a, b) => {
      return b.atk - a.atk
    }

    const defDESC = (a, b) => {
      return a.def - b.def
    }

    const defASC = (a, b) => {
      return b.def - a.def
    }

    const levelDESC = (a, b) => {
      return a.level - b.level
    }

    const levelASC = (a, b) => {
      return b.level - a.level
    }

    const dateDESC = (a, b) => {
      if (a.date < b.date) return 1
      if (a.date > b.date) return -1
      return 0
    }

    const dateASC = (a, b) => {
      if (a.date < b.date) return -1
      if (a.date > b.date) return 1
      return 0
    }

    if (this.props.cards.length) {
      if (this.state.sortBy === 'nameASC') this.props.cards.sort(nameASC)
      if (this.state.sortBy === 'nameDESC') this.props.cards.sort(nameDESC)
      if (this.state.sortBy === 'atkASC') this.props.cards.sort(atkASC)
      if (this.state.sortBy === 'atkDESC') this.props.cards.sort(atkDESC)
      if (this.state.sortBy === 'defASC') this.props.cards.sort(defASC)
      if (this.state.sortBy === 'defDESC') this.props.cards.sort(defDESC)
      if (this.state.sortBy === 'levelASC') this.props.cards.sort(levelASC)
      if (this.state.sortBy === 'levelDESC') this.props.cards.sort(levelDESC)
      if (this.state.sortBy === 'dateASC') this.props.cards.sort(dateASC)
      if (this.state.sortBy === 'dateDESC') this.props.cards.sort(dateDESC)
    }

    const cardsArray = this.props.cards.length
      ? this.props.cards.slice(firstIndex, lastIndex)
      : []

    return (
      <div>
        <NavBar />
        <br />

        <div id="flexbox">
          <img src={this.state.logo} style={{width: '128px'}} />
          <div>
            <h1>{this.state.format}</h1>
            <h2>{this.state.event}</h2>
          </div>
          <img src={this.state.logo} style={{width: '128px'}} />
        </div>

        <div className="searchWrapper">
          <input
            id="searchBar"
            className="filter"
            type="text"
            placeholder="🔍"
            onChange={() => {
              this.runSearch()
            }}
            onKeyDown={() => {
              if (event.keyCode === 13) this.search()
            }}
          />

          <select
            id="searchTypeSelector"
            className="filter"
            onChange={() => {
              this.runSearch()
            }}
          >
            <option selected="selected" value="name">
              Card Name
            </option>
            <option value="description">Card Text</option>
          </select>

          <select
            id="card"
            className="filter"
            onChange={() => {
              this.applySelector('card')
            }}
          >
            <option selected="selected" value={null}>
              All Cards
            </option>
            <option value="Monster">Monsters</option>
            <option value="Spell">Spells</option>
            <option value="Trap">Traps</option>
          </select>

          <select
            id="format"
            className="filter"
            onChange={() => {
              this.setFormat()
            }}
          >
            <option selected="selected" value={null}>
              All Formats
            </option>
            <option value="Yugi-Kaiba Format">Yugi-Kaiba</option>
            <option value="Critter Format">Critter</option>
            <option value="Android Format">Android</option>
            <option value="Yata Format">Yata</option>
            <option value="Vampire Format">Vampire</option>
            <option value="Trad Chaos Format">Trad Chaos</option>
            <option value="Chaos Warrior Format">Chaos Warrior</option>
            <option value="Goat Format">Goat</option>
            <option value="CRV Goat Format">CRV Goat</option>
            <option value="Reaper Format">Reaper</option>
            <option value="Chaos Return Format">Chaos Return</option>
            <option value="Stein Format">Stein</option>
            <option value="Troop Dup Format">Troop Dup</option>
            <option value="Perfect Circle Format">Perfect Circle</option>
            <option value="DAD Return Format">DAD Return</option>
            <option value="Glad Beast Format">Glad Beast</option>
            <option value="TeleDAD Format">TeleDAD</option>
            <option value="Dark Strike Format">Dark Strike</option>
            <option value="Lightsworn Format">Lightsworn</option>
            <option value="Edison Format">Edison</option>
            <option value="Frog Format">Frog</option>
            <option value="Six Samurai Format">Six Samurai</option>
            <option value="Providence Format">Providence</option>
            <option value="Tengu Plant Format">Tengu Plant</option>
            <option value="Long Beach Format">Long Beach</option>
            <option value="Dino Rabbit Format">Dino Rabbit</option>
            <option value="Wind-Up Format">Wind-Up</option>
            <option value="Meadowlands Format">Meadowlands</option>
            <option value="Baby Ruler Format">Baby Ruler</option>
            <option value="Ravine Ruler Format">Ravine Ruler</option>
            <option value="Fire-Water Format">Fire-Water</option>
            <option value="HAT Format">HAT</option>
            <option value="Shaddoll Format">Shaddoll</option>
            <option value="London Format">London</option>
            <option value="Burning Abyss Format">Burning Abyss</option>
            <option value="Charleston Format">Charleston</option>
            <option value="Nekroz Format">Nekroz</option>
            <option value="Clown Format">Clown</option>
            <option value="DracoPal Format">DracoPal</option>
            <option value="PePe Format">PePe</option>
            <option value="Monarch Format">Monarch</option>
            <option value="ABC Format">ABC</option>
            <option value="Grass Zoo Format">Grass Zoo</option>
            <option value="Draco Zoo Format">Draco Zoo</option>
            <option value="Link Zoo Format">Link Zoo</option>
            <option value="Quik-Fix Format">Quik-Fix</option>
            <option value="Tough Format">Tough</option>
            <option value="Magician Format">Magician</option>
            <option value="Gouki Format">Gouki</option>
            <option value="Danger Format">Danger</option>
            <option value="Prank-Kids Format">Prank-Kids</option>
            <option value="Sky Striker Format">Sky Striker</option>
            <option value="Thunder Dragon Format">Thunder Dragon</option>
            <option value="Lunalight Orcust Format">Lunalight Orcust</option>
            <option value="Striker Orcust Format">Striker Orcust</option>
          </select>

          <a
            className="searchButton"
            type="submit"
            onClick={() => {
              this.search()
            }}
          >
            Search
          </a>
        </div>

        {!this.state.advanced ? (
          <div className="refinedWrapper">
            <a
              className="refinedButton"
              type="submit"
              onClick={() => {
                this.changeSearchType()
              }}
            >
              Show Advanced Search Options
            </a>
          </div>
        ) : (
          <div className="refinedWrapper">
            <a
              className="refinedButton"
              type="submit"
              onClick={() => {
                this.changeSearchType()
              }}
            >
              Hide Advanced Search Options
            </a>

            <br />

            <div className="refinedInnerWrapper">
              {this.state.queryParams.category.normal ? (
                <a
                  className="clickedOptionButton"
                  id="normal"
                  type="submit"
                  onClick={() => {
                    this.removeFilter('category', 'normal')
                  }}
                >
                  Normal
                </a>
              ) : (
                <a
                  className="optionButton"
                  id="normal"
                  type="submit"
                  onClick={() => {
                    this.applyFilter('category', 'normal')
                  }}
                >
                  Normal
                </a>
              )}

              {this.state.queryParams.category.continuous ? (
                <a
                  className="clickedOptionButton"
                  id="continuous"
                  type="submit"
                  onClick={() => {
                    this.removeFilter('category', 'continuous')
                  }}
                >
                  Contin.
                </a>
              ) : (
                <a
                  className="optionButton"
                  id="continuous"
                  type="submit"
                  onClick={() => {
                    this.applyFilter('category', 'continuous')
                  }}
                >
                  Contin.
                </a>
              )}

              {this.state.queryParams.category.counter ? (
                <a
                  className="clickedOptionButton"
                  id="counter"
                  type="submit"
                  onClick={() => {
                    this.removeFilter('category', 'counter')
                  }}
                >
                  Counter
                </a>
              ) : (
                <a
                  className="optionButton"
                  id="counter"
                  type="submit"
                  onClick={() => {
                    this.applyFilter('category', 'counter')
                  }}
                >
                  Counter
                </a>
              )}

              {this.state.queryParams.category.equip ? (
                <a
                  className="clickedOptionButton"
                  id="equip"
                  type="submit"
                  onClick={() => {
                    this.removeFilter('category', 'equip')
                  }}
                >
                  Equip
                </a>
              ) : (
                <a
                  className="optionButton"
                  id="equip"
                  type="submit"
                  onClick={() => {
                    this.applyFilter('category', 'equip')
                  }}
                >
                  Equip
                </a>
              )}

              {this.state.queryParams.category.field ? (
                <a
                  className="clickedOptionButton"
                  id="field"
                  type="submit"
                  onClick={() => {
                    this.removeFilter('category', 'field')
                  }}
                >
                  Field
                </a>
              ) : (
                <a
                  className="optionButton"
                  id="field"
                  type="submit"
                  onClick={() => {
                    this.applyFilter('category', 'field')
                  }}
                >
                  Field
                </a>
              )}

              {this.state.queryParams.category.ritual ? (
                <a
                  className="clickedOptionButton"
                  id="ritual"
                  type="submit"
                  onClick={() => {
                    this.removeFilter('category', 'ritual')
                  }}
                >
                  Ritual
                </a>
              ) : (
                <a
                  className="optionButton"
                  id="ritual"
                  type="submit"
                  onClick={() => {
                    this.applyFilter('category', 'ritual')
                  }}
                >
                  Ritual
                </a>
              )}

              {this.state.queryParams.category.quickPlay ? (
                <a
                  className="clickedOptionButton"
                  id="quick-play"
                  type="submit"
                  onClick={() => {
                    this.removeFilter('category', 'quickPlay')
                  }}
                >
                  Quick-P.
                </a>
              ) : (
                <a
                  className="optionButton"
                  id="quick-play"
                  type="submit"
                  onClick={() => {
                    this.applyFilter('category', 'quickPlay')
                  }}
                >
                  Quick-P.
                </a>
              )}
            </div>

            <div className="refinedInnerWrapper">
              {this.state.queryParams.attribute.dark ? (
                <a
                  className="clickedAttributeButton"
                  id="dark"
                  type="submit"
                  onClick={() => {
                    this.removeFilter('attribute', 'dark')
                  }}
                >
                  DARK
                </a>
              ) : (
                <a
                  className="attributeButton"
                  id="dark"
                  type="submit"
                  onClick={() => {
                    this.applyFilter('attribute', 'dark')
                  }}
                >
                  DARK
                </a>
              )}

              {this.state.queryParams.attribute.light ? (
                <a
                  className="clickedAttributeButton"
                  id="light"
                  type="submit"
                  onClick={() => {
                    this.removeFilter('attribute', 'light')
                  }}
                >
                  LIGHT
                </a>
              ) : (
                <a
                  className="attributeButton"
                  id="light"
                  type="submit"
                  onClick={() => {
                    this.applyFilter('attribute', 'light')
                  }}
                >
                  LIGHT
                </a>
              )}

              {this.state.queryParams.attribute.earth ? (
                <a
                  className="clickedAttributeButton"
                  id="earth"
                  type="submit"
                  onClick={() => {
                    this.removeFilter('attribute', 'earth')
                  }}
                >
                  EARTH
                </a>
              ) : (
                <a
                  className="attributeButton"
                  id="earth"
                  type="submit"
                  onClick={() => {
                    this.applyFilter('attribute', 'earth')
                  }}
                >
                  EARTH
                </a>
              )}

              {this.state.queryParams.attribute.wind ? (
                <a
                  className="clickedAttributeButton"
                  id="wind"
                  type="submit"
                  onClick={() => {
                    this.removeFilter('attribute', 'wind')
                  }}
                >
                  WIND
                </a>
              ) : (
                <a
                  className="attributeButton"
                  id="wind"
                  type="submit"
                  onClick={() => {
                    this.applyFilter('attribute', 'wind')
                  }}
                >
                  WIND
                </a>
              )}

              {this.state.queryParams.attribute.water ? (
                <a
                  className="clickedAttributeButton"
                  id="water"
                  type="submit"
                  onClick={() => {
                    this.removeFilter('attribute', 'water')
                  }}
                >
                  WATER
                </a>
              ) : (
                <a
                  className="attributeButton"
                  id="water"
                  type="submit"
                  onClick={() => {
                    this.applyFilter('attribute', 'water')
                  }}
                >
                  WATER
                </a>
              )}

              {this.state.queryParams.attribute.fire ? (
                <a
                  className="clickedAttributeButton"
                  id="fire"
                  type="submit"
                  onClick={() => {
                    this.removeFilter('attribute', 'fire')
                  }}
                >
                  FIRE
                </a>
              ) : (
                <a
                  className="attributeButton"
                  id="fire"
                  type="submit"
                  onClick={() => {
                    this.applyFilter('attribute', 'fire')
                  }}
                >
                  FIRE
                </a>
              )}

              {this.state.queryParams.attribute.divine ? (
                <a
                  className="clickedAttributeButton"
                  id="divine"
                  type="submit"
                  onClick={() => {
                    this.removeFilter('attribute', 'divine')
                  }}
                >
                  DIVINE
                </a>
              ) : (
                <a
                  className="attributeButton"
                  id="divine"
                  type="submit"
                  onClick={() => {
                    this.applyFilter('attribute', 'divine')
                  }}
                >
                  DIVINE
                </a>
              )}
            </div>
            <div className="refinedInnerWrapper">
              {this.state.queryParams.type.aqua ? (
                <a
                  className="clickedTypeButton"
                  id="aqua"
                  type="submit"
                  onClick={() => {
                    this.removeFilter('type', 'aqua')
                  }}
                >
                  Aqua
                </a>
              ) : (
                <a
                  className="typeButton"
                  id="aqua"
                  type="submit"
                  onClick={() => {
                    this.applyFilter('type', 'aqua')
                  }}
                >
                  Aqua
                </a>
              )}

              {this.state.queryParams.type.beast ? (
                <a
                  className="clickedTypeButton"
                  id="beast"
                  type="submit"
                  onClick={() => {
                    this.removeFilter('type', 'beast')
                  }}
                >
                  Beast
                </a>
              ) : (
                <a
                  className="typeButton"
                  id="beast"
                  type="submit"
                  onClick={() => {
                    this.applyFilter('type', 'beast')
                  }}
                >
                  Beast
                </a>
              )}

              {this.state.queryParams.type.beastWarrior ? (
                <a
                  className="clickedTypeButton"
                  id="beast-warrior"
                  type="submit"
                  onClick={() => {
                    this.removeFilter('type', 'beastWarrior')
                  }}
                >
                  Beast-War.
                </a>
              ) : (
                <a
                  className="typeButton"
                  id="beast-warrior"
                  type="submit"
                  onClick={() => {
                    this.applyFilter('type', 'beastWarrior')
                  }}
                >
                  Beast-War.
                </a>
              )}

              {this.state.queryParams.type.cyberse ? (
                <a
                  className="clickedTypeButton"
                  id="cyberse"
                  type="submit"
                  onClick={() => {
                    this.removeFilter('type', 'cyberse')
                  }}
                >
                  Cyberse
                </a>
              ) : (
                <a
                  className="typeButton"
                  id="cyberse"
                  type="submit"
                  onClick={() => {
                    this.applyFilter('type', 'cyberse')
                  }}
                >
                  Cyberse
                </a>
              )}

              {this.state.queryParams.type.dinosaur ? (
                <a
                  className="clickedTypeButton"
                  id="dinosaur"
                  type="submit"
                  onClick={() => {
                    this.removeFilter('type', 'dinosaur')
                  }}
                >
                  Dinosaur
                </a>
              ) : (
                <a
                  className="typeButton"
                  id="dinosaur"
                  type="submit"
                  onClick={() => {
                    this.applyFilter('type', 'dinosaur')
                  }}
                >
                  Dinosaur
                </a>
              )}

              {this.state.queryParams.type.dragon ? (
                <a
                  className="clickedTypeButton"
                  id="dragon"
                  type="submit"
                  onClick={() => {
                    this.removeFilter('type', 'dragon')
                  }}
                >
                  Dragon
                </a>
              ) : (
                <a
                  className="typeButton"
                  id="dragon"
                  type="submit"
                  onClick={() => {
                    this.applyFilter('type', 'dragon')
                  }}
                >
                  Dragon
                </a>
              )}

              <br />

              {this.state.queryParams.type.divineBeast ? (
                <a
                  className="clickedTypeButton"
                  id="divine-beast"
                  type="submit"
                  onClick={() => {
                    this.removeFilter('type', 'divineBeast')
                  }}
                >
                  Divine-B.
                </a>
              ) : (
                <a
                  className="typeButton"
                  id="divine-beast"
                  type="submit"
                  onClick={() => {
                    this.applyFilter('type', 'divineBeast')
                  }}
                >
                  Divine-B.
                </a>
              )}

              {this.state.queryParams.type.fairy ? (
                <a
                  className="clickedTypeButton"
                  id="fairy"
                  type="submit"
                  onClick={() => {
                    this.removeFilter('type', 'fairy')
                  }}
                >
                  Fairy
                </a>
              ) : (
                <a
                  className="typeButton"
                  id="fairy"
                  type="submit"
                  onClick={() => {
                    this.applyFilter('type', 'fairy')
                  }}
                >
                  Fairy
                </a>
              )}

              {this.state.queryParams.type.fiend ? (
                <a
                  className="clickedTypeButton"
                  id="fiend"
                  type="submit"
                  onClick={() => {
                    this.removeFilter('type', 'fiend')
                  }}
                >
                  Fiend
                </a>
              ) : (
                <a
                  className="typeButton"
                  id="fiend"
                  type="submit"
                  onClick={() => {
                    this.applyFilter('type', 'fiend')
                  }}
                >
                  Fiend
                </a>
              )}

              {this.state.queryParams.type.fish ? (
                <a
                  className="clickedTypeButton"
                  id="fish"
                  type="submit"
                  onClick={() => {
                    this.removeFilter('type', 'fish')
                  }}
                >
                  Fish
                </a>
              ) : (
                <a
                  className="typeButton"
                  id="fish"
                  type="submit"
                  onClick={() => {
                    this.applyFilter('type', 'fish')
                  }}
                >
                  Fish
                </a>
              )}

              {this.state.queryParams.type.insect ? (
                <a
                  className="clickedTypeButton"
                  id="insect"
                  type="submit"
                  onClick={() => {
                    this.removeFilter('type', 'insect')
                  }}
                >
                  Insect
                </a>
              ) : (
                <a
                  className="typeButton"
                  id="insect"
                  type="submit"
                  onClick={() => {
                    this.applyFilter('type', 'insect')
                  }}
                >
                  Insect
                </a>
              )}

              {this.state.queryParams.type.machine ? (
                <a
                  className="clickedTypeButton"
                  id="machine"
                  type="submit"
                  onClick={() => {
                    this.removeFilter('type', 'machine')
                  }}
                >
                  Machine
                </a>
              ) : (
                <a
                  className="typeButton"
                  id="machine"
                  type="submit"
                  onClick={() => {
                    this.applyFilter('type', 'machine')
                  }}
                >
                  Machine
                </a>
              )}

              <br />

              {this.state.queryParams.type.plant ? (
                <a
                  className="clickedTypeButton"
                  id="plant"
                  type="submit"
                  onClick={() => {
                    this.removeFilter('type', 'plant')
                  }}
                >
                  Plant
                </a>
              ) : (
                <a
                  className="typeButton"
                  id="plant"
                  type="submit"
                  onClick={() => {
                    this.applyFilter('type', 'plant')
                  }}
                >
                  Plant
                </a>
              )}

              {this.state.queryParams.type.psychic ? (
                <a
                  className="clickedTypeButton"
                  id="psychic"
                  type="submit"
                  onClick={() => {
                    this.removeFilter('type', 'psychic')
                  }}
                >
                  Psychic
                </a>
              ) : (
                <a
                  className="typeButton"
                  id="psychic"
                  type="submit"
                  onClick={() => {
                    this.applyFilter('type', 'psychic')
                  }}
                >
                  Psychic
                </a>
              )}

              {this.state.queryParams.type.pyro ? (
                <a
                  className="clickedTypeButton"
                  id="pyro"
                  type="submit"
                  onClick={() => {
                    this.removeFilter('type', 'pyro')
                  }}
                >
                  Pyro
                </a>
              ) : (
                <a
                  className="typeButton"
                  id="pyro"
                  type="submit"
                  onClick={() => {
                    this.applyFilter('type', 'pyro')
                  }}
                >
                  Pyro
                </a>
              )}

              {this.state.queryParams.type.reptile ? (
                <a
                  className="clickedTypeButton"
                  id="reptile"
                  type="submit"
                  onClick={() => {
                    this.removeFilter('type', 'reptile')
                  }}
                >
                  Reptile
                </a>
              ) : (
                <a
                  className="typeButton"
                  id="reptile"
                  type="submit"
                  onClick={() => {
                    this.applyFilter('type', 'reptile')
                  }}
                >
                  Reptile
                </a>
              )}

              {this.state.queryParams.type.rock ? (
                <a
                  className="clickedTypeButton"
                  id="rock"
                  type="submit"
                  onClick={() => {
                    this.removeFilter('type', 'rock')
                  }}
                >
                  Rock
                </a>
              ) : (
                <a
                  className="typeButton"
                  id="rock"
                  type="submit"
                  onClick={() => {
                    this.applyFilter('type', 'rock')
                  }}
                >
                  Rock
                </a>
              )}

              {this.state.queryParams.type.seaSerpent ? (
                <a
                  className="clickedTypeButton"
                  id="sea-serpent"
                  type="submit"
                  onClick={() => {
                    this.removeFilter('type', 'seaSerpent')
                  }}
                >
                  Sea Serp.
                </a>
              ) : (
                <a
                  className="typeButton"
                  id="sea-serpent"
                  type="submit"
                  onClick={() => {
                    this.applyFilter('type', 'seaSerpent')
                  }}
                >
                  Sea Serp.
                </a>
              )}

              <br />

              {this.state.queryParams.type.spellcaster ? (
                <a
                  className="clickedTypeButton"
                  id="spellcaster"
                  type="submit"
                  onClick={() => {
                    this.removeFilter('type', 'spellcaster')
                  }}
                >
                  Spellcaster
                </a>
              ) : (
                <a
                  className="typeButton"
                  id="spellcaster"
                  type="submit"
                  onClick={() => {
                    this.applyFilter('type', 'spellcaster')
                  }}
                >
                  Spellcaster
                </a>
              )}

              {this.state.queryParams.type.thunder ? (
                <a
                  className="clickedTypeButton"
                  id="thunder"
                  type="submit"
                  onClick={() => {
                    this.removeFilter('type', 'thunder')
                  }}
                >
                  Thunder
                </a>
              ) : (
                <a
                  className="typeButton"
                  id="thunder"
                  type="submit"
                  onClick={() => {
                    this.applyFilter('type', 'thunder')
                  }}
                >
                  Thunder
                </a>
              )}

              {this.state.queryParams.type.warrior ? (
                <a
                  className="clickedTypeButton"
                  id="warrior"
                  type="submit"
                  onClick={() => {
                    this.removeFilter('type', 'warrior')
                  }}
                >
                  Warrior
                </a>
              ) : (
                <a
                  className="typeButton"
                  id="warrior"
                  type="submit"
                  onClick={() => {
                    this.applyFilter('type', 'warrior')
                  }}
                >
                  Warrior
                </a>
              )}

              {this.state.queryParams.type.wingedBeast ? (
                <a
                  className="clickedTypeButton"
                  id="winged-beast"
                  type="submit"
                  onClick={() => {
                    this.removeFilter('type', 'wingedBeast')
                  }}
                >
                  Winged B.
                </a>
              ) : (
                <a
                  className="typeButton"
                  id="winged-beast"
                  type="submit"
                  onClick={() => {
                    this.applyFilter('type', 'wingedBeast')
                  }}
                >
                  Winged B.
                </a>
              )}

              {this.state.queryParams.type.wyrm ? (
                <a
                  className="clickedTypeButton"
                  id="wyrm"
                  type="submit"
                  onClick={() => {
                    this.removeFilter('type', 'wyrm')
                  }}
                >
                  Wyrm
                </a>
              ) : (
                <a
                  className="typeButton"
                  id="wyrm"
                  type="submit"
                  onClick={() => {
                    this.applyFilter('type', 'wyrm')
                  }}
                >
                  Wyrm
                </a>
              )}

              {this.state.queryParams.type.zombie ? (
                <a
                  className="clickedTypeButton"
                  id="zombie"
                  type="submit"
                  onClick={() => {
                    this.removeFilter('type', 'zombie')
                  }}
                >
                  Zombie
                </a>
              ) : (
                <a
                  className="typeButton"
                  id="zombie"
                  type="submit"
                  onClick={() => {
                    this.applyFilter('type', 'zombie')
                  }}
                >
                  Zombie
                </a>
              )}
            </div>
            <div className="refinedInnerWrapper">
              {this.state.queryParams.category.normalMonster ? (
                <a
                  className="clickedMonsterButton"
                  id="normal-monster"
                  type="submit"
                  onClick={() => {
                    this.removeFilter('category', 'normalMonster')
                  }}
                >
                  Normal
                </a>
              ) : (
                <a
                  className="monsterButton"
                  id="normal-monster"
                  type="submit"
                  onClick={() => {
                    this.applyFilter('category', 'normalMonster')
                  }}
                >
                  Normal
                </a>
              )}

              {this.state.queryParams.category.effect ? (
                <a
                  className="clickedMonsterButton"
                  id="effect"
                  type="submit"
                  onClick={() => {
                    this.removeFilter('category', 'effect')
                  }}
                >
                  Effect
                </a>
              ) : (
                <a
                  className="monsterButton"
                  id="effect"
                  type="submit"
                  onClick={() => {
                    this.applyFilter('category', 'effect')
                  }}
                >
                  Effect
                </a>
              )}

              {this.state.queryParams.category.ritualMonster ? (
                <a
                  className="clickedMonsterButton"
                  id="ritual-monster"
                  type="submit"
                  onClick={() => {
                    this.removeFilter('category', 'ritualMonster')
                  }}
                >
                  Ritual
                </a>
              ) : (
                <a
                  className="monsterButton"
                  id="ritual-monster"
                  type="submit"
                  onClick={() => {
                    this.applyFilter('category', 'ritualMonster')
                  }}
                >
                  Ritual
                </a>
              )}

              {this.state.queryParams.category.pendulum ? (
                <a
                  className="clickedMonsterButton"
                  id="pendulum"
                  type="submit"
                  onClick={() => {
                    this.removeFilter('category', 'pendulum')
                  }}
                >
                  Pend.
                </a>
              ) : (
                <a
                  className="monsterButton"
                  id="pendulum"
                  type="submit"
                  onClick={() => {
                    this.applyFilter('category', 'pendulum')
                  }}
                >
                  Pend.
                </a>
              )}

              <br />

              {this.state.queryParams.category.fusion ? (
                <a
                  className="clickedMonsterButton"
                  id="fusion"
                  type="submit"
                  onClick={() => {
                    this.removeFilter('category', 'fusion')
                  }}
                >
                  Fusion
                </a>
              ) : (
                <a
                  className="monsterButton"
                  id="fusion"
                  type="submit"
                  onClick={() => {
                    this.applyFilter('category', 'fusion')
                  }}
                >
                  Fusion
                </a>
              )}

              {this.state.queryParams.category.synchro ? (
                <a
                  className="clickedMonsterButton"
                  id="synchro"
                  type="submit"
                  onClick={() => {
                    this.removeFilter('category', 'synchro')
                  }}
                >
                  Synchro
                </a>
              ) : (
                <a
                  className="monsterButton"
                  id="synchro"
                  type="submit"
                  onClick={() => {
                    this.applyFilter('category', 'synchro')
                  }}
                >
                  Synchro
                </a>
              )}

              {this.state.queryParams.category.xyz ? (
                <a
                  className="clickedMonsterButton"
                  id="xyz"
                  type="submit"
                  onClick={() => {
                    this.removeFilter('category', 'xyz')
                  }}
                >
                  Xyz
                </a>
              ) : (
                <a
                  className="monsterButton"
                  id="xyz"
                  type="submit"
                  onClick={() => {
                    this.applyFilter('category', 'xyz')
                  }}
                >
                  Xyz
                </a>
              )}

              {this.state.queryParams.category.link ? (
                <a
                  className="clickedMonsterButton"
                  id="link"
                  type="submit"
                  onClick={() => {
                    this.removeFilter('category', 'link')
                  }}
                >
                  Link
                </a>
              ) : (
                <a
                  className="monsterButton"
                  id="link"
                  type="submit"
                  onClick={() => {
                    this.applyFilter('category', 'link')
                  }}
                >
                  Link
                </a>
              )}
            </div>
            <div className="refinedInnerWrapper">
              {this.state.queryParams.class.flip ? (
                <a
                  className="clickedMonsterButton"
                  id="flip"
                  type="submit"
                  onClick={() => {
                    this.removeFilter('class', 'flip')
                  }}
                >
                  Flip
                </a>
              ) : (
                <a
                  className="monsterButton"
                  id="flip"
                  type="submit"
                  onClick={() => {
                    this.applyFilter('class', 'flip')
                  }}
                >
                  Flip
                </a>
              )}

              {this.state.queryParams.class.gemini ? (
                <a
                  className="clickedMonsterButton"
                  id="gemini"
                  type="submit"
                  onClick={() => {
                    this.removeFilter('class', 'gemini')
                  }}
                >
                  Gemini
                </a>
              ) : (
                <a
                  className="monsterButton"
                  id="gemini"
                  type="submit"
                  onClick={() => {
                    this.applyFilter('class', 'gemini')
                  }}
                >
                  Gemini
                </a>
              )}

              {this.state.queryParams.class.spirit ? (
                <a
                  className="clickedMonsterButton"
                  id="spirit"
                  type="submit"
                  onClick={() => {
                    this.removeFilter('class', 'spirit')
                  }}
                >
                  Spirit
                </a>
              ) : (
                <a
                  className="monsterButton"
                  id="spirit"
                  type="submit"
                  onClick={() => {
                    this.applyFilter('class', 'spirit')
                  }}
                >
                  Spirit
                </a>
              )}

              {this.state.queryParams.class.toon ? (
                <a
                  className="clickedMonsterButton"
                  id="toon"
                  type="submit"
                  onClick={() => {
                    this.removeFilter('class', 'toon')
                  }}
                >
                  Toon
                </a>
              ) : (
                <a
                  className="monsterButton"
                  id="toon"
                  type="submit"
                  onClick={() => {
                    this.applyFilter('class', 'toon')
                  }}
                >
                  Toon
                </a>
              )}

              {this.state.queryParams.class.tuner ? (
                <a
                  className="clickedMonsterButton"
                  id="tuner"
                  type="submit"
                  onClick={() => {
                    this.removeFilter('class', 'tuner')
                  }}
                >
                  Tuner
                </a>
              ) : (
                <a
                  className="monsterButton"
                  id="tuner"
                  type="submit"
                  onClick={() => {
                    this.applyFilter('class', 'tuner')
                  }}
                >
                  Tuner
                </a>
              )}

              {this.state.queryParams.class.union ? (
                <a
                  className="clickedMonsterButton"
                  id="union"
                  type="submit"
                  onClick={() => {
                    this.removeFilter('class', 'union')
                  }}
                >
                  Union
                </a>
              ) : (
                <a
                  className="monsterButton"
                  id="union"
                  type="submit"
                  onClick={() => {
                    this.applyFilter('class', 'union')
                  }}
                >
                  Union
                </a>
              )}
            </div>

            <br />

            <div className="sliderWrapper0">
              <div className="sliderWrapper1">
                <PrettoSlider
                  id="level"
                  type="range-slider"
                  symbol={Star}
                  label="Level"
                  step={1}
                  min={1}
                  max={12}
                />
                <PrettoSlider
                  id="atk"
                  type="range-slider"
                  symbol={Swords}
                  label="ATK"
                  step={50}
                  min={0}
                  max={5000}
                />
                <PrettoSlider
                  id="def"
                  type="range-slider"
                  symbol={Shield}
                  label="DEF"
                  step={50}
                  min={0}
                  max={5000}
                />
              </div>

              <div className="sliderWrapper1">
                <PrettoSlider
                  id="year"
                  type="continuous-slider"
                  symbol={Calendar}
                  label="Year"
                  step={1}
                  min={2002}
                  max={2020}
                  defaultValue={this.state.year}
                />
                <PrettoSlider
                  id="month"
                  type="continuous-slider"
                  symbol={Calendar}
                  label="Month"
                  step={1}
                  min={1}
                  max={12}
                  defaultValue={this.state.month}
                />
                <PrettoSlider
                  id="day"
                  type="continuous-slider"
                  symbol={Calendar}
                  label="Day"
                  step={1}
                  min={1}
                  max={31}
                  defaultValue={this.state.day}
                />
              </div>
            </div>
          </div>
        )}

        <br />

        <div id="resultsWrapper0" className="resultsWrapper0">
          <div id="results" className="results" style={{width: '215px'}}>
            Results:{' '}
            {this.state.cardsPerPage * this.state.page -
              this.state.cardsPerPage +
              1}
            {'-'}
            {this.props.cards.length >=
            this.state.cardsPerPage * this.state.page
              ? this.state.cardsPerPage * this.state.page
              : this.props.cards.length}
            {' of '}
            {this.state.allFetched ? this.props.cards.length : currentCardCount}
          </div>

          <div className="pagination">
            <Pagination
              location="top"
              nextPage={this.nextPage}
              previousPage={this.previousPage}
              goToPage={this.goToPage}
              cards={this.props.cards}
              page={this.state.page}
              cardsPerPage={this.state.cardsPerPage}
            />
          </div>

          <div id="vertFlexbox">
            <div id="results" className="results" style={{width: '215px'}}>
              {'Display: '}
              <select
                id="cardsPerPageSelector"
                style={{width: '105px'}}
                onChange={() => {
                  this.changeCardsPerPage()
                }}
              >
                <option selected="selected" value="10">
                  10 Cards
                </option>
                <option value="25">25 Cards</option>
                <option value="50">50 Cards</option>
                <option value="100">100 Cards</option>
              </select>
            </div>

            <div className="results" style={{width: '215px'}}>
              {'Sort By: '}
              <select
                id="sortSelector"
                style={{width: '105px'}}
                onChange={() => {
                  this.sortCards()
                }}
              >
                <option selected="selected" value="nameASC">
                  Name ⬇
                </option>
                <option value="nameDESC">Name ⬆</option>
                <option value="atkASC">ATK ⬇</option>
                <option value="atkDESC">ATK ⬆</option>
                <option value="defASC">DEF ⬇</option>
                <option value="defDESC">DEF ⬆</option>
                <option value="levelASC">Level ⬇</option>
                <option value="levelDESC">Level ⬆</option>
                <option value="dateASC">Date ⬇</option>
                <option value="dateDESC">Date ⬆</option>
              </select>
            </div>
          </div>
        </div>

        <div id="myTable" className="center">
          <table id="cards">
            <tbody>
              {cardsArray.length ? (
                cardsArray.map((card, index) => {
                  return <Card key={card.id} index={index} card={card} />
                })
              ) : (
                <p />
              )}
            </tbody>
          </table>
        </div>

        <div className="pagination">
          <Pagination
            location="bottom"
            nextPage={this.nextPage}
            previousPage={this.previousPage}
            goToPage={this.goToPage}
            cards={this.props.cards}
            page={this.state.page}
            cardsPerPage={this.state.cardsPerPage}
          />
        </div>
      </div>
    )
  }
}

const mapState = state => {
  return {
    cards: state.cards,
    sliders: state.sliders
  }
}

const mapDispatch = dispatch => ({
  fetchAllCards: () => dispatch(fetchAllCards()),
  fetchSomeCards: filters => dispatch(fetchSomeCards(filters)),
  fetchFirstXCards: x => dispatch(fetchFirstXCards(x))
})

export default connect(mapState, mapDispatch)(CardTable)
