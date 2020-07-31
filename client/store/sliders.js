const initialState = {}

// Action Types
const SET_SLIDERS = 'SET_SLIDERS'

// Actions Creators
export const setSliders = sliders => {
  return {
    type: SET_SLIDERS,
    sliders: sliders
  }
}

// Sliders Reducer
const slidersReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_SLIDERS: {
      return {...state, ...action.sliders}
    }
    default:
      return state
  }
}

export default slidersReducer
