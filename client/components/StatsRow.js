
import React from 'react'
import { useHistory } from 'react-router-dom'
import { ordinalize } from '../../functions/utility'
import {god, legend, master, diamond, platinum, gold, silver, bronze, rock, sad, mad} from '../../public/images/emojis'

/* eslint-disable */
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

const StatsRow = (props) => {
    const {index, stats} = props
    const {elo, wins, losses, player} = stats
    if (!player) return <tr/>
    const evenOrOdd = props.index % 2 ? 'even' : 'odd'
    const history = useHistory()
    const goToPlayer = () => history.push(`/players/${player.tag.slice(0, -5)}${player.tag.slice(-4)}`)

    return (
        <tr onClick={() => goToPlayer()} className={`${evenOrOdd}-search-results-row`}>
            <td>{ordinalize(index + 1)}</td>
            <td>{player.name}</td>
            <td>{Math.round(100 * elo)/100}</td>
            <td>
                <div className="medal-cell">
                    <div>{getTitle(elo)}</div>
                    <img width="32px" src={getMedal(elo)}/>
                </div>
            </td>
            <td>{wins}</td>
            <td>{losses}</td>
            <td>{(Math.round(1000 * wins / (wins + losses))/10).toFixed(1)}%</td>
        </tr>
    )
}

export default StatsRow
