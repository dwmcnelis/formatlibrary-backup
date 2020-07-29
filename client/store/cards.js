import axios from 'axios'

const initialState = {}

// Action Types
const SET_CARDS = 'SET_CARDS'

// Actions Creators
export const setCards = cards => {
  return {
    type: SET_CARDS,
    cards: cards
  }
}

// Thunk Creators
export const fetchFirstXCards = x => {
  return async dispatch => {
    try {
      const res = await axios.get(`/api/cards/first/${x}`)
      dispatch(setCards(res.data))
    } catch (error) {
      console.log(error)
    }
  }
}

export const fetchSomeCards = filters => {
  return async dispatch => {
    console.log('filters in fetchSomeCards() in redux store', filters)
    try {
      console.log('trying...')
      const res = await axios.get(`/api/cards/some`, {params: filters})
      dispatch(setCards(res.data))
    } catch (error) {
      console.log(error)
    }
  }
}

export const fetchAllCards = () => {
  return async dispatch => {
    try {
      const res = await axios.get(`/api/cards/all`)
      dispatch(setCards(res.data))
    } catch (error) {
      console.log(error)
    }
  }
}

// Thunk Creators
export const fetchSingleCard = id => {
  return async dispatch => {
    try {
      const res = await axios.get(`/api/cards/${id}`)
      dispatch(setCards(res.data))
    } catch (error) {
      console.log(error)
    }
  }
}

// Cards Reducer
const cardsReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_CARDS:
      return action.cards
    default:
      return state
  }
}

export default cardsReducer
