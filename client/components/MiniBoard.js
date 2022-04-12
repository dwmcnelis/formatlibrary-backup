
import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import StatsRow from './StatsRow'
import axios from 'axios'
import { capitalize } from '../../functions/utility'
import * as emojis from '../../public/images/emojis'

const MiniBoard = (props) => {
  const [miniboard, setMiniBoard] = useState([])
  const history = useHistory()
  const goToLeaderBoard = () => history.push(`/leaderboards/${props.format.name.toLowerCase()}`)

  // USE EFFECT FETCH DATA
  useEffect(() => {
    const fetchData = async () => {
      try {
        const {data} = await axios.get(`/api/stats/leaders/${props.limit}/${props.format.name.toLowerCase()}`)
        setMiniBoard(data)
      } catch (err) {
        console.log(err)
      }
    }

    fetchData()
  }, [])

  if (!miniboard.length) return <div></div>

  return (
    <div>
      <div className="divider"/> 
      <div id="leaderboard" className="miniboard">
        <div onClick={() => goToLeaderBoard()} className="miniboard-title-flexbox">
          <img style={{ width:'64px'}} src={emojis[props.format.icon]}/>
          <h2 className="subheading">{capitalize(props.format.name, true)} Leaderboard</h2>
          <img style={{ width:'64px'}} src={emojis[props.format.icon]}/>
        </div>
        <table id="miniboard-table">
          <thead>
            <tr>
              <th>Rank</th>
              <th>Player</th>
              <th>Elo</th>
              <th>Medal</th>
              <th>Wins</th>
              <th>Losses</th>
              <th>Win Rate</th>
            </tr>
          </thead>
          <tbody>
            {
                miniboard.length ? (
                    miniboard.map((stats, index) => {
                        return <StatsRow stats={stats} index={index} key={stats.playerId}/>
                    })
                ) : <tr />
            }
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default MiniBoard