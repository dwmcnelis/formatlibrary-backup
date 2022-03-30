import React from 'react'
import {Route, Switch} from 'react-router-dom'
import {FormatIntro, FormatMenu, CardTable, SingleDeck, DeckTable, Home, SingleCard} from './components'

const Routes = () => {
  return (
    <Switch>
      <Route exact path="/" component={Home} />
      <Route exact path="/home/" component={Home} />
      <Route exact path="/decks/" component={DeckTable} />
      <Route path="/decks/:id" component={SingleDeck} />
      <Route exact path="/cards/" component={CardTable} />
      <Route path="/cards/:id" component={SingleCard} />
      <Route exact path="/formats/" component={FormatMenu} />
      <Route path="/formats/:id" component={FormatIntro} />
    </Switch>
  )
}

export default Routes
