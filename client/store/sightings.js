import axios from 'axios'

const initialState = {
  speciesSightings: [],
  singleSighting: {},
  poster: {}
}

// Action Types
const SET_ALL_SIGHTINGS = 'SET_ALL_SIGHTINGS'
const SET_SINGLE_SIGHTING = 'SET_SINGLE_SIGHTING'
const SET_POSTER = 'SET_POSTER'

// Actions Creators
export const setSpeciesSightings = sightings => {
  return {
    type: SET_ALL_SIGHTINGS,
    sightings
  }
}

export const setSingleSighting = sighting => {
  return {
    type: SET_SINGLE_SIGHTING,
    sighting
  }
}

export const setPoster = poster => {
  return {
    type: SET_POSTER,
    poster
  }
}

// Thunk Creators
export const fetchSpeciesSightings = id => {
  return async dispatch => {
    try {
      const res = await axios.get(`/api/sightings/species/${id}`)
      dispatch(setSpeciesSightings(res.data))
    } catch (error) {
      console.log(error)
    }
  }
}

export const fetchSingleSighting = id => {
  return async dispatch => {
    try {
      const res = await axios.get(`/api/sightings/${id}`)
      dispatch(setSingleSighting(res.data))
    } catch (error) {
      console.log(error)
    }
  }
}

export const fetchPoster = id => {
  return async dispatch => {
    try {
      const res = await axios.get(`/api/users/${id}`)
      dispatch(setPoster(res.data[0]))
    } catch (error) {
      console.log(error)
    }
  }
}

export const saveSighting = info => {
  return async () => {
    try {
      const {
        userId,
        commonName,
        imageUrl,
        latitude,
        longitude,
        description
      } = info

      const {data} = await axios.get(`api/species/`)
      let speciesId = 1

      data.forEach(function(species) {
        if (species.commonName === commonName) {
          speciesId = species.id
        }
      })

      console.log('speciesId', speciesId)

      await axios.put(`/api/sightings/${userId}/save`, {
        userId,
        speciesId,
        imageUrl,
        latitude,
        longitude,
        description
      })
    } catch (error) {
      console.log(error)
    }
  }
}

// Sightings Reducer
const sightingsReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_ALL_SIGHTINGS:
      return {...state, speciesSightings: action.sightings}
    case SET_SINGLE_SIGHTING: {
      return {...state, singleSighting: action.sighting}
    }
    case SET_POSTER: {
      return {...state, poster: action.poster}
    }
    default:
      return state
  }
}

export default sightingsReducer
