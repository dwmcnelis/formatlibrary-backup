
import React, { useState, useEffect } from 'react'
import axios from 'axios'

const RecentEvents = (props) => {
    const [recentEvents, setRecentEvents] = useState([])
  
    // USE EFFECT
    useEffect(() => {
        const fetchData = async () => {
            try {
                const {data} = await axios.get(`/api/events/recent/${props.format.name}`)
                setRecentEvents(data)
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
                <h2>Recent Events:</h2>
                <div className="recent-events-flex-box">
                {
                    recentEvents.map((event) => <div/>)
                }
                </div>
            </div>
        </div>
    )
}

export default RecentEvents
