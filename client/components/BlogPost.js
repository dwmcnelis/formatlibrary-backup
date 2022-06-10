
import React from 'react'
import parse from 'html-react-parser'
import Adsense from 'react-adsense';

const BlogPost = (props) => {
  return (
    <div className="blogpost">
      <div className="blogpost-flexbox">
        <div className="post-content">{parse(props.content)}</div>
        <Adsense.Google
          className="vertical-adsense"
          client="ca-pub-2048547741313745"
          slot="8384346734"
          style={{ width: '100%', height: '75%' }}
          format=""
        />
      </div>
      <div className="blog-divider"/>
    </div>
  )
}

export default BlogPost