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

const currentCardCount = 9720

class CardTable extends React.Component {
  constructor() {
    super()
    this.state = {
      page: 1,
      cardsPerPage: 10,
      allFetched: false,
      advanced: false,
      queryParams: {
        name: null,
        description: null,
        card: null,
        attribute: {
          dark: null,
          light: null,
          earth: null,
          wind: null,
          water: null,
          fire: null,
          divine: null
        },
        category: {
          normal: null,
          continuous: null,
          counter: null,
          equip: null,
          field: null,
          normalMonster: null,
          effect: null,
          fusion: null,
          ritualMonster: null,
          synchro: null,
          xyz: null,
          pendulum: null,
          link: null
        },
        class: {
          flip: null,
          gemini: null,
          spirit: null,
          toon: null,
          tuner: null,
          union: null
        },
        type: {
          Aqua: null,
          Beast: null,
          BeastWarrior: null,
          Cyberse: null,
          Dinosaur: null,
          DivineBeast: null,
          Dragon: null,
          Fairy: null,
          Fiend: null,
          Fish: null,
          Insect: null,
          Machine: null,
          Plant: null,
          Psychic: null,
          Pyro: null,
          Reptile: null,
          Rock: null,
          SeaSerpent: null,
          Spellcaster: null,
          Thunder: null,
          Warrior: null,
          WingedBeast: null,
          Wyrm: null,
          Zombie: null
        },
        level: {
          max: null,
          min: null
        },
        atk: {
          max: null,
          min: null
        },
        def: {
          max: null,
          min: null
        },
        year: {
          max: null,
          min: null
        },
        month: {
          max: null,
          min: null
        },
        day: {
          max: null,
          min: null
        }
      }
    }

    this.applyFilter = this.applyFilter.bind(this)
    this.search = this.search.bind(this)
    this.changeSearchType = this.changeSearchType.bind(this)
    this.changeCardsPerPage = this.changeCardsPerPage.bind(this)
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

  changeSearchType() {
    this.setState(state => {
      return {advanced: !state.advanced}
    })
  }

  goToPage(num, location) {
    this.setState({page: num})
    if (location === 'bottom') window.scrollTo(0, 0)
  }

  previousPage(location) {
    this.setState(state => {
      if (state.page <= 1) return
      return {page: state.page - 1}
    })
    if (location === 'bottom') window.scrollTo(0, 0)
  }

  nextPage(location) {
    this.setState(state => {
      if (state.page >= Math.ceil(this.props.cards.length / state.cardsPerPage))
        return
      return {page: state.page + 1}
    })
    if (location === 'bottom') window.scrollTo(0, 0)
  }

  applyFilter(filterId) {
    this.setState({[filterId]: document.getElementById(filterId).value})
  }

  runSearch(filterId) {
    const otherFilterId = filterId === 'description' ? 'name' : 'description'
    this.setState({
      [filterId]: document.getElementById('searchBar').value,
      [otherFilterId]: null
    })
  }

  componentDidMount() {
    if (!this.props.cards.length) {
      this.props.fetchFirstXCards(this.state.cardsPerPage * 10)
    }
  }

  async search() {
    console.log('this.state in search()', this.state)
    try {
      const filters = this.state
      await this.props.fetchSomeCards(filters)
      this.setState({page: 1})
    } catch (err) {
      console.log(err)
    }
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
    const lastIndex = this.state.page * this.state.cardsPerPage
    const firstIndex = lastIndex - this.state.cardsPerPage
    const cardsArray = this.props.cards.length
      ? this.props.cards.slice(firstIndex, lastIndex)
      : []

    return (
      <div>
        <NavBar />
        <br />
        <div className="searchWrapper">
          <input
            id="searchBar"
            className="filter"
            type="text"
            placeholder="🔍"
            onChange={() => {
              this.runSearch(
                document.getElementById('searchTypeSelector').value
              )
            }}
          />

          <select
            id="searchTypeSelector"
            className="filter"
            onChange={() => {
              this.runSearch(
                document.getElementById('searchTypeSelector').value
              )
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
              this.applyFilter('card')
            }}
          >
            <option selected="selected" value={null}>
              All Cards
            </option>
            <option value="Monster">Monsters</option>
            <option value="Spell">Spells</option>
            <option value="Trap">Traps</option>
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

            <a
              className="optionButton"
              id="normal"
              type="submit"
              onClick={() => {
                this.applyFilter('Normal')
              }}
            >
              Normal
            </a>

            <a
              className="optionButton"
              id="continuous"
              type="submit"
              onClick={() => {
                this.applyFilter('Continuous')
              }}
            >
              Contin.
            </a>

            <a
              className="optionButton"
              id="counter"
              type="submit"
              onClick={() => {
                this.applyFilter('Counter')
              }}
            >
              Counter
            </a>

            <a
              className="optionButton"
              id="equip"
              type="submit"
              onClick={() => {
                this.applyFilter('Equip')
              }}
            >
              Equip
            </a>

            <a
              className="optionButton"
              id="field"
              type="submit"
              onClick={() => {
                this.applyFilter('Field')
              }}
            >
              Field
            </a>

            <a
              className="optionButton"
              id="ritual"
              type="submit"
              onClick={() => {
                this.applyFilter('Ritual')
              }}
            >
              Ritual
            </a>

            <a
              className="optionButton"
              id="quick-play"
              type="submit"
              onClick={() => {
                this.applyFilter('Quick-Play')
              }}
            >
              Quick-P.
            </a>

            <br />

            <a
              className="attributeButton"
              id="dark"
              type="submit"
              onClick={() => {
                this.applyFilter('Dark')
              }}
            >
              Dark
            </a>

            <a
              className="attributeButton"
              id="light"
              type="submit"
              onClick={() => {
                this.applyFilter('Light')
              }}
            >
              Light
            </a>

            <a
              className="attributeButton"
              id="earth"
              type="submit"
              onClick={() => {
                this.applyFilter('Earth')
              }}
            >
              Earth
            </a>

            <a
              className="attributeButton"
              id="wind"
              type="submit"
              onClick={() => {
                this.applyFilter('Wind')
              }}
            >
              Wind
            </a>

            <a
              className="attributeButton"
              id="water"
              type="submit"
              onClick={() => {
                this.applyFilter('Water')
              }}
            >
              Water
            </a>

            <a
              className="attributeButton"
              id="fire"
              type="submit"
              onClick={() => {
                this.applyFilter('Fire')
              }}
            >
              Fire
            </a>

            <a
              className="attributeButton"
              id="divine"
              type="submit"
              onClick={() => {
                this.applyFilter('Divine')
              }}
            >
              Divine
            </a>

            <br />

            <a
              className="monsterButton"
              id="normalMonster"
              type="submit"
              onClick={() => {
                this.applyFilter('Normal')
              }}
            >
              Normal
            </a>

            <a
              className="monsterButton"
              id="effect"
              type="submit"
              onClick={() => {
                this.applyFilter('Effect')
              }}
            >
              Effect
            </a>

            <a
              className="monsterButton"
              id="fusion"
              type="submit"
              onClick={() => {
                this.applyFilter('Fusion')
              }}
            >
              Fusion
            </a>

            <a
              className="monsterButton"
              id="ritualMonster"
              type="submit"
              onClick={() => {
                this.applyFilter('Ritual')
              }}
            >
              Ritual
            </a>

            <a
              className="monsterButton"
              id="synchro"
              type="submit"
              onClick={() => {
                this.applyFilter('Synchro')
              }}
            >
              Synchro
            </a>

            <a
              className="monsterButton"
              id="xyz"
              type="submit"
              onClick={() => {
                this.applyFilter('Xyz')
              }}
            >
              Xyz
            </a>

            <a
              className="monsterButton"
              id="pendulum"
              type="submit"
              onClick={() => {
                this.applyFilter('Pendulum')
              }}
            >
              Pendulum
            </a>

            <a
              className="monsterButton"
              id="link"
              type="submit"
              onClick={() => {
                this.applyFilter('Link')
              }}
            >
              Link
            </a>

            <br />

            <a
              className="monsterButton"
              id="flip"
              type="submit"
              onClick={() => {
                this.applyFilter('Flip')
              }}
            >
              Flip
            </a>

            <a
              className="monsterButton"
              id="gemini"
              type="submit"
              onClick={() => {
                this.applyFilter('Gemini')
              }}
            >
              Gemini
            </a>

            <a
              className="monsterButton"
              id="spirit"
              type="submit"
              onClick={() => {
                this.applyFilter('Spirit')
              }}
            >
              Spirit
            </a>

            <a
              className="monsterButton"
              id="toon"
              type="submit"
              onClick={() => {
                this.applyFilter('Toon')
              }}
            >
              Toon
            </a>

            <a
              className="monsterButton"
              id="tuner"
              type="submit"
              onClick={() => {
                this.applyFilter('Tuner')
              }}
            >
              Tuner
            </a>

            <a
              className="monsterButton"
              id="union"
              type="submit"
              onClick={() => {
                this.applyFilter('Union')
              }}
            >
              Union
            </a>

            <br />

            <a
              className="typeButton"
              id="aqua"
              type="submit"
              onClick={() => {
                this.applyFilter('Aqua')
              }}
            >
              Aqua
            </a>

            <a
              className="typeButton"
              id="beast"
              type="submit"
              onClick={() => {
                this.applyFilter('Beast')
              }}
            >
              Beast
            </a>

            <a
              className="typeButton"
              id="beast-warrior"
              type="submit"
              onClick={() => {
                this.applyFilter('Beast-Warrior')
              }}
            >
              Beast-War.
            </a>

            <a
              className="typeButton"
              id="cyberse"
              type="submit"
              onClick={() => {
                this.applyFilter('Cyberse')
              }}
            >
              Cyberse
            </a>

            <a
              className="typeButton"
              id="dinosaur"
              type="submit"
              onClick={() => {
                this.applyFilter('Dinosaur')
              }}
            >
              Dinosaur
            </a>

            <a
              className="typeButton"
              id="divine-beast"
              type="submit"
              onClick={() => {
                this.applyFilter('Divine-Beast')
              }}
            >
              Divine-B.
            </a>

            <br />

            <a
              className="typeButton"
              id="dragon"
              type="submit"
              onClick={() => {
                this.applyFilter('Dragon')
              }}
            >
              Dragon
            </a>

            <a
              className="typeButton"
              id="fairy"
              type="submit"
              onClick={() => {
                this.applyFilter('Fairy')
              }}
            >
              Fairy
            </a>

            <a
              className="typeButton"
              id="fiend"
              type="submit"
              onClick={() => {
                this.applyFilter('Fiend')
              }}
            >
              Fiend
            </a>

            <a
              className="typeButton"
              id="fish"
              type="submit"
              onClick={() => {
                this.applyFilter('Fish')
              }}
            >
              Fish
            </a>

            <a
              className="typeButton"
              id="insect"
              type="submit"
              onClick={() => {
                this.applyFilter('Insect')
              }}
            >
              Insect
            </a>

            <a
              className="typeButton"
              id="machine"
              type="submit"
              onClick={() => {
                this.applyFilter('Machine')
              }}
            >
              Machine
            </a>

            <br />

            <a
              className="typeButton"
              id="plant"
              type="submit"
              onClick={() => {
                this.applyFilter('Plant')
              }}
            >
              Plant
            </a>

            <a
              className="typeButton"
              id="psychic"
              type="submit"
              onClick={() => {
                this.applyFilter('Psychic')
              }}
            >
              Psychic
            </a>

            <a
              className="typeButton"
              id="pyro"
              type="submit"
              onClick={() => {
                this.applyFilter('Pyro')
              }}
            >
              Pyro
            </a>

            <a
              className="typeButton"
              id="reptile"
              type="submit"
              onClick={() => {
                this.applyFilter('Reptile')
              }}
            >
              Reptile
            </a>

            <a
              className="typeButton"
              id="rock"
              type="submit"
              onClick={() => {
                this.applyFilter('Rock')
              }}
            >
              Rock
            </a>

            <a
              className="typeButton"
              id="sea-serpent"
              type="submit"
              onClick={() => {
                this.applyFilter('Sea Serpent')
              }}
            >
              Sea Serp.
            </a>

            <br />

            <a
              className="typeButton"
              id="spellcaster"
              type="submit"
              onClick={() => {
                this.applyFilter('Spellcaster')
              }}
            >
              Spellcaster
            </a>

            <a
              className="typeButton"
              id="thunder"
              type="submit"
              onClick={() => {
                this.applyFilter('Thunder')
              }}
            >
              Thunder
            </a>

            <a
              className="typeButton"
              id="warrior"
              type="submit"
              onClick={() => {
                this.applyFilter('Warrior')
              }}
            >
              Warrior
            </a>

            <a
              className="typeButton"
              id="winged-beast"
              type="submit"
              onClick={() => {
                this.applyFilter('Winged Beast')
              }}
            >
              Winged B.
            </a>

            <a
              className="typeButton"
              id="wyrm"
              type="submit"
              onClick={() => {
                this.applyFilter('Wyrm')
              }}
            >
              Wyrm
            </a>

            <a
              className="typeButton"
              id="zombie"
              type="submit"
              onClick={() => {
                this.applyFilter('Zombie')
              }}
            >
              Zombie
            </a>

            <br />
            <br />

            <div className="sliderWrapper0">
              <div className="sliderWrapper1">
                <PrettoSlider
                  type="range-slider"
                  symbol={Star}
                  label="Level"
                  step={1}
                  min={1}
                  max={12}
                />
                <PrettoSlider
                  type="range-slider"
                  symbol={Swords}
                  label="ATK"
                  step={50}
                  min={0}
                  max={5000}
                />
                <PrettoSlider
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
                  type="continuous-slider"
                  symbol={Calendar}
                  label="Year"
                  step={1}
                  min={2002}
                  max={2020}
                />
                <PrettoSlider
                  type="continuous-slider"
                  symbol={Calendar}
                  label="Month"
                  step={1}
                  min={1}
                  max={12}
                />
                <PrettoSlider
                  type="continuous-slider"
                  symbol={Calendar}
                  label="Date"
                  step={1}
                  min={1}
                  max={31}
                />
              </div>
            </div>
          </div>
        )}

        <br />

        <div className="resultsWrapper0">
          <div id="results" className="results">
            Results:{' '}
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

          <div id="results" className="results">
            {'Display: '}
            <select
              id="cardsPerPageSelector"
              onChange={() => {
                this.changeCardsPerPage()
              }}
            >
              <option selected="selected" value="10">
                10 cards
              </option>
              <option value="25">25 cards</option>
              <option value="50">50 cards</option>
              <option value="100">100 cards</option>
            </select>
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
    cards: state.cards
  }
}

const mapDispatch = dispatch => ({
  fetchAllCards: () => dispatch(fetchAllCards()),
  fetchSomeCards: filters => dispatch(fetchSomeCards(filters)),
  fetchFirstXCards: x => dispatch(fetchFirstXCards(x))
})

export default connect(mapState, mapDispatch)(CardTable)
