import React from 'react'
import {connect} from 'react-redux'
import {saveSighting} from '../store/sightings'

class NewSighting extends React.Component {
  constructor() {
    super()

    this.state = {
      commonName: 'Bald Eagle',
      imageUrl: '',
      latitude: '',
      longitude: '',
      description: '',
      userId: null
    }

    this.showWidget = this.showWidget.bind(this)
    this.checkUpload = this.checkUpload.bind(this)
  }

  async handleSubmit(event) {
    event.preventDefault()
    await this.props.saveSighting(this.state)
    this.props.history.push(`/species`)
  }

  showWidget(widget) {
    widget.open()
  }

  checkUpload(result) {
    if (result.event === 'success') {
      const imageUrl = result.info.secure_url
      const latStr = result.info.image_metadata.GPSLatitude
      const lngStr = result.info.image_metadata.GPSLongitude
      let latitude = ''
      let longitude = ''

      if (latStr) {
        const latDegs = Number(latStr.substring(0, latStr.indexOf(' deg')))
        const latMins = Number(
          latStr.substring(latStr.indexOf('deg') + 4, latStr.indexOf(`'`))
        )
        const latSecs = Number(
          latStr.substring(latStr.indexOf(`'`) + 2, latStr.indexOf(`"`))
        )
        const latDir = latStr.substring(latStr.length - 1)
        const latSign = latDir === 'N' ? 1 : -1
        latitude = (
          latSign *
          (latDegs + latMins / 60 + latSecs / 3600)
        ).toFixed(6)
      }

      if (lngStr) {
        const lngDegs = Number(lngStr.substring(0, latStr.indexOf(' deg')))
        const lngMins = Number(
          lngStr.substring(latStr.indexOf('deg') + 4, latStr.indexOf(`'`))
        )
        const lngSecs = Number(
          lngStr.substring(latStr.indexOf(`'`) + 2, latStr.indexOf(`"`))
        )
        const lngDir = lngStr.substring(latStr.length - 1)
        const lngSign = lngDir === 'E' ? 1 : -1
        longitude = (
          lngSign *
          (lngDegs + lngMins / 60 + lngSecs / 3600)
        ).toFixed(6)
      }

      this.setState({imageUrl, latitude, longitude})
    }
  }

  componentDidMount() {
    if (this.props.user.id) {
      this.setState({userId: this.props.user.id})
    }
  }

  render() {
    console.log('fn', window.cloudinary.createUploadWidget)
    let myWidget = window.cloudinary.createUploadWidget(
      {
        cloudName: 'dg1ouyroo',
        uploadPreset: 'ubguczgm'
      },
      (error, result) => {
        if (error) {
          console.log(error)
        }

        this.checkUpload(result)
      }
    )

    return (
      <div>
        <br />
        <h2 style={{textAlign: 'center'}}>
          Please provide the following information:
        </h2>
        <form className="form-container">
          <button
            className="form-button"
            type="button"
            onClick={() => this.showWidget(myWidget)}
          >
            Upload Photo
          </button>
          <br />
          <h3 className="form-label">Species:</h3>
          <select
            className="form-input"
            onChange={event => {
              this.setState({
                commonName: event.target.value
              })
            }}
          >
            <option value="American Bullfrog">Bald Eagle</option>
            <option value="American Chestnut">American Chestnut</option>
            <option value="American Goldfinch">American Goldfinch</option>
            <option value="Bald Eagle">Bald Eagle</option>
            <option value="Black Bear">Black Bear</option>
            <option value="Japanese Cherry">Japanese Cherry</option>
            <option value="Mossy Maze Polypore">Mossy Maze Polypore</option>
            <option value="Woolybear">Woolybear</option>
          </select>

          <h3 className="form-label">* Image URL:</h3>
          <input
            className="form-input"
            value={this.state.imageUrl}
            onChange={event => {
              this.setState({
                imageUrl: event.target.value
              })
            }}
          />
          <h3 className="form-label">* Latitude:</h3>
          <input
            className="form-input"
            value={this.state.latitude}
            onChange={event => {
              this.setState({
                latitude: event.target.value
              })
            }}
          />
          <h3 className="form-label">* Longitude:</h3>
          <input
            className="form-input"
            value={this.state.longitude}
            onChange={event => {
              this.setState({
                longitude: event.target.value
              })
            }}
          />
          <h3 className="form-label">Description:</h3>
          <input
            className="form-input"
            value={this.state.description}
            onChange={event => {
              this.setState({
                description: event.target.value
              })
            }}
          />

          <div className="form-button-container">
            <p>Fields with an * are required.</p>
            <br />
            <button
              className="form-button"
              type="submit"
              onClick={() => this.handleSubmit(event)}
            >
              Submit Sighting
            </button>
          </div>
        </form>
      </div>
    )
  }
}

const mapState = state => {
  return {
    user: state.user
  }
}

const mapDispatch = dispatch => ({
  saveSighting: info => dispatch(saveSighting(info))
})

export default connect(mapState, mapDispatch)(NewSighting)
