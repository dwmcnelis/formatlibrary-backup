/* eslint-disable no-eval */
/* eslint-disable complexity */
/* eslint-disable max-statements */

import React, { useState, useEffect, useLayoutEffect } from 'react'
import AdvButton from './AdvButton.js'
import CardRow from './CardRow.js'
import CardImage from './CardImage.js'
import PrettoSlider from './Slider.js'
import Pagination from './Pagination.js'
import { connect } from 'react-redux'
import formats from '../../static/formats.json'
import { Star } from '../../public/images/symbols'
import * as sortFunctions from '../../functions/sort'
import { Calendar, Shield, Swords } from '../../public/images/emojis'
import { fetchAllCards, fetchSomeCards, fetchFirstXCards } from '../store/cards'
import { setSliders } from '../store/sliders'
import * as artworks from '../../public/images/artworks'

const CardTable = (props) => {
  const now = new Date()
  const FY = now.getFullYear()
  const months = ["January", "February", "March", "April", "May", "June","July", "August", "September", "October", "November", "December"]
  const M = months[now.getMonth()]
  const D = now.getDate()
  const [page, setPage] = useState(1)
  const [cardsPerPage, setCardsPerPage] = useState(10)
  const [view, setView] = useState('spoilers')
  const [sortBy, setSortBy] = useState(null)
  const [format, setFormat] = useState('All Formats')
  const [logo, setLogo] = useState(artworks.BLS)
  const [event, setEvent] = useState(`May 2002 - ${M} ${FY}`)
  const [allFetched, setAllFetched] = useState(false)
  const [firstXFetched, setFirstXFetched] = useState(false)
  const [advanced, setAdvanced] = useState(false)
  const [day, setDay] = useState(null)
  const [month, setMonth] = useState(null)
  const [year, setYear] = useState(null)
  const [queryParams, setQueryParams] = useState({
    name: null,
    description: null,
    category: null,
    tcgLegal: true,
    icon: {
      continuous: false,
      counter: false,
      equip: false,
      field: false,
      normal: false,
      ritual: false,
      'quick-play': false
    },
    attribute: {
      dark: false,
      light: false,
      earth: false,
      wind: false,
      water: false,
      fire: false,
      divine: false
    },type: {
      aqua: false,
      beast: false,
      'beast-warrior': false,
      cyberse: false,
      dinosaur: false,
      'divine-beast': false,
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
      'sea serpent': false,
      spellcaster: false,
      thunder: false,
      warrior: false,
      'winged beast': false,
      wyrm: false,
      zombie: false
    },
    effect: false,
    flip: false,
    fusion: false,
    gemini: false,
    link: false,
    normal: false,
    pendulum: false,
    ritual: false,
    spirit: false,
    synchro: false,
    toon: false,
    tuner: false,
    union: false,
    xyz: false
  })

  // USE LAYOUT EFFECT
  useLayoutEffect(() => window.scrollTo(0, 0), [])
  
  // CHANGE CARDS PER PAGE
  const changeCardsPerPage = () => {
    setCardsPerPage(Number(document.getElementById('cardsPerPageSelector').value))
    setPage(1)
  }

  // SORT CARDS
  const sortCards = () => {
    setSortBy(document.getElementById('sortSelector').value)
    setPage(1)
  }

  // GO TO PAGE
  const goToPage = (num, location) => {
    setPage(num)
    if (location === 'bottom') {
      const tableTop = document.getElementById('resultsWrapper0').offsetTop - 10
      window.scrollTo(0, tableTop)
    }
  }

  // PREVIOUS PAGE
  const previousPage = (location) => {
    if (page <= 1) return
    setPage(page - 1)
    if (location === 'bottom') {
      const tableTop = document.getElementById('resultsWrapper0').offsetTop - 10
      window.scrollTo(0, tableTop)
    }
  }

  // NEXT PAGE
  const nextPage = (location) => {
    if (page >= Math.ceil(props.cards.length / cardsPerPage)) return
    setPage(page + 1)
    if (location === 'bottom') {
      const tableTop = document.getElementById('resultsWrapper0').offsetTop - 10
      window.scrollTo(0, tableTop)
    }
  }

  // SEARCH
  const search = async (hide = true) => {
    const sliders = {
      year: year || props.sliders.year,
      month: month || props.sliders.month,
      day: day || props.sliders.day,
      level: props.sliders.level || null,
      atk: props.sliders.atk || null,
      def: props.sliders.def || null
    }

    try {
      const params = { ...queryParams, ...sliders }
      const removeFalseValues = (obj) => {
        const entries = Object.entries(obj)
          .map((e) => {
            if (typeof e[1] === 'object' && !Array.isArray(e[1]) && e[1] !== null) {
              const filteredValues = removeFalseValues(e[1])
              if(filteredValues) {
                return [e[0], filteredValues]
              } else {
                return null
              }
            } else if (e[1]) {
                return e
            } else {
                return null
            }
          }).filter((e) => e !== null && e !== false && e !== undefined)

          if (entries.length) {
            return Object.fromEntries(entries)
          } else {
            return false
          }
      }

      const filters = removeFalseValues(params)
      console.log('filters', filters)
      await props.fetchSomeCards(filters)
      setPage(1)
    } catch (err) {
      console.log(err)
    }

    if (hide) setAdvanced(false)
  }

  // RESET
  const reset = () => {
    document.getElementById('format').value = ''
    document.getElementById('category').value = 'All Cards'
    document.getElementById('searchTypeSelector').value = 'name'
    props.setSliders({
      year: FY,
      month: 12,
      day: 31,
      level: [0, 12],
      atk: [0, 5000],
      def: [0, 5000]
    })

    setPage(1)
    setFormat('All Formats')
    setLogo(artworks.BLS)
    setEvent(`May 2002 - ${M} ${FY}`)
    setDay(null)
    setMonth(null)
    setYear(null)
    setAllFetched(false)
    setQueryParams({
      name: null,
      description: null,
      category: null,
      attribute: {
        dark: false,
        light: false,
        earth: false,
        wind: false,
        water: false,
        fire: false,
        divine: false
      },type: {
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
      },
      continuous: false,
      counter: false,
      effect: false,
      equip: false,
      field: false,
      flip: false,
      fusion: false,
      gemini: false,
      link: false,
      normal: false,
      pendulum: false,
      quickPlay: false,
      ritual: false,
      spirit: false,
      synchro: false,
      toon: false,
      tuner: false,
      union: false,
      xyz: false
    })
  }

  // UPDATE FORMAT
  const updateFormat = (e) => {
    const nextFormatName = e.target.value || 'All Formats'
    const nextFormat = formats[nextFormatName] || 'All Formats'
    setFormat(nextFormatName)
    setDay(nextFormat.day || D)
    setMonth(nextFormat.month || M)
    setYear(nextFormat.year || FY)
    setLogo(artworks[nextFormat.logo] || artworks.BLS)
    setEvent(nextFormat.event || `May 2002 - ${M} ${FY}`)
  }

  // APPLY FILTER
  const applyFilter = (type, id) => {
    setQueryParams(() => {
      if (type) {
        return {
          ...queryParams,
          [type]: {...queryParams[type], [id]: true}
        }
      } else {
        return {
          ...queryParams,
          [id]: true
        }
      }
    })
  }

  // REMOVE FILTER
  const removeFilter = (type, id) => {
    setQueryParams(() => {
      if (type) {
        return {
          ...queryParams,
          [type]: {...queryParams[type], [id]: false}
        }
      } else {
        return {
          ...queryParams,
          [id]: false
        }
      }
    })
  }

  // RUN QUERY
  const runQuery = () => {
    const id = document.getElementById('searchTypeSelector').value
    const otherId = id === 'description' ? 'name' : 'description'
    setQueryParams(() => {
      return {
        ...queryParams,
        [id]: document.getElementById('searchBar').value,
        [otherId]: null
      }
    })
  }

  // USE EFFECT firstXFetched
  useEffect(() => {
    if (!firstXFetched) {
      const fetchData = async () => {
        await props.fetchFirstXCards(100)
        setFirstXFetched(true)
      } 

      fetchData()
    }
  }, [])

  // USE EFFECT allFetched
  useEffect(() => {
    if (!allFetched) {
      const fetchData = async () => {
        try {
          await props.fetchAllCards()
          setAllFetched(true)
        } catch (err) {
          console.log(err)
        }
      }

      fetchData()
    }
  }, [])

  // USE EFFECT searchx
  useEffect(() => {
    search(false)
  }, [format, day, month, year, queryParams])

  const cards = props.cards
  const lastIndex = page * cardsPerPage
  const firstIndex = lastIndex - cardsPerPage
  if (cards.length) cards.sort(sortFunctions[sortBy] || undefined)
  const cardsArray = cards.length ? cards.slice(firstIndex, lastIndex) : []
  const formatKeys = Object.keys(formats)
  const advancedButtons = {
    icon: [
      ['normal', 'Normal'], 
      ['continuous', 'Contin.'], 
      ['counter', 'Counter'], 
      ['equip', 'Equip'], 
      ['field', 'Field'], 
      ['ritual', 'Ritual'], 
      ['quick-play', 'Quick-P.']
    ],
    attribute: [
      ['dark', 'DARK'], 
      ['light', 'LIGHT'], 
      ['earth', 'EARTH'], 
      ['wind', 'WIND'], 
      ['water', 'WATER'], 
      ['fire', 'FIRE'], 
      ['divine', 'DIVINE']
    ],
    type: [
      ['aqua', 'Aqua'], 
      ['beast', 'Beast'], 
      ['beast-warrior', 'Beast-W.'], 
      ['cyberse', 'Cyberse'], 
      ['dinosaur', 'Dinosaur'], 
      ['dragon', 'Dragon'], 
      ['divine-beast', 'Divine-B.'], 
      ['fairy', 'Fairy'], 
      ['fiend', 'Fiend'], 
      ['fish', 'Fish'], 
      ['insect', 'Insect'], 
      ['machine', 'Machine'], 
      ['plant', 'Plant'], 
      ['psychic', 'Psychic'], 
      ['pyro', 'Pyro'], 
      ['reptile', 'Reptile'], 
      ['rock', 'Rock'], 
      ['sea serpent', 'Sea Serp.'],
      ['spellcaster', 'Spellcaster'], 
      ['thunder', 'Thunder'], 
      ['warrior', 'Warrior'], 
      ['winged beast', 'Winged B.'],
      ['wyrm', 'Wyrm'], 
      ['zombie', 'Zombie']
    ],
    monster: [
      ['normal', 'Normal'], 
      ['effect', 'Effect'], 
      ['ritual', 'Ritual'], 
      ['pendulum', 'Pend.'], 
      ['fusion', 'Fusion'], 
      ['synchro', 'Synchro'], 
      ['xyz', 'Xyz'], 
      ['link', 'Link'], 
      ['flip', 'Flip'], 
      ['gemini', 'Gemini'], 
      ['spirit', 'Spirit'], 
      ['toon', 'Toon'], 
      ['tuner', 'Tuner'], 
      ['union', 'Union']
    ]
  }
  const advancedButtonKeys = Object.keys(advancedButtons)

  // RENDER
  return (
    <div className="body">
      <div className="format-icon-flexbox">
        <img src={logo} style={{width: '164px'}} />
        <div>
          <h1>{format}</h1>
          <h2>{event}</h2>
        </div>
        <img src={logo} style={{width: '164px'}} />
      </div>

      <br />

      <div className="searchWrapper">
        <input
          id="searchBar"
          className="filter"
          type="text"
          placeholder="🔍"
          onChange={() => runQuery()}
          onKeyDown={() => {
            if (event.keyCode === 13) search()
          }}
        />

        <div className="buttonWrapper">
          <select
            id="searchTypeSelector"
            defaultValue="name"
            className="filter"
            onChange={() => runQuery()}
          >
            <option value="name">Card Name</option>
            <option value="description">Card Text</option>
          </select>

          <select
            id="category"
            defaultValue="All Cards"
            className="filter"
            onChange={() => setQueryParams({ ...queryParams, category: document.getElementById('category').value })}
          >
            <option value="All Cards">All Cards</option>
            <option value="Monster">Monsters</option>
            <option value="Spell">Spells</option>
            <option value="Trap">Traps</option>
          </select>

          <select
            id="format"
            defaultValue="All Formats"
            className="filter"
            onChange={(e) => updateFormat(e)}
          >
            <option key="All Formats" value="">All Formats</option>
            {
              formatKeys.map((f) => <option key={f} value={f}>{f}</option>)
            }
          </select>

          <a
            className="searchButton"
            type="submit"
            onClick={() => search()}
          >
            Search
          </a>
        </div>
      </div>

      {!advanced ? (
        <div className="refinedWrapper">
          <a
            className="refinedButton"
            type="submit"
            onClick={() => setAdvanced(!advanced)}
          >
            Show Advanced Search Options
          </a>
        </div>
      ) : (
        <div className="refinedWrapper">
          <a
            className="refinedButton"
            type="submit"
            onClick={() => setAdvanced(!advanced)}
          >
            Hide Advanced Search Options
          </a>
          <br />
          {
            advancedButtonKeys.map((buttonClass) => (
              <div key={buttonClass} className="refinedInnerWrapper">
                {
                  advancedButtons[buttonClass].map((el) => (
                      <AdvButton 
                        key={el[0]} 
                        id={el[0]} 
                        display={el[1]}
                        buttonClass={buttonClass} 
                        queryParams={queryParams} 
                        removeFilter={removeFilter} 
                        applyFilter={applyFilter}
                      />
                    )
                  )
                }
              </div>
            ))
          }          
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
                defaultValue={props.sliders.level}
              />
              <PrettoSlider
                id="atk"
                type="range-slider"
                symbol={Swords}
                label="ATK"
                step={50}
                min={0}
                max={5000}
                defaultValue={props.sliders.atk}
              />
              <PrettoSlider
                id="def"
                type="range-slider"
                symbol={Shield}
                label="DEF"
                step={50}
                min={0}
                max={5000}
                defaultValue={props.sliders.def}
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
                disabled={format !== 'All Formats'}
                defaultValue={year || props.sliders.year}
              />
              <PrettoSlider
                id="month"
                type="continuous-slider"
                symbol={Calendar}
                label="Month"
                step={1}
                min={1}
                max={12}
                disabled={format !== 'All Formats'}
                defaultValue={month || props.sliders.month}
              />
              <PrettoSlider
                id="day"
                type="continuous-slider"
                symbol={Calendar}
                label="Day"
                step={1}
                min={1}
                max={31}
                disabled={format !== 'All Formats'}
                defaultValue={day || props.sliders.day}
              />
            </div>
          </div>
        </div>
      )}

      <div id="resultsWrapper0" className="resultsWrapper0">
        <div className="results" style={{width: '360px'}}>
          Results:{' '}
          {firstXFetched && allFetched
            ? cards.length
              ? `${cardsPerPage * page - cardsPerPage + 1} - ${
                  cards.length >=
                  cardsPerPage * page
                    ? cardsPerPage * page
                    : cards.length
                } of ${cards.length}`
              : '0'
            : ''}
        </div>

        <div className="buttonWrapper">
          <select
            id="viewSwitch"
            defaultValue="spoilers"
            style={{width: '130px'}}
            onChange={() => setView(document.getElementById('viewSwitch').value)}
          >
            <option value="spoilers">View Spoilers</option>
            <option value="gallery">View Gallery</option>
          </select>

          <select
            id="cardsPerPageSelector"
            defaultValue="10"
            style={{width: '195px'}}
            onChange={() => changeCardsPerPage()}
          >
            <option value="10"> Show 10 Cards / Page</option>
            <option value="25">Show 25 Cards / Page</option>
            <option value="50">Show 50 Cards / Page</option>
            <option value="100">Show 100 Cards / Page</option>
          </select>

          <select
            id="sortSelector"
            defaultValue="nameASC"
            style={{width: '190px'}}
            onChange={() => sortCards()}
          >
            <option value="nameASC">Sort Name: A ⮕ Z</option>
            <option value="nameDESC">Sort Name: Z ⮕ A</option>
            <option value="atkASC">Sort ATK: Desc. ⬇</option>
            <option value="atkDESC">Sort ATK: Asc. ⬆</option>
            <option value="defASC">Sort DEF: Desc. ⬇</option>
            <option value="defDESC">Sort DEF: Asc. ⬆</option>
            <option value="levelASC">Sort Level: Desc. ⬇</option>
            <option value="levelDESC">Sort Level: Asc. ⬆</option>
            <option value="dateASC">Sort Date: Old ⮕ New</option>
            <option value="dateDESC">Sort Date: New ⮕ Old</option>
          </select>

          <a
            className="searchButton"
            type="submit"
            onClick={() => reset()}
          >
            Reset
          </a>
        </div>
      </div>

      <div className="paginationWrapper">
        <div className="pagination">
          <Pagination
            location="top"
            nextPage={nextPage}
            previousPage={previousPage}
            goToPage={goToPage}
            length={cards.length}
            page={page}
            itemsPerPage={cardsPerPage}
          />
        </div>
      </div>

      {view === 'spoilers' ? (
        <div id="myTable">
          <table id="cards">
            <tbody>
              {cardsArray.length ? (
                cardsArray.map((card, index) => {
                  return <CardRow key={card.id} index={index} card={card} />
                })
              ) : (
                <tr />
              )}
            </tbody>
          </table>
        </div>
      ) : (
        <div id="galleryFlexBox">
          {cardsArray.length ? (
            cardsArray.map((card, index) => {
              return <
                        CardImage 
                        key={card.id} 
                        index={index} 
                        card={card} 
                        width="184px"
                        margin="4px"
                        padding="2px"
                      />
            })
          ) : (
            <div />
          )}
        </div>
      )}

      <div className="pagination">
        <Pagination
          location="bottom"
          nextPage={nextPage}
          previousPage={previousPage}
          goToPage={goToPage}
          length={cards.length}
          page={page}
          itemsPerPage={cardsPerPage}
        />
      </div>
    </div>
  )
}

const mapState = (props) => {
  return {
    cards: props.cards.cards,
    sliders: props.sliders
  }
}

const mapDispatch = dispatch => ({
  fetchAllCards: () => dispatch(fetchAllCards()),
  fetchSomeCards: filters => dispatch(fetchSomeCards(filters)),
  fetchFirstXCards: x => dispatch(fetchFirstXCards(x)),
  setSliders: sliders => dispatch(setSliders(sliders))
})

export default connect(mapState, mapDispatch)(CardTable)

