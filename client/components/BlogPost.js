
import React from 'react'
import parse from 'html-react-parser'
import Adsense from 'react-adsense';

const BlogPost = (props) => {
  return (
    <div className="blogpost">
      <div className="blogpost-flexbox">
        <div className="post-content">
          {parse(props.content)}
        </div>
        {
            props.index === 0 ? (
              <div className="vertical-ads-flexbox" style={{height: "100%"}}>
                <br/>
                <a 
                  href="https://discord.com/invite/formatlibrary" 
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <div className="discord-link">
                    <div className="discord-sidebar"/>
                    <p className="discord-desc-black">Join our Discord!</p>
                  </div>
                </a>
                <br/>
                <br/>
                <a 
                  href="https://www.buymeacoffee.com/danielmcnelis" 
                  target="_blank"
                  rel="noreferrer"
                >
                  <img 
                    src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" 
                    alt="Buy Me A Coffee" 
                    style={{ height: "22%", width: "80%"}}
                  />
                </a>
                <br/>
                <br/>
                <a 
                  href="https://www.tcgplayer.com/search/yugioh/product?productLineName=yugioh&view=grid&utm_campaign=affiliate&utm_medium=FormatLibrary&utm_source=FormatLibrary" 
                  target="_blank"
                  rel="noreferrer"
                >
                  <img 
                    src="/images/logos/TCGPlayer.png" 
                    alt="TCG Player" 
                    style={{height: "22%", width: "80%"}}
                  />
                  <p style={{color: "black", margin: "4px 0px"}}>Shop to support our site!</p>
                </a>
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