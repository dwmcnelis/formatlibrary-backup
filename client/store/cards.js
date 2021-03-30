import axios from 'axios'

const initialState = {
  cards: [],
  featuredCard: null
}

// Action Types
const SET_CARDS = 'SET_CARDS'
const SET_FEATURED_CARD = 'SET_FEATURED_CARD'

// Actions Creators
export const setCards = cards => {
  return {
    type: SET_CARDS,
    cards: cards
  }
}

export const setFeaturedCard = card => {
  return {
    type: SET_FEATURED_CARD,
    featuredCard: card
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
    try {
      const res = await axios.get(`/api/cards/some`, {params: filters})
      // console.log('res.data', res.data)
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
      // console.log('res.data', res.data)
      dispatch(setFeaturedCard(res.data))
    } catch (error) {
      console.log(error)
    }
  }
}

// Cards Reducer
const cardsReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_CARDS: {
      return {...state, cards: [...action.cards]}
    }
    case SET_FEATURED_CARD: {
      // console.log('action.featuredCard', action.featuredCard)
      return {...state, featuredCard: action.featuredCard}
    }
    default:
      return state
  }
}

export default cardsReducer
