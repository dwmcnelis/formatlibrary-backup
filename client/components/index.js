/**
 * `components/index.js` exists simply as a 'central export' for our components.
 * This way, we can import all of our components from the same place, rather than
 * having to figure out which file they belong to!
 */
export {default as Navbar} from './navbar'
export {default as Home} from './Home'
export {default as Species} from './Species'
export {default as SingleSpecies} from './SingleSpecies'
export {default as Locations} from './Locations'
export {default as SingleLocation} from './SingleLocation'
export {default as NewSighting} from './NewSighting'
export {default as About} from './About'
export {Login, Signup} from './auth-form'
