/* eslint-disable complexity */
/* eslint-disable max-statements */

import React, { useState, useEffect, useLayoutEffect } from 'react'
import AdvButton from './AdvButton.js'
import CardRow from './CardRow.js'
import CardImage from './CardImage.js'
import MobileCardRow from './MobileCardRow.js'
import PrettoSlider from './Slider.js'
import Pagination from './Pagination.js'
import { Star } from '../../public/images/symbols'
import * as sortFunctions from '../../functions/sort'
import { Calendar, Shield, Swords } from '../../public/images/emojis'
import axios from 'axios'
import { capitalize } from '../../functions/utility'
import { useMediaQuery } from 'react-responsive'


const CardTable = (props) => {
  const isTabletOrMobile = useMediaQuery({ query: '(max-width: 860px)' })
  const now = new Date()
  const year = now.getFullYear()
  const formatName = props.location && props.location.search ? props.location.search.slice(8) : null

  const [page, setPage] = useState(1)
  const [cards, setCards] = useState([])
  const [filteredCards, setFilteredCards] = useState([])
  const [cardsPerPage, setCardsPerPage] = useState(10)
  const [view, setView] = useState('spoilers')
  const [sortBy, setSortBy] = useState(null)
  const [formats, setFormats] = useState([])
  const [format, setFormat] = useState({})
  const [banlist, setBanlist] = useState({})
  const [boosters, setBoosters] = useState([])
  const [booster, setBooster] = useState(null)
  const [firstXFetched, setFirstXFetched] = useState(false)
  const [allFetched, setAllFetched] = useState(false)
  const [advanced, setAdvanced] = useState(false)
  const [cutoff, setCutoff] = useState(`${year}-12-31`)

  const [sliders, setSliders] = useState({
    year: year,
    month: 12,
    day: 31,
    level: [1, 12],
    atk: [0, 5000],
    def: [0, 5000]
  })

  const [queryParams, setQueryParams] = useState({
    name: null,
    description: null,
    category: null
  })

  const [iconParams, setIconParams] = useState({
    continuous: false,
    counter: false,
    equip: false,
    field: false,
    normal: false,
    ritual: false,
    'quick-play': false
  })

  const [attributeParams, setAttributeParams] = useState({
    dark: false,
    light: false,
    earth: false,
    wind: false,
    water: false,
    fire: false,
    divine: false
  })

  const [typeParams, setTypeParams] = useState({
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
  })

  const [groupParams, setGroupParams] = useState({
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
  const changeCardsPerPage = (e) => {
    setCardsPerPage(Number(e.target.value))
    setPage(1)
  }

  // SORT CARDS
  const sortCards = (e) => {
    setSortBy(e.target.value)
    setPage(1)
  }

  // GO TO PAGE
  const goToPage = (num, location) => {
    setPage(num)
    if (location === 'bottom') window.scrollTo(0, document.getElementById('resultsWrapper0').offsetTop - 10)
  }

  // PREVIOUS PAGE
  const previousPage = (location) => {
    if (page <= 1) return
    setPage(page - 1)
    if (location === 'bottom') window.scrollTo(0, document.getElementById('resultsWrapper0').offsetTop - 10)
  }

  // NEXT PAGE
  const nextPage = (location) => {
    if (page >= Math.ceil(filteredCards.length / cardsPerPage)) return
    setPage(page + 1)
    if (location === 'bottom') window.scrollTo(0, document.getElementById('resultsWrapper0').offsetTop - 10)
  }

  // SEARCH
  const search = () => {
    let data = [...cards]
    
    Object.entries(queryParams).filter((e) => !!e[1]).forEach((e) => {
      data = data.filter((d) => d[e[0]] && d[e[0]].toLowerCase().includes(e[1].toLowerCase()))
    })

    Object.entries(groupParams).filter((e) => !!e[1]).forEach((e) => {
      if (e[0] === 'normal') {
        data = data.filter((d) => d.color === 'yellow')
      } else if (e[0] === 'effect') {
        data = data.filter((d) => d.color === 'orange')
      } else {
        data = data.filter((d) => !!d[e[0]])
      }
    })

    const icons = Object.entries(iconParams).filter((e) => !!e[1]).map((e) => e[0])
    if (icons.length) data = data.filter((d) => d.icon && icons.includes(d.icon.toLowerCase()))

    const attributes = Object.entries(attributeParams).filter((e) => !!e[1]).map((e) => e[0])
    if (attributes.length) data = data.filter((d) => d.attribute && attributes.includes(d.attribute.toLowerCase()))

    const types = Object.entries(typeParams).filter((e) => !!e[1]).map((e) => e[0])
    if (types.length) data = data.filter((d) => d.type && types.includes(d.type.toLowerCase()))

    if (sliders.level[0] !== 1 || sliders.level[1] !== 12) data = data.filter((d) => d.level === '?' || (d.rating >= sliders.level[0] && d.rating <= sliders.level[1]) || (d.level >= sliders.level[0] && d.level <= sliders.level[1]))
    if (sliders.atk[0] !== 0 || sliders.atk[1] !== 5000) data = data.filter((d) => d.atk === '?' || (d.atk >= sliders.atk[0] && d.atk <= sliders.atk[1]))
    if (sliders.def[0] !== 0 || sliders.def[1] !== 5000) data = data.filter((d) => d.link || d.def === '?' || (d.def >= sliders.def[0] && d.def <= sliders.def[1]))
    data = data.filter((d) => d.tcgDate <= cutoff)

    if (booster && booster.length) data = data.filter((d) => {
      const prints = d.prints
      for (let i = 0; i < prints.length; i++) {
        const print = prints[i]
        if (print.cardCode.startsWith(booster)) return d
      }
    })

    setFilteredCards(data)
    setPage(1)
  }

  // RESET
  const reset = () => {
    const formatSelector = document.getElementById('format')
    if (formatSelector) formatSelector.value = ''
    document.getElementById('category').value = ''
    document.getElementById('searchTypeSelector').value = 'name'

    setSliders({
      year: year,
      month: 12,
      day: 31,
      level: [1, 12],
      atk: [0, 5000],
      def: [0, 5000]
    })
    
    setPage(1)
    if (!formatName) {
      setFormat({})
      document.getElementById('format').value = ""
    }
    setBooster(null)
    document.getElementById('booster').value = ""
    setSortBy(null)
    setFilteredCards([...cards])
    
    setQueryParams({
      name: null,
      description: null,
      category: null
    })
  
    setIconParams({
      continuous: false,
      counter: false,
      equip: false,
      field: false,
      normal: false,
      ritual: false,
      'quick-play': false
    })
  
    setAttributeParams({
      dark: false,
      light: false,
      earth: false,
      wind: false,
      water: false,
      fire: false,
      divine: false
    })
  
    setTypeParams({
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
    })
  
    setGroupParams({
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
  }

  // UPDATE FORMAT
  const updateFormat = async (e) => {
    if (e.target.value.length) {
      const {data} = await axios.get(`/api/formats/${e.target.value}`) 
      setFormat(data.format)
    } else {
      setFormat({})
    }
  }

  // APPLY FILTER
  const applyFilter = (buttonClass, id) => {
    if (buttonClass === 'icon') {
      setIconParams({ ...iconParams, [id]: true })
    } else if (buttonClass === 'attribute') {
      setAttributeParams({ ...attributeParams, [id]: true })
    } else if (buttonClass === 'type') {
      setTypeParams({ ...typeParams, [id]: true })
    } else if (buttonClass === 'group') {
      setGroupParams({ ...groupParams, [id]: true })
    }
  }

  // REMOVE FILTER
  const removeFilter = (buttonClass, id) => {
    if (buttonClass === 'icon') {
      setIconParams({ ...iconParams, [id]: false })
    } else if (buttonClass === 'attribute') {
      setAttributeParams({ ...attributeParams, [id]: false })
    } else if (buttonClass === 'type') {
      setTypeParams({ ...typeParams, [id]: false })
    } else if (buttonClass === 'group') {
      setGroupParams({ ...groupParams, [id]: false })
    }
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

  // USE EFFECT FETCH FIRST X
  useEffect(() => {
    if (!firstXFetched && !allFetched) {
      if (formatName) updateFormat({target: { value: formatName } })

      const fetchData = async () => {
        const {data} = await axios.get(`/api/cards/first/100`, {
          headers: {
            format: formatName
          }
        })

        setCards(data)
        setFilteredCards(data)
        setFirstXFetched(true)
      }

      const fetchData2 = async () => {
        const {data} = await axios.get(`/api/formats`)
        setFormats(data)
      }

      const fetchData3 = async () => {
        const {data} = await axios.get(`/api/sets/boosters`)
        setBoosters(data)
      }

      fetchData()
      fetchData2()
      fetchData3()
    }
  }, [])

  // USE EFFECT FETCH ALL
  useEffect(() => {
    if (firstXFetched && !allFetched) {
      const fetchData = async () => {
          const {data} = await axios.get(`/api/cards/all`, {
            headers: {
              format: formatName
            }
          })
          setCards(data)
          setFilteredCards([...data])
          setAllFetched(true)
      } 

      fetchData()
    }
  }, [firstXFetched])

  // USE EFFECT IF FORMAT CHANGES
  useEffect(() => {
    const year = format.date ? parseInt(format.date.slice(0, 4)) : year || 2022
    const month = format.date ? parseInt(format.date.slice(6, 7)) : 12
    const day = format.date ? parseInt(format.date.slice(-2)) : 31
    setCutoff(format.date || `${year}-12-31`)
    setSliders({ ...sliders, year, month, day })

    const fetchData = async () => {
      try {
        const {data} = await axios.get(`/api/banlists/simple/${format.banlist}`)
        setBanlist(data)
      } catch (err) {
        console.log(err)
      }
    }

    fetchData()
  }, [format])

  // USE EFFECT IF DATE SLIDERS CHANGE
  useEffect(() => {
    if (format && format.id) return
    const month = sliders.month >= 10 ? sliders.month : `0${sliders.month}`
    const day = sliders.day >= 10 ? sliders.day : `0${sliders.day}`
    setCutoff(`${sliders.year}-${month}-${day}`)
  }, [sliders])

  // USE EFFECT IF RELEVANT SEARCH PARAM STATES CHANGE
  useEffect(() => {
    search()
  }, [format, booster, cutoff, sliders, queryParams, groupParams, iconParams, attributeParams, typeParams])

  const lastIndex = page * cardsPerPage
  const firstIndex = lastIndex - cardsPerPage
  if (filteredCards.length) filteredCards.sort(sortFunctions[sortBy])

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
    group: [
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
  if (!firstXFetched) return <div></div>

  // RENDER
  return (
    <div className="body">
      <div className="card-database-flexbox">
        <img src={`/images/artworks/${format.icon ? `${format.icon}.jpg` : 'bls.jpg'}`} className="format-icon-medium desktop-only" />
        <div>
          <h1>{format.name} Card Database</h1>
          <h2>{format.event || 'May 2002 - Present'}</h2>
        </div>
        <img src={`/images/artworks/${format.icon ? `${format.icon}.jpg` : 'bls.jpg'}`} className="format-icon-medium" />
      </div>
      {
        isTabletOrMobile ? (
            <div className="searchWrapper">
                <div className="query-box">
                    <input
                        id="searchBar"
                        className="filter"
                        type="text"
                        placeholder="🔍"
                        onChange={() => runQuery()}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') search()
                        }}
                    />

                    <select
                        id="searchTypeSelector"
                        defaultValue="name"
                        className="filter"
                        onChange={() => runQuery()}
                        >
                        <option value="name">Card Name</option>
                        <option value="description">Card Text</option>
                    </select>
                </div>
                <div className="query-box">
                    <select
                        id="category"
                        defaultValue=""
                        className="filter"
                        onChange={() => setQueryParams({ ...queryParams, category: document.getElementById('category').value })}
                    >
                        <option value="">All Cards</option>
                        <option value="Monster">Monsters</option>
                        <option value="Spell">Spells</option>
                        <option value="Trap">Traps</option>
                    </select>

                    {
                        formatName ? '' : (
                        <select
                        id="format"
                        defaultValue=""
                        className="filter"
                        onChange={(e) => updateFormat(e)}
                        >
                        <option key="All Formats" value="">All Formats</option>
                        {
                            formats.map((f) => <option key={f.name} value={f.name}>{capitalize(f.name, true)}</option>)
                        }
                        </select>
                        )
                    }

                    <select
                        id="booster"
                        defaultValue=""
                        className="filter"
                        onChange={(e) => setBooster(e.target.value)}
                        >
                        <option key="All Sets" value="">All Sets</option>
                        {
                        boosters.map((b) => <option key={b.id} value={b.setCode}>{b.setCode}</option>)
                        }
                    </select>

                    <a
                        className="searchButton desktop-only"
                        type="submit"
                        onClick={() => {
                            search()
                            if (advanced) setAdvanced(false)
                        }
                        }
                        
                    >
                        Search
                    </a>
                </div>
            </div>
            ) : (
                <div className="searchWrapper">
                    <input
                        id="searchBar"
                        className="filter"
                        type="text"
                        placeholder="🔍"
                        onChange={() => runQuery()}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') search()
                        }}
                    />

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
                        defaultValue=""
                        className="filter"
                        onChange={() => setQueryParams({ ...queryParams, category: document.getElementById('category').value })}
                    >
                        <option value="">All Cards</option>
                        <option value="Monster">Monsters</option>
                        <option value="Spell">Spells</option>
                        <option value="Trap">Traps</option>
                    </select>

                    {
                        formatName ? '' : (
                        <select
                        id="format"
                        defaultValue=""
                        className="filter"
                        onChange={(e) => updateFormat(e)}
                        >
                        <option key="All Formats" value="">All Formats</option>
                        {
                            formats.map((f) => <option key={f.name} value={f.name}>{capitalize(f.name, true)}</option>)
                        }
                        </select>
                        )
                    }

                    <select
                        id="booster"
                        defaultValue=""
                        className="filter"
                        onChange={(e) => setBooster(e.target.value)}
                        >
                        <option key="All Sets" value="">All Sets</option>
                        {
                        boosters.map((b) => <option key={b.id} value={b.setCode}>{b.setCode}</option>)
                        }
                    </select>

                    <a
                        className="searchButton desktop-only"
                        type="submit"
                        onClick={() => {
                            search()
                            if (advanced) setAdvanced(false)
                        }
                        }
                        
                    >
                        Search
                    </a>
                </div>
            )
        }

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
                  
                  advancedButtons[buttonClass].map((el) => {
                    const params = buttonClass === 'icon' ? iconParams : 
                      buttonClass === 'attribute' ? attributeParams : 
                      buttonClass === 'type' ? typeParams : 
                      groupParams

                    return (
                      <AdvButton 
                        key={el[0]} 
                        id={el[0]} 
                        display={el[1]}
                        buttonClass={buttonClass} 
                        clicked={params[el[0]]}
                        removeFilter={removeFilter} 
                        applyFilter={applyFilter}
                      />
                    )}
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
                sliders = {sliders}
                setSliders = {setSliders}
                defaultValue = {sliders.level}
              />
              <PrettoSlider
                id="atk"
                type="range-slider"
                symbol={Swords}
                label="ATK"
                step={50}
                min={0}
                max={5000}
                sliders = {sliders}
                setSliders = {setSliders}
                defaultValue = {sliders.atk}
              />
              <PrettoSlider
                id="def"
                type="range-slider"
                symbol={Shield}
                label="DEF"
                step={50}
                min={0}
                max={5000}
                sliders = {sliders}
                setSliders = {setSliders}
                defaultValue = {sliders.def}
              />
            </div>

            <div className="sliderWrapper1 desktop-only">
              <PrettoSlider
                id="year"
                type="continuous-slider"
                symbol={Calendar}
                label="Year"
                step={1}
                min={2002}
                max={2022}
                disabled={!!format.id}
                sliders = {sliders}
                setSliders = {setSliders}
                defaultValue = {sliders.year}
              />
              <PrettoSlider
                id="month"
                type="continuous-slider"
                symbol={Calendar}
                label="Month"
                step={1}
                min={1}
                max={12}
                disabled={!!format.id}
                sliders = {sliders}
                setSliders = {setSliders}
                defaultValue = {sliders.month}
              />
              <PrettoSlider
                id="day"
                type="continuous-slider"
                symbol={Calendar}
                label="Day"
                step={1}
                min={1}
                max={31}
                disabled={!!format.id}
                sliders = {sliders}
                setSliders = {setSliders}
                defaultValue = {sliders.day}
              />
            </div>
          </div>
        </div>
      )}

      <div id="resultsWrapper0" className="resultsWrapper0">
        <div className="results desktop-only" style={{width: '360px'}}>
          Results:{' '}
          {firstXFetched && allFetched
            ? filteredCards.length
              ? `${cardsPerPage * page - cardsPerPage + 1} - ${
                filteredCards.length >=
                  cardsPerPage * page
                    ? cardsPerPage * page
                    : filteredCards.length
                } of ${filteredCards.length}`
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
            className="desktop-only"
            style={{width: '195px'}}
            onChange={(e) => changeCardsPerPage(e)}
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
            onChange={(e) => sortCards(e)}
          >
            <option value="nameASC">Sort Name: A ⮕ Z</option>
            <option value="nameDESC">Sort Name: Z ⮕ A</option>
            <option value="dateASC">Sort Date: Old ⮕ New</option>
            <option value="dateDESC">Sort Date: New ⮕ Old</option>
            <option value="atkASC">Sort ATK: Desc. ⬇</option>
            <option value="atkDESC">Sort ATK: Asc. ⬆</option>
            <option value="defASC">Sort DEF: Desc. ⬇</option>
            <option value="defDESC">Sort DEF: Asc. ⬆</option>
            <option value="levelASC">Sort Level: Desc. ⬇</option>
            <option value="levelDESC">Sort Level: Asc. ⬆</option>
          </select>

          <a
            className="searchButton desktop-only"
            type="submit"
            onClick={() => reset()}
          >
            Reset
          </a>
        </div>
      </div>

      <div className="paginationWrapper">
        <div className="pagination desktop-only">
          <Pagination
            location="top"
            nextPage={nextPage}
            previousPage={previousPage}
            goToPage={goToPage}
            length={filteredCards.length}
            page={page}
            itemsPerPage={cardsPerPage}
          />
        </div>
      </div>

      {view === 'spoilers' ? (
        <div id="card-table">
          <table id="cards">
            <tbody>
              {filteredCards.length ? (
                filteredCards.slice(firstIndex, lastIndex).map((card, index) => {
                    if (isTabletOrMobile) {
                        return <MobileCardRow key={card.id} index={index} card={card} status={banlist[card.id.toString()]}/>
                    } else {
                        return <CardRow key={card.id} index={index} card={card} status={banlist[card.id.toString()]}/>
                    }
                })
              ) : (
                <tr />
              )}
            </tbody>
          </table>
        </div>
      ) : (
        <div id="galleryFlexBox">
          {filteredCards.length ? (
            filteredCards.slice(firstIndex, lastIndex).map((card) => {
              return <
                        CardImage 
                        key={card.id} 
                        card={card} 
                        width="184px"
                        margin="4px"
                        padding="2px"
                        status={banlist[card.id]}
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
          length={filteredCards.length}
          page={page}
          itemsPerPage={cardsPerPage}
        />
      </div>
    </div>
  )
}

export default CardTable