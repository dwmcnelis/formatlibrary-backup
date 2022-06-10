
import React, { useLayoutEffect } from 'react'

const NotFound = () => {
  // USE LAYOUT EFFECT
  useLayoutEffect(() => window.scrollTo(0, 0))

  return (
    <div className="body">
        <div className="not-found-flexbox">
            <h1>404</h1>
            <div className="not-found-inner-flexbox">
              <img id="thinking" src="/images/emojis/thinking.png"/>
              <p>Page not found</p>
              <img id="thinking" src="/images/emojis/thinking.png"/>
            </div>
            <img id="dig" src="/images/artworks/dig.jpg"/>
        </div>
    </div>
  )
}

export default NotFound
