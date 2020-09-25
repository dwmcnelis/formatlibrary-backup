import React from 'react'
import {Link} from 'react-router-dom'

class Portrait extends React.Component {
  render() {
    const filePath = `/card-images/${this.props.card.image}`

    return (
      <div>
        <Link to={`/card/${this.props.card.id}`}>
          <img
            src={filePath}
            card={this.props.card}
            style={{width: '184px', padding: '2px', margin: '4px'}}
            className="portraits"
            alt={this.props.card.name}
          />
        </Link>
      </div>
    )
  }
}

export default Portrait
