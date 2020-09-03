/* eslint-disable max-statements */

import React from 'react'
import {connect} from 'react-redux'
import {Slider} from '@material-ui/core'
import Typography from '@material-ui/core/Typography'
import {withStyles, makeStyles} from '@material-ui/core/styles'
import {setSliders} from '../store/sliders'
import {red} from '@material-ui/core/colors'

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
    height: 6,
    '&$disabled': {
      color: '#909396',
      height: 6
    }
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
    },
    '&$disabled': {
      height: 20,
      width: 20,
      color: '#909396',
      backgroundColor: '#f5f7fa',
      border: '2px solid currentColor',
      marginTop: -8,
      marginLeft: -12
    }
  },
  valueLabel: {
    height: 200,
    width: 200,
    left: 'calc(-50%)',
    '&$disabled': {
      height: 2000,
      width: 2000,
      size: 2000,
      left: 'calc(-50%)'
    }
  },
  track: {
    height: 6,
    borderRadius: 3,
    '&$disabled': {
      height: 6,
      color: '#909396',
      borderRadius: 3
    }
  },
  rail: {
    height: 6,
    borderRadius: 3,
    '&$disabled': {
      height: 6,
      color: '#6d6f8a',
      backgroundColor: '#f5f7fa',
      borderRadius: 3
    }
  },
  active: {},
  disabled: {}
})(Slider)
function valuetext(value) {
  return `${value}`
}

const RangeSlider = props => {
  const classes = useStyles()

  const display = props.defaultValue ? 'on' : 'auto'

  const points =
    props.type === 'range-slider'
      ? [props.min, props.max]
      : props.defaultValue ? props.defaultValue : props.max

  const [value, setValue] = React.useState(points)

  const handleCommit = (sliderId, newValue) => {
    props.dispatch(setSliders({[sliderId]: newValue}))
  }

  const handleChange = (event, newValue) => {
    setValue(newValue)
  }

  return (
    <div id="slider" className={classes.root}>
      <img
        src={props.symbol}
        style={{height: '24px', margin: '0px 12px 0px 0px'}}
      />
      <Typography
        style={{
          minWidth: '64px',
          verticalAlign: 'middle',
          textAlign: 'left',
          fontFamily: 'arial',
          fontSize: '19px',
          fontWeight: '500'
        }}
      >
        {props.label}
      </Typography>
      <PrettoSlider
        style={{margin: '0px 0px 0px 12px'}}
        value={props.defaultValue || value}
        step={props.step}
        min={props.min}
        max={props.max}
        disabled={!!props.defaultValue}
        onChange={handleChange}
        onChangeCommitted={() => handleCommit(props.id, value)}
        valueLabelDisplay={display}
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
