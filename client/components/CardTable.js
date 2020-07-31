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

  applySelector(selectorId) {
    this.setState(state => {
      return {
        queryParams: {
          ...state.queryParams,
          [selectorId]: document.getElementById(selectorId).value
        }
      }
    })
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

  runSearch(filterId) {
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
    try {
      const filters = {...this.state.queryParams, ...this.props.sliders}
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
            onKeyDown={() => {
              if (event.keyCode === 13) this.search()
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
                />
                <PrettoSlider
                  id="month"
                  type="continuous-slider"
                  symbol={Calendar}
                  label="Month"
                  step={1}
                  min={1}
                  max={12}
                />
                <PrettoSlider
                  id="day"
                  type="continuous-slider"
                  symbol={Calendar}
                  label="Day"
                  step={1}
                  min={1}
                  max={31}
                />
              </div>
            </div>
          </div>
        )}

        <br />

        <div id="resultsWrapper0" className="resultsWrapper0">
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
                10 Cards
              </option>
              <option value="25">25 Cards</option>
              <option value="50">50 Cards</option>
              <option value="100">100 Cards</option>
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
