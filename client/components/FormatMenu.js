/* eslint-disable max-statements */

import React, { useState, useEffect } from 'react'
import FormatButton from './FormatButton'
import axios from 'axios'

const FormatMenu = () => {
  const [formats, setFormats] = useState(null)

  // USE EFFECT SET FORMATS
  useEffect(() => {
    const fetchData = async () => {
      try {
        const {data} = await axios.get(`/api/formats/`)
        return setFormats(data)
      } catch (err) {
        console.log(err)
      }
    }

    fetchData()
  }, [])

  if (!formats) return <div />

/* eslint-disable complexity */
  return (
    <div className="body">
      <h1 className="format-title">Popular Formats</h1>
      <br />
      <div className="format-menu">
          {
            formats.filter((f) => f.popular).map((format) => <FormatButton key={format.id} format={format}/>)
          }
      </div>
      <br />
      <br />
      <h1 className="format-title">Other Formats</h1>
      <br />
      <div className="format-menu">
          {
            formats.filter((f) => !f.popular).map((format) => <FormatButton key={format.id} format={format}/>)
          }
      </div>
      <br/>
    </div>
  )
}

export default FormatMenu