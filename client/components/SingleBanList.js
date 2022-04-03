/* eslint-disable max-statements */

import React, {useLayoutEffect} from 'react'
import BanList from './BanList'

const SingleBanList = (props) => {
  // USE LAYOUT EFFECT
  useLayoutEffect(() => window.scrollTo(0, 0))

  return (
    <div className="body">
        <BanList {...props}/>
    </div>
  )
}

export default SingleBanList