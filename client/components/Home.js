
import BlogPost from './BlogPost'
import React, { useState, useEffect, useLayoutEffect } from 'react'
import axios from 'axios'

const Home = () => {
  const [blogPosts, setBlogPosts] = useState([])
  const [firstXFetched, setFirstXFetched] = useState(false)
  const [allFetched, setAllFetched] = useState(false)

  // USE LAYOUT EFFECT
  useLayoutEffect(() => window.scrollTo(0, 0))

  // USE EFFECT firstXFetched
  useEffect(() => {
    if (!firstXFetched) {
      const fetchData = async () => {
        const {data} = await axios.get(`/api/blogposts/first/10`)
        setBlogPosts(data)
        setFirstXFetched(true)
      } 

      fetchData()
    }
  }, [])

  // USE EFFECT allFetched
  useEffect(() => {
    if (!allFetched) {
      const fetchData = async () => {
        const {data} = await axios.get(`/api/blogposts/all`)
        setBlogPosts(data)
        setAllFetched(true)
      } 

      fetchData()
    }
  }, [])

  return (
    <div className="body">
      {
        blogPosts.length ? 
        blogPosts.map((bp) => {
          return <BlogPost 
                  key={bp.title} 
                  id={bp.id} 
                  title={bp.title} 
                  content={bp.content}
                  images={bp.images}
                  components={bp.components}
                  author={bp.author}
                  format={bp.format}
                  views={bp.views}
                  rating={bp.rating}
                />
        }) : '404 Not Found.'
      }
    </div>
  )
}

export default Home
