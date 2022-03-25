
import React from 'react'
import parse from 'html-react-parser'

const BlogPost = (props) => {
  return (
    <div className="blog-post">
      <h2 className="post-title">{props.title}</h2>
      <br />
      <div className="post-content">{parse(props.content)}</div>
      <br />
    </div>
  )
}

export default BlogPost