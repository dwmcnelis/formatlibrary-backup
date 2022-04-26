import React from 'react'
import {Redirect, Route, Switch} from 'react-router-dom'
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
      <Route path="/goat-deck-gallery" component={DeckTable} />
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
      <Route path="may-2002---yugi-kaiba"><Redirect to="/formats/Yugi-Kaiba"/></Route>
      <Route path="jul-2002---critter"><Redirect to="/formats/Critter"/></Route>
      <Route path="apr-2003---android"><Redirect to="/formats/Android"/></Route>
      <Route path="aug-2003---yata"><Redirect to="/formats/Yata"/></Route>
      <Route path="aug-2004---chaos"><Redirect to="/formats/Chaos"/></Route>
      <Route path="oct-2004---warrior"><Redirect to="/formats/Warrior"/></Route>
      <Route path="apr-2005---goat"><Redirect to="/formats/Goat"/></Route>
      <Route path="oct-2005---reaper"><Redirect to="/formats/Reaper"/></Route>
      <Route path="apr-2006---chaos-return"><Redirect to="/formats/Chaos Return"/></Route>
      <Route path="oct-2006---stein-monarch"><Redirect to="/formats/Stein"/></Route>
      <Route path="mar-2007---troop-dup"><Redirect to="/formats/Troop Dup"/></Route>
      <Route path="jan-2008---perfect-circle"><Redirect to="/formats/Perfect Circle"/></Route>
      <Route path="sep-2008---teledad"><Redirect to="/formats/TeleDAD"/></Route>
      <Route path="mar-2009---synchro-cat"><Redirect to="/formats/Synchro Cat"/></Route>
      <Route path="mar-2010---edison"><Redirect to="/formats/Edison"/></Route>
      <Route path="july-2010---glad-beast"><Redirect to="/formats/Frog"/></Route>
      <Route path="oct-2011---tengu-plant"><Redirect to="/formats/Tengu Plant"/></Route>
      <Route path="dec-2012---wind-up"><Redirect to="/formats/Wind-Up"/></Route>
      <Route path="mar-2013---baby-ruler"><Redirect to="/formats/Baby Ruler"/></Route>
      <Route path="sep-2013---ravine-ruler"><Redirect to="/formats/Ravine Ruler"/></Route>
      <Route path="july-2014---hat"><Redirect to="/formats/HAT"/></Route>
      <Route path="july-2015---djinn-lock"><Redirect to="/formats/Nekroz"/></Route>
      <Route path="aug-2015---newgioh"><Redirect to="/formats/"/></Route>
      <Route component={NotFound} />
    </Switch>
  )
}

export default Routes
