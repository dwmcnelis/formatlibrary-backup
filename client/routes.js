import React from 'react'
import {Route, Switch} from 'react-router-dom'
import {
  Home, 
  SingleCard, 
  CardTable,  
  SingleDeck, 
  DeckTable,
  EventTable, 
  SingleEvent, 
  FormatMenu,
  FormatIntro,
  SingleBanList,
  PlayerProfile
} from './components'

const Routes = () => {
  return (
    <Switch>
      <Route exact path="/" component={Home} />
      <Route exact path="/home/" component={Home} />
      <Route exact path="/cards/" component={CardTable} />
      <Route path="/cards/:id" component={SingleCard} />
      <Route exact path="/decks/" component={DeckTable} />
      <Route path="/decks/:id" component={SingleDeck} />
      <Route exact path="/events/" component={EventTable} />
      <Route path="/events/:id" component={SingleEvent} />
      <Route exact path="/formats/" component={FormatMenu} />
      <Route path="/formats/:id" component={FormatIntro} />
      <Route path="/banlists/:id" component={SingleBanList} />
      <Route path="/players/:id" component={PlayerProfile} />
    </Switch>
  )
}

export default Routes
