/* eslint-disable max-statements */

import React from 'react'
import {connect} from 'react-redux'
import {Slider} from '@material-ui/core'
import Typography from '@material-ui/core/Typography'
import {withStyles, makeStyles} from '@material-ui/core/styles'
import {setSliders} from '../store/sliders'

const useStyles = makeStyles(theme => ({
  root: {
    width: 300 + theme.spacing(3) * 2
  },
  margin: {
    height: theme.spacing(3)
  }
}))

const PrettoSlider = withStyles({
  root: {
    color: '#6d6f8a',
    height: 6
  },
  thumb: {
    height: 20,
    width: 20,
    backgroundColor: '#f5f7fa',
    border: '2px solid currentColor',
    marginTop: -8,
    marginLeft: -12,
    '&:focus, &:hover, &$active': {
      boxShadow: 'inherit'
    }
  },
  active: {},
  valueLabel: {
    left: 'calc(-50%)'
  },
  track: {
    height: 6,
    borderRadius: 3
  },
  rail: {
    height: 6,
    borderRadius: 3
  }
})(Slider)
function valuetext(value) {
  return `${value}`
}

const RangeSlider = props => {
  const classes = useStyles()
  const points =
    props.type === 'range-slider' ? [props.min, props.max] : props.max
  const [value, setValue] = React.useState(points)

  const handleCommit = (sliderId, newValue) => {
    console.log('sliderId', sliderId)
    console.log('newValue', newValue)
    props.dispatch(setSliders({[sliderId]: newValue}))
  }

  const handleChange = (event, newValue) => {
    setValue(newValue)
  }

  return (
    <div id="slider" className={classes.root}>
      <img
        src={props.symbol}
        style={{height: '24px', margin: '0px 24px 0px 0px'}}
      />
      <Typography
        style={{
          verticalAlign: 'middle',
          fontFamily: 'arial',
          fontSize: '19px',
          fontWeight: '500'
        }}
      >
        {props.label}
      </Typography>
      <PrettoSlider
        style={{margin: '0px 0px 0px 24px'}}
        value={value}
        step={props.step}
        min={props.min}
        max={props.max}
        onChange={handleChange}
        onChangeCommitted={() => handleCommit(props.id, value)}
        valueLabelDisplay="auto"
        aria-labelledby="range-slider"
        getAriaValueText={valuetext}
      />
    </div>
  )
}

const mapDispatch = dispatch => ({
  setSliders: sliders => {
    return dispatch(setSliders(sliders))
  }
})

export default connect(mapDispatch)(RangeSlider)
