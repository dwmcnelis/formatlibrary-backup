/* eslint-disable complexity */
/* eslint-disable max-statements */

import React, { useState, useEffect, useLayoutEffect } from 'react'
import EventRow from './EventRow.js'
// import EventImage from './EventImage.js'
import Pagination from './Pagination.js'
import * as sortFunctions from '../../functions/sort'
import formats from '../../static/formats.json'
import axios from 'axios'

const EventTable = (props) => {
  const [page, setPage] = useState(1)
  const [events, setEvents] = useState([])
  const [filteredEvents, setFilteredEvents] = useState([])
  const [eventsPerPage, setEventsPerPage] = useState(10)
  const [view, setView] = useState('table')
  const [sortBy, setSortBy] = useState(null)
  const [format, setFormat] = useState(null)
  const [allFetched, setAllFetched] = useState(false)
  const [firstXFetched, setFirstXFetched] = useState(false)

  console.log('format', format)
  
  const [queryParams, setQueryParams] = useState({
    name: null,
    winner: null
  })

  // USE LAYOUT EFFECT
  useLayoutEffect(() => window.scrollTo(0, 0), [])

  // CHANGE EVENTS PER PAGE
  const changeEventsPerPage = () => {
    setEventsPerPage(Number(document.getElementById('eventsPerPageSelector').value))
    setPage(1)
  }

  // SORT EVENTS
  const sortEvents = () => {
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
    if (page >= Math.ceil(props.events.length / eventsPerPage)) return
    setPage(page + 1)
    if (location === 'bottom') {
      const tableTop = document.getElementById('resultsWrapper0').offsetTop - 10
      window.scrollTo(0, tableTop)
    }
  }

  // SEARCH
  const search = () => {
    let data = [...events]
    const params = Object.keys(queryParams) 

    for (let i = 0; i < params.length; i++) {
      const param = params[i]
      const query = queryParams[param]

      if (query) {
        if (param === 'name') {
          data = data.filter(
            (d) => d.name && d.name.toLowerCase().includes(query.toLowerCase()) || 
            d.abbreviation && d.abbreviation.toLowerCase().includes(query.toLowerCase())
          )
        } else {
          data = data.filter((d) => d[param] && d[param].toLowerCase().includes(query.toLowerCase()))
        }
      }

      if (format) {
        data = data.filter((d) => d.formatName.toLowerCase().includes(format.toLowerCase()))
      }
    }
    
    setFilteredEvents(data)
    setPage(1)
  }

  // RESET
  const reset = () => {
    document.getElementById('format').value = null
    document.getElementById('searchBar').value = null
    setPage(1)
    setFormat(null)
    setFilteredEvents(events)
    setQueryParams({
      name: null,
      winner: null
    })
  }

  // RUN QUERY
  const runQuery = () => {
    const id = document.getElementById('searchTypeSelector').value
    const otherIds = id === 'name' ? ['winner'] : ['name']

    setQueryParams(() => {
      return {
        ...queryParams,
        [id]: document.getElementById('searchBar').value,
        [otherIds[0]]: null
      }
    })
  }

  // USE EFFECT FETCH FIRST X
  useEffect(() => {
    if (!firstXFetched && !allFetched) {
      const fetchData = async () => {
        const {data} = await axios.get(`/api/events/first/10`)
        setEvents(data)
        setFilteredEvents(data)
        setFirstXFetched(true)
      } 

      fetchData()
    }
  }, [])

  // USE EFFECT FETCH ALL
  useEffect(() => {
    if (firstXFetched && !allFetched) {
      const fetchData = async () => {
        const {data} = await axios.get(`/api/events/all`)
        setEvents(data)
        setFilteredEvents(data)
        setAllFetched(true)
      } 

      fetchData()
    }
  }, [firstXFetched])

  // USE EFFECT SEARCH
  useEffect(() => {
    search(false)
  }, [format, queryParams])

  const lastIndex = page * eventsPerPage
  const firstIndex = lastIndex - eventsPerPage
  if (filteredEvents.length) filteredEvents.sort(sortFunctions[sortBy] || undefined)
  const formatKeys = Object.keys(formats)

  // RENDER
  return (
    <div className="body">
      <div className="event-database-flexbox">
        <img style={{ height:'80px'}} src={'/images/emojis/event.png'}/>
        <h1>Event Database</h1>
        <img style={{ height:'80px'}} src={'/images/emojis/event.png'}/>
      </div>
      
      <br />

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

        <div className="buttonWrapper">
          <select
            id="searchTypeSelector"
            defaultValue="name"
            className="filter"
            onChange={() => runQuery()}
          >
            <option value="name">Event Name</option>
            <option value="winner">Winning Player</option>
          </select>

          <select
            id="community"
            defaultValue="All Communities"
            className="filter"
            onChange={(e) => setQueryParams({ ...queryParams, community: e.target.value })}
          >
            <option value="All Communities">All Communities</option>
            <option value="Format Library">Format Library</option>
            <option value="GoatFormat.com">GoatFormat.com</option>
            <option value="EdisonFormat.com">EdisonFormat.com</option>
          </select>

          <select
            id="format"
            defaultValue={null}
            className="filter"
            onChange={(e) => setFormat(e.target.value)}
          >
            <option key={'All Formats'} value={''}>All Formats</option>
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

      <div id="resultsWrapper0" className="resultsWrapper0">
        <div className="results" style={{width: '360px'}}>
          Results:{' '}
          {firstXFetched && allFetched
            ? filteredEvents.length
              ? `${eventsPerPage * page - eventsPerPage + 1} - ${
                  filteredEvents.length >=
                  eventsPerPage * page
                    ? eventsPerPage * page
                    : filteredEvents.length
                } of ${filteredEvents.length}`
              : '0'
            : ''}
        </div>

        <div className="buttonWrapper">
          {/* <select
            id="viewSwitch"
            defaultValue="table"
            style={{width: '130px'}}
            onChange={() => setView(document.getElementById('viewSwitch').value)}
          >
            <option value="table">View Table</option>
            <option value="gallery">View Gallery</option>
          </select> */}

          <select
            id="eventsPerPageSelector"
            defaultValue="10"
            style={{width: '195px'}}
            onChange={() => changeEventsPerPage()}
          >
            <option value="10">Show 10 Events / Page</option>
            <option value="25">Show 25 Events / Page</option>
            <option value="50">Show 50 Events / Page</option>
            <option value="100">Show 100 Events / Page</option>
          </select>

          <select
            id="sortSelector"
            defaultValue="startDateDESC"
            style={{width: '230px'}}
            onChange={() => sortEvents()}
          >
            <option value="startDateDESC">Sort Date: New ⮕ Old</option>
            <option value="startDateASC">Sort Date: Old ⮕ New</option>
            <option value="nameASC">Sort Event: A ⮕ Z</option>
            <option value="nameDESC">Sort Event: Z ⮕ A</option>
            <option value="sizeASC">Sort Size: Large ⮕ Small </option>
            <option value="sizeDESC">Sort Size: Small ⮕ Large </option>
            <option value="formatASC">Sort Format: New ⮕ Old</option>
            <option value="formatDESC">Sort Format: Old ⮕ New</option>
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
            length={events.length}
            page={page}
            itemsPerPage={eventsPerPage}
          />
        </div>
      </div>

      {view === 'table' ? (
        <div id="event-table">
          <table id="events">
            <thead>
              <tr>
                <th>Format</th>
                <th>Event Name</th>
                <th>Winning Player</th>
                <th>Community</th>
                <th>Size</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {filteredEvents.length ? (
                filteredEvents.slice(firstIndex, lastIndex).map((event, index) => {
                  return <EventRow key={event.id} index={index} event={event} />
                })
              ) : (
                <tr />
              )}
            </tbody>
          </table>
        </div>
      ) : (
        <div id="eventGalleryFlexBox">
          {/* {filteredEvents.length ? (
            filiteredEvents.slice(firstIndex, lastIndex).map((event, index) => {
              return <
                        EventImage 
                        key={event.id} 
                        index={index} 
                        event={event}
                        width="360px"
                        margin="10px 5px"
                        padding="5px"
                      />
            })
          ) : (
            <div />
          )} */}
        </div>
      )}

      <div className="pagination">
        <Pagination
          location="bottom"
          nextPage={nextPage}
          previousPage={previousPage}
          goToPage={goToPage}
          length={events.length}
          page={page}
          itemsPerPage={eventsPerPage}
        />
      </div>
    </div>
  )
}

export default EventTable

