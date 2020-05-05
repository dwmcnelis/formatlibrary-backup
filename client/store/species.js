import axios from 'axios'

const initialState = {
  allSpecies: [],
  singleSpecies: {}
}

// Action Types
const SET_ALL_SPECIES = 'SET_ALL_SPECIES'
const SET_SINGLE_SPECIES = 'SET_SINGLE_SPECIES'

// Actions Creators
export const setAllSpecies = species => {
  return {
    type: SET_ALL_SPECIES,
    species
  }
}

export const setSingleSpecies = species => {
  return {
    type: SET_SINGLE_SPECIES,
    species
  }
}

// Thunk Creators
export const fetchAllSpecies = () => {
  return async dispatch => {
    try {
      const res = await axios.get('/api/species')
      dispatch(setAllSpecies(res.data))
    } catch (error) {
      console.log(error)
    }
  }
}

export const fetchSingleSpecies = id => {
  return async dispatch => {
    try {
      const res = await axios.get(`/api/species/${id}`)
      dispatch(setSingleSpecies(res.data))
    } catch (error) {
      console.log(error)
    }
  }
}

// SPECIES Reducer
const speciesReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_ALL_SPECIES:
      return {...state, allSpecies: action.species}
    case SET_SINGLE_SPECIES: {
      return {...state, singleSpecies: action.species}
    }
    default:
      return state
  }
}

export default speciesReducer
