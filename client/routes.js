import React, {Component} from 'react'
import {Route, Switch} from 'react-router-dom'
import {Home, SingleCard} from './components'

/**
 * COMPONENT
 */
class Routes extends Component {
  render() {
    return (
      <Switch>
        <Route exact path="/" component={Home} />
        <Route path="/home" component={Home} />
        <Route path="/card/:id" component={SingleCard} />
      </Switch>
    )
  }
}

export default Routes
