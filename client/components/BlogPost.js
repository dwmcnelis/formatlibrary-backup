
import React from 'react'
import parse from 'html-react-parser'
import Adsense from 'react-adsense';
import { useMediaQuery } from 'react-responsive'

const BlogPost = (props) => {
  const isTabletOrMobile = useMediaQuery({ query: '(max-width: 1224px)' })
  
  if (isTabletOrMobile) return (
    <div className="blogpost">
      <div className="blogpost-flexbox">
        <div className="post-content">
          {parse(props.content)}
        </div>
      </div>
      <div className="blog-divider"/>
    </div>
  )

  return (
    <div className="blogpost">
      <div className="blogpost-flexbox">
        <div className="post-content">
          {parse(props.content)}
        </div>
        {
            props.index === 0 ? (
              <div className="vertical-ads-flexbox">
                <a 
                  href="https://discord.com/invite/formatlibrary" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="widget-link"
                  style={{margin: "8px 0px 16px"}}
                >
                  <div className="discord-link">
                    <img 
                      src="/images/logos/Discord.png" 
                      alt="Discord" 
                      style={{height: "36%", width: "36%"}}
                    />
                    <p className="ad-desc">Join our Discord server!</p>
                  </div>
                </a>
                <a 
                  href="https://twitter.com/formatlibrary"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="widget-link"
                  style={{margin: "16px 0px"}}
                >
                  <img 
                    src="/images/logos/Twitter.png" 
                    alt="Twitter" 
                    style={{height: "33%", width: "33%"}}
                  />
                  <p className="ad-desc">Follow us for Event Announcements!</p>
                </a>
                <a 
                  href="https://www.buymeacoffee.com/danielmcnelis" 
                  target="_blank"
                  rel="noreferrer"
                  className="widget-link"
                  style={{margin: "16px 0px"}}
                >
                  <img 
                    src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" 
                    alt="Buy Me A Coffee" 
                    style={{ height: "22%", width: "80%"}}
                  />
                  <p className="ad-desc">Small donations support our work!</p>
                </a>
                <a 
                  href="https://www.tcgplayer.com/search/yugioh/product?productLineName=yugioh&view=grid&utm_campaign=affiliate&utm_medium=FormatLibrary&utm_source=FormatLibrary" 
                  target="_blank"
                  rel="noreferrer"
                  className="widget-link"
                  style={{margin: "16px 0px 8px"}}
                >
                  <img 
                    src="/images/logos/TCGPlayer.png" 
                    alt="TCG Player" 
                    style={{height: "22%", width: "80%"}}
                  />
                  <p className="ad-desc">Shop to support our site!</p>
                </a>
              </div>
            ) : (
              <Adsense.Google
                className="vertical-adsense"
                client="ca-pub-2048547741313745"
                slot="8384346734"
                style={{ width: '100%', height: '75%' }}
              /> 
            )
          }
        </div>
      <div className="blog-divider"/>
    </div>
  )
}

export default BlogPost