
import React from 'react'
import parse from 'html-react-parser'
import AdSense from 'react-adsense';

const BlogPost = (props) => {
  return (
    <div className="blogpost">
      <div className="blogpost-flexbox">
        <div className="post-content">{parse(props.content)}</div>
        <AdSense.Google
            className="vertical-adsense"
            client='ca-pub-7292810486004926'
            slot='7806394673'
            style={{ width: '100%', height: '75%' }}
            format=''
        />
      </div>
      <div className="blog-divider"/>
    </div>
  )
}

export default BlogPost