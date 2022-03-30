/* eslint-disable max-statements */
/* eslint-disable no-eval */
/* eslint-disable complexity */
/* eslint-disable max-statements */

import React, { useState, useEffect, useLayoutEffect } from 'react'
import EventRow from './EventRow.js'
import Pagination from './Pagination.js'
import * as sortFunctions from '../../functions/sort'
import formats from '../../static/formats.json'
import axios from 'axios'

const EventTable = (props) => {
  const [page, setPage] = useState(1)
  const [events, setEvents] = useState([])
  const [eventsPerPage, setEventsPerPage] = useState(12)
  const [view, setView] = useState('table')
  const [sortBy, setSortBy] = useState(null)
  const [format, setFormat] = useState(null)
  const [allFetched, setAllFetched] = useState(false)
  const [firstXFetched, setFirstXFetched] = useState(false)
  const [advanced, setAdvanced] = useState(false)
  const [day, setDay] = useState(null)
  const [month, setMonth] = useState(null)
  const [year, setYear] = useState(null)
  const [logo, setLogo] = useState(null)

  const [queryParams, setQueryParams] = useState({
    eventType: null,
    builder: null,
    event: null,
    eventCategory: null
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
  const search = async (hide = true) => {
    try {
      const params = {
        ...queryParams,
        format
      }

      const { data } = await axios.get(`/api/events/some`, { params: params })
      setEvents(data)
      setPage(1)
    } catch (err) {
      console.log(err)
    }

    if (hide) setAdvanced(false)
  }

  // RESET
  const reset = () => {
    document.getElementById('format').value = ''
    document.getElementById('searchBar').value = null
    setPage(1)
    setFormat(null)
    setAllFetched(false)
    setQueryParams({
      name: null
    })
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
    const otherIds = id === 'eventType' ? ['builder', 'event'] : 
        id === 'builder' ? ['eventType', 'event'] :
        ['eventType', 'builder']

    setQueryParams(() => {
      return {
        ...queryParams,
        [id]: document.getElementById('searchBar').value,
        [otherIds[0]]: null,
        [otherIds[1]]: null
      }
    })
  }

  // USE EFFECT firstXFetched
  useEffect(() => {
    if (!firstXFetched) {
      const fetchData = async () => {
        const {data} = await axios.get(`/api/events/first/12`)
        setEvents(data)
        setFirstXFetched(true)
      } 

      fetchData()
    }
  }, [])

  // USE EFFECT allFetched
  useEffect(() => {
    if (!allFetched) {
      const fetchData = async () => {
        const {data} = await axios.get(`/api/events/all`)
        setEvents(data)
        setAllFetched(true)
      } 

      fetchData()
    }
  }, [])

  // USE EFFECT search
  useEffect(() => {
    search(false)
  }, [format, day, month, year, queryParams])

  const lastIndex = page * eventsPerPage
  const firstIndex = lastIndex - eventsPerPage
  if (events.length) events.sort(sortFunctions[sortBy] || undefined)
  const eventsArray = events.length ? events.slice(firstIndex, lastIndex) : []
  const formatKeys = Object.keys(formats)

  // RENDER
  return (
    <div className="body">
      <h1>Event Database</h1>
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
            <option value="eventType">Event Type</option>
            <option value="builder">Builder</option>
            <option value="event">Event</option>
          </select>

          <select
            id="category"
            defaultValue="All Categories"
            className="filter"
            onChange={() => setQueryParams({ ...queryParams, category: document.getElementById('category').value })}
          >
            <option value="All Categories">All Categories</option>
            <option value="Aggro">Aggro</option>
            <option value="Combo">Combo</option>
            <option value="Control">Control</option>
            <option value="Lockdown">Lockdown</option>
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
            ? events.length
              ? `${eventsPerPage * page - eventsPerPage + 1} - ${
                  events.length >=
                  eventsPerPage * page
                    ? eventsPerPage * page
                    : events.length
                } of ${events.length}`
              : '0'
            : ''}
        </div>

        <div className="buttonWrapper">
          <select
            id="viewSwitch"
            defaultValue="table"
            style={{width: '130px'}}
            onChange={() => setView(document.getElementById('viewSwitch').value)}
          >
            <option value="table">View Table</option>
            <option value="gallery">View Gallery</option>
          </select>

          <select
            id="eventsPerPageSelector"
            defaultValue="12"
            style={{width: '195px'}}
            onChange={() => changeEventsPerPage()}
          >
            <option value="12">Show 12 Events / Page</option>
            <option value="24">Show 24 Events / Page</option>
            <option value="48">Show 48 Events / Page</option>
            <option value="90">Show 90 Events / Page</option>
          </select>

          <select
            id="sortSelector"
            defaultValue="nameASC"
            style={{width: '230px'}}
            onChange={() => sortEvents()}
          >
            <option value="uploadedDESC">Sort Uploaded: New ⮕ Old</option>
            <option value="uploadedASC">Sort Uploaded: Old ⮕ New</option>
            <option value="placeASC">Sort Place: High ⮕ Low </option>
            <option value="placeDESC">Sort Place: Low ⮕ High </option>
            <option value="builderASC">Sort Builder: A ⮕ Z</option>
            <option value="builderDESC">Sort Builder: Z ⮕ A</option>
            <option value="eventASC">Sort Event: A ⮕ Z</option>
            <option value="eventDESC">Sort Event: Z ⮕ A</option>
            <option value="formatASC">Sort Format: New ⮕ Old</option>
            <option value="formatDESC">Sort Format: Old ⮕ New</option>
            <option value="typeASC">Sort Event Type: A ⮕ Z</option>
            <option value="typeDESC">Sort Event Type: Z ⮕ A</option>
            <option value="categoryASC">Sort Event Category: A ⮕ Z</option>
            <option value="categoryDESC">Sort Event Category: Z ⮕ A</option>
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
                <th>Event Type</th>
                <th>Event Category</th>
                <th>Builder</th>
                <th>Place</th>
                <th>Event</th>
                <th>Uploaded</th>
              </tr>
            </thead>
            <tbody>
              {eventsArray.length ? (
                eventsArray.map((event, index) => {
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
          {eventsArray.length ? (
            eventsArray.map((event, index) => {
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
          )}
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

