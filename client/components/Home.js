
import BlogPost from './BlogPost'
import Pagination from './Pagination'
import React, { useState, useEffect, useLayoutEffect } from 'react'
import axios from 'axios'

const Home = () => {
  const [page, setPage] = useState(1)
  const [blogPosts, setBlogPosts] = useState([])
  const [firstXFetched, setFirstXFetched] = useState(false)
  const [allFetched, setAllFetched] = useState(false)

  // GO TO PAGE
  const goToPage = (num) => {
    setPage(num)
    window.scrollTo(0, 0)
  }

  // PREVIOUS PAGE
  const previousPage = () => {
    if (page <= 1) return
    setPage(page - 1)
    window.scrollTo(0, 0)
  }

  // NEXT PAGE
  const nextPage = () => {
    if (page >= Math.ceil(blogPosts.length / 10)) return
    setPage(page + 1)
    window.scrollTo(0, 0)  
  }

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

  if (!blogPosts.length) return <div></div>
  const lastIndex = page * 10
  const firstIndex = lastIndex - 10

  return (
      <div className="blog">
        {
          blogPosts.slice(firstIndex, lastIndex).map((bp) => {
            return (
                <BlogPost 
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
                />)
          })
        }
        <div className="paginationWrapper">
          <div className="pagination">
            <Pagination
              location="bottom"
              nextPage={nextPage}
              previousPage={previousPage}
              goToPage={goToPage}
              length={blogPosts.length}
              page={page}
              itemsPerPage={10}
            />
          </div>
        </div>
      </div>
  )
}

export default Home
