import React from 'react'
import { camelize, capitalize } from '../../functions/utility'

//ADVANCED SEARCH BUTTONS
const AdvButton = (props) => {
  const { id, display, buttonClass, queryParams, removeFilter, applyFilter } = props
  const filterType = buttonClass === 'monster' ? null : buttonClass
  const clicked = buttonClass === 'monster' ? queryParams[id] : queryParams[buttonClass][id]
   
  return (
    clicked ? (
      <a
        className={"clicked" + capitalize(buttonClass) + "Button"}
        id={camelize(id)}
        type="submit"
        onClick={() => removeFilter(filterType, id)}
      >
        {display}
      </a>
    ) : (
      <a
        className={buttonClass + "Button"}
        id={camelize(id)}
        type="submit"
        onClick={() => applyFilter(filterType, id)}
      >
        {display}
      </a>
    )
  )
} 

export default AdvButton
