
import React from 'react'
import {capitalize} from '../../functions/utility'
import {god, legend, master, diamond, platinum, gold, silver, bronze, rock, sad, mad} from '../../public/images/emojis'

/*eslint-disable*/
//GET MEDAL
const getMedal = (elo) => {
    return !elo ? gold
    : elo <= 230 ? mad
    : (elo > 230 && elo <= 290) ? sad
    : (elo > 290 && elo <= 350) ? rock
    : (elo > 350 && elo <= 410) ? bronze
    : (elo > 410 && elo <= 470) ? silver
    : (elo > 470 && elo <= 530) ? gold
    : (elo > 530 && elo <= 590) ? platinum
    : (elo > 590 && elo <= 650) ? diamond
    : (elo > 650 && elo <= 710) ? master
    : (elo > 710 && elo <= 770) ? legend
    : god
}

//GET TITLE
const getTitle = (elo) => {
    return !elo ? 'Gold'
    : elo <= 230 ? 'Tilted'
    : (elo > 230 && elo <= 290) ? 'Chump'
    : (elo > 290 && elo <= 350) ? 'Rock'
    : (elo > 350 && elo <= 410) ? 'Bronze'
    : (elo > 410 && elo <= 470) ? 'Silver'
    : (elo > 470 && elo <= 530) ? 'Gold'
    : (elo > 530 && elo <= 590) ? 'Platinum'
    : (elo > 590 && elo <= 650) ? 'Diamond'
    : (elo > 650 && elo <= 710) ? 'Master'
    : (elo > 710 && elo <= 770) ? 'Legend'
    : 'Deity'
}

//BADGE
const Badge = (props) => {
  const { stats } = props
  if (!stats) return
  const medal = getMedal(stats.elo)
  
  return (
    <div className="badge">
        <img src={medal}/>
        <div className="badge-label">{capitalize(stats.format.replace('_', ' '), true)}</div>
    </div>
  )
}

export default Badge
