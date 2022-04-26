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
  LeaderBoard,
  SingleBanList,
  PlayerProfile,
  NotFound
} from './components'

const Routes = () => {
  return (
    <Switch>
      <Route exact path="/" component={Home} />
      <Route path="/home/" component={Home} />
      <Route path="/great-library" component={CardTable} />
      <Route path="/cards-by-format" component={CardTable} />
      <Route path="/cards-by-year" component={CardTable} />
      <Route path="/goat-card-pool" component={CardTable} />
      <Route exact path="/cards/" component={CardTable} />
      <Route path="/cards/:id" component={SingleCard} />
      <Route path="/goat-deck-gallery/" component={DeckTable} />
      <Route exact path="/decks/" component={DeckTable} />
      <Route path="/decks/:id" component={SingleDeck} />
      <Route exact path="/events/" component={EventTable} />
      <Route path="/events/:id" component={SingleEvent} />
      <Route path="/ban-lists" component={FormatMenu} />
      <Route path="/goat-intro" component={FormatMenu} />
      <Route path="/goat-history" component={FormatMenu} />
      <Route exact path="/formats/" component={FormatMenu} />
      <Route path="/formats/:id" component={FormatIntro} />
      <Route path="/leaderboards/:id" component={LeaderBoard} />
      <Route path="/banlists/:id" component={SingleBanList} />
      <Route path="/players/:id" component={PlayerProfile} />
      <Route component={NotFound} />
    </Switch>
  )
}

export default Routes
