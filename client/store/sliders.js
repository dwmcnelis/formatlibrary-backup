const initialState = {}

// Action Types
const SET_SLIDERS = 'SET_SLIDERS'

// Actions Creators
export const setSliders = sliders => {
  console.log('ACTION!')
  return {
    type: SET_SLIDERS,
    sliders: sliders
  }
}

// Sliders Reducer
const slidersReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_SLIDERS: {
      console.log('setting slider')
      console.log('state', state)
      console.log('action.sliders', action.sliders)
      return {...state, ...action.sliders}
    }
    default:
      return state
  }
}

export default slidersReducer
