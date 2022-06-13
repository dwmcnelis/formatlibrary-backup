
import React, { useState, useEffect } from 'react'
import EventThumbnail from './EventThumbnail'
import axios from 'axios'

const RecentEvents = (props) => {
    const [recentEvents, setRecentEvents] = useState([])
    const [winners, setWinners] = useState([])
  
    // USE EFFECT
    useEffect(() => {
        const fetchData = async () => {
            try {
                const {data} = await axios.get(`/api/events/recent/${props.format.name}`)
                setRecentEvents(data.tournaments)
                setWinners(data.winners)
            } catch (err) {
                console.log(err)
            }
        }

        fetchData()
    }, [])

    if (!recentEvents.length) return <div/>

    return (
        <div>
            <div className="divider"/>
            <div id="recent-events" className="recent-events">
                <h2 className="subheading">Recent Events:</h2>
                <div className="recent-events-flexbox">
                {
                    recentEvents.map((event, index) => <EventThumbnail key={event.id} event={event} winner={winners[index]}/>)
                }
                </div>
            </div>
        </div>
    )
}

export default RecentEvents
