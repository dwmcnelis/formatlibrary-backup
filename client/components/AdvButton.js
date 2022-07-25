import React from 'react'
import { camelize, capitalize } from '../../functions/utility'

//ADVANCED SEARCH BUTTONS
const AdvButton = (props) => {
  const { id, display, buttonClass, clicked, removeFilter, applyFilter } = props
   
  return (
    clicked ? (
      <a
        className={"clicked" + capitalize(buttonClass) + "Button"}
        id={camelize(id)}
        type="submit"
        onClick={() => removeFilter(buttonClass, id)}
      >
        {display}
      </a>
    ) : (
      <a
        className={buttonClass + "Button"}
        id={camelize(id)}
        type="submit"
        onClick={() => applyFilter(buttonClass, id)}
      >
        {display}
      </a>
    )
  )
} 

export default AdvButton
