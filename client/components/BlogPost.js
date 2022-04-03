
import React from 'react'
import parse from 'html-react-parser'

const BlogPost = (props) => {
  return (
    <div className="blogpost">
      <div className="post-content">{parse(props.content)}</div>
      <div className="blog-divider"/>
    </div>
  )
}

export default BlogPost