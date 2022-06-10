
import React from 'react'
import parse from 'html-react-parser'
import {Adsense} from '@ctrl/react-adsense';

const BlogPost = (props) => {
  return (
    <div className="blogpost">
      <div className="blogpost-flexbox">
        <div className="post-content">{parse(props.content)}</div>
        <Adsense
          className="vertical-adsense"
          client="ca-pub-7640562161899788"
          slot="7259870550"
          style={{ width: '100%', height: '75%' }}
          format=""
        />
      </div>
      <div className="blog-divider"/>
    </div>
  )
}

export default BlogPost