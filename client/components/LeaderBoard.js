
import React, { useState, useEffect } from 'react'
import StatsRow from './StatsRow'
import axios from 'axios'
import { capitalize } from '../../functions/utility'
import * as emojis from '../../public/images/emojis'

const LeaderBoard = (props) => {
  const [leaderboard, setLeaderboard] = useState([])

  // USE EFFECT SET CARD
  useEffect(() => {
    const fetchData = async () => {
      try {
        const {data} = await axios.get(`/api/stats/leaders/${props.format.name.toLowerCase()}`)
        setLeaderboard(data)
      } catch (err) {
        console.log(err)
      }
    }

    fetchData()
  }, [])

  if (!leaderboard.length) return <div></div>

  return (
    <div id="leaderboard" className="leaderboard">
      <div className="leaderboard-title-flexbox">
        <img style={{ width:'64px'}} src={emojis[props.format.icon]}/>
        <h2 className="leaderboard-title">{capitalize(props.format.name, true)} Leaderboard:</h2>
        <img style={{ width:'64px'}} src={emojis[props.format.icon]}/>
      </div>
      <br />
      <table id="leaderboard-table">
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
              leaderboard.length ? (
                  leaderboard.map((stats, index) => {
                      return <StatsRow stats={stats} index={index} key={stats.playerId}/>
                  })
              ) : <tr />
          }
        </tbody>
      </table>
    </div>
  )
}

export default LeaderBoard