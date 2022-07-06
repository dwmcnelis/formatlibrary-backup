
import React from 'react'
import parse from 'html-react-parser'
import Adsense from 'react-adsense';

const BlogPost = (props) => {
  return (
    <div className="blogpost">
      <div className="blogpost-flexbox">
        <div className="post-content">{parse(props.content)}</div>
          {
            props.index === 0 ? (
              <div className="vertical-ads-flexbox">
                <a 
                  href="https://discord.com/invite/formatlibrary" 
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <div className="discord-link">
                    <div className="discord-logo"/>
                    <p className="discord-desc-black">Join our Discord!</p>
                  </div>
                </a>
                <Adsense.Google
                  className="vertical-adsense"
                  client="ca-pub-2048547741313745"
                  slot="8384346734"
                  style={{ width: '100%', height: '50%' }}
                  format=""
                />
              </div>
            ) : <Adsense.Google
              className="vertical-adsense"
              client="ca-pub-2048547741313745"
              slot="8384346734"
              style={{ width: '100%', height: '75%' }}
              format=""
            />
          }
      </div>
      <div className="blog-divider"/>
    </div>
  )
}

export default BlogPost