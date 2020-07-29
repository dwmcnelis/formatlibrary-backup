/* eslint-disable complexity */

import React from 'react'
import Card from './Card.js'
import {connect} from 'react-redux'
import {fetchAllCards, fetchSomeCards, fetchFirstXCards} from '../store/cards'

class CardTable extends React.Component {
  constructor() {
    super()
    this.state = {
      page: 1,
      cardsPerPage: 10,
      allFetched: false,
      name: null,
      card: null,
      category: null,
      class: null,
      subclass: null,
      attribute: null,
      type: null,
      maxLevel: null,
      minLevel: null,
      maxAtk: null,
      minAtk: null,
      maxDef: null,
      minDef: null,
      description: null,
      minDay: null,
      maxDay: null,
      minYear: null,
      maxYear: null,
      minMonth: null,
      maxMont: null
    }

    this.applyFilter = this.applyFilter.bind(this)
    this.search = this.search.bind(this)
    this.changeCardsPerPage = this.changeCardsPerPage.bind(this)
    this.previousPage = this.previousPage.bind(this)
    this.nextPage = this.nextPage.bind(this)
  }

  changeCardsPerPage() {
    this.setState({
      cardsPerPage: Number(
        document.getElementById('cardsPerPageSelector').value
      ),
      page: 1
    })
  }

  goToPage(num) {
    this.setState({page: num})
  }

  previousPage() {
    this.setState(state => {
      if (state.page <= 1) return
      return {page: state.page - 1}
    })
  }

  nextPage() {
    this.setState(state => {
      if (state.page >= Math.ceil(this.props.cards.length / state.cardsPerPage))
        return
      return {page: state.page + 1}
    })
  }

  applyFilter(filterId) {
    this.setState({[filterId]: document.getElementById(filterId).value})
  }

  componentDidMount() {
    if (!this.props.cards.length) {
      this.props.fetchFirstXCards(this.state.cardsPerPage)
    }
  }

  async search() {
    try {
      const filters = this.state
      console.log('fetching some...')
      await this.props.fetchSomeCards(filters)
      this.setState({page: 1})
    } catch (err) {
      console.log(err)
    }
  }

  async componentDidUpdate() {
    if (!this.state.allFetched) {
      try {
        console.log('fetching all...')
        await this.props.fetchAllCards()
        this.setState({allFetched: true})
      } catch (err) {
        console.log(err)
      }
    }
  }

  render() {
    console.log('this.state in render()', this.state)
    const lastIndex = this.state.page * this.state.cardsPerPage
    const firstIndex = lastIndex - this.state.cardsPerPage
    const cardsArray = this.props.cards.length
      ? this.props.cards.slice(firstIndex, lastIndex)
      : []

    return (
      <div>
        <br />
        <div id="image" style={{float: 'left', margin: '0px 0px 0px 10pt'}}>
          <img
            src="https://i.imgur.com/C10Y7FJ.jpg"
            style={{width: '128pt', transform: 'scaleX(-1)'}}
          />
        </div>

        <div id="image" style={{float: 'right', margin: '0px 10px 0px 0pt'}}>
          <img src="https://i.imgur.com/C10Y7FJ.jpg" style={{width: '128pt'}} />
        </div>

        <div id="h1" className="h1">
          Card Database
        </div>
        <div id="h2" className="h2">
          May 2002 - July 2020
        </div>
        <div id="results" className="results">
          Search Results:{' '}
          {this.state.allFetched ? this.props.cards.length : 'Loading...'}
        </div>
        <div id="results" className="results">
          {'Cards Per Page: '}
          <select
            id="cardsPerPageSelector"
            onChange={() => {
              this.changeCardsPerPage()
            }}
          >
            <option selected="selected" value="10">
              10
            </option>
            <option value="25">25</option>
            <option value="50">50</option>
            <option value="100">100</option>
          </select>

          <br />

          {'Released After: '}
          <select
            id="minMonth"
            onChange={() => {
              this.applyFilter('minMonth')
            }}
          >
            <option value="01">Jan</option>
            <option value="02">Feb</option>
            <option value="03">Mar</option>
            <option value="04">Apr</option>
            <option selected="selected" value="05">
              May
            </option>
            <option value="06">Jun</option>
            <option value="07">Jul</option>
            <option value="08">Aug</option>
            <option value="09">Sep</option>
            <option value="10">Oct</option>
            <option value="11">Nov</option>
            <option value="12">Dec</option>
          </select>

          <select
            id="minDay"
            onChange={() => {
              this.applyFilter('minDay')
            }}
          >
            <option selected="selected" value="01">
              1
            </option>
            <option value="02">2</option>
            <option value="03">3</option>
            <option value="04">4</option>
            <option value="05">5</option>
            <option value="06">6</option>
            <option value="07">7</option>
            <option value="08">8</option>
            <option value="09">9</option>
            <option value="10">10</option>
            <option value="11">11</option>
            <option value="12">12</option>
            <option value="13">13</option>
            <option value="14">14</option>
            <option value="15">15</option>
            <option value="16">16</option>
            <option value="17">17</option>
            <option value="18">18</option>
            <option value="19">19</option>
            <option value="20">20</option>
            <option value="21">21</option>
            <option value="22">22</option>
            <option value="23">23</option>
            <option value="24">24</option>
            <option value="25">25</option>
            <option value="26">26</option>
            <option value="27">27</option>
            <option value="28">28</option>
            <option value="29">29</option>
            <option value="30">30</option>
            <option value="31">31</option>
          </select>

          <select
            id="minYear"
            onChange={() => {
              this.applyFilter('minYear')
            }}
          >
            <option selected="selected" value="2002">
              2002
            </option>
            <option value="2003">2003</option>
            <option value="2004">2004</option>
            <option value="2005">2005</option>
            <option value="2006">2006</option>
            <option value="2007">2007</option>
            <option value="2008">2008</option>
            <option value="2009">2009</option>
            <option value="2010">2010</option>
            <option value="2011">2011</option>
            <option value="2012">2012</option>
            <option value="2013">2013</option>
            <option value="2014">2014</option>
            <option value="2015">2015</option>
            <option value="2016">2016</option>
            <option value="2017">2017</option>
            <option value="2018">2018</option>
            <option value="2019">2019</option>
            <option value="2020">2020</option>
          </select>

          <br />

          {'Released Before: '}
          <select
            id="maxMonth"
            onChange={() => {
              this.applyFilter('maxMonth')
            }}
          >
            <option value="01">Jan</option>
            <option value="02">Feb</option>
            <option value="03">Mar</option>
            <option value="04">Apr</option>
            <option value="05">May</option>
            <option value="06">Jun</option>
            <option value="07">Jul</option>
            <option value="08">Aug</option>
            <option value="09">Sep</option>
            <option value="10">Oct</option>
            <option value="11">Nov</option>
            <option selected="selected" value="12">
              Dec
            </option>
          </select>

          <select
            id="maxDay"
            onChange={() => {
              this.applyFilter('maxDay')
            }}
          >
            <option selected="selected" value="01">
              1
            </option>
            <option value="02">2</option>
            <option value="03">3</option>
            <option value="04">4</option>
            <option value="05">5</option>
            <option value="06">6</option>
            <option value="07">7</option>
            <option value="08">8</option>
            <option value="09">9</option>
            <option value="10">10</option>
            <option value="11">11</option>
            <option value="12">12</option>
            <option value="13">13</option>
            <option value="14">14</option>
            <option value="15">15</option>
            <option value="16">16</option>
            <option value="17">17</option>
            <option value="18">18</option>
            <option value="19">19</option>
            <option value="20">20</option>
            <option value="21">21</option>
            <option value="22">22</option>
            <option value="23">23</option>
            <option value="24">24</option>
            <option value="25">25</option>
            <option value="26">26</option>
            <option value="27">27</option>
            <option value="28">28</option>
            <option value="29">29</option>
            <option value="30">30</option>
            <option selected="selected" value="31">
              31
            </option>
          </select>

          <select
            id="maxYear"
            onChange={() => {
              this.applyFilter('maxYear')
            }}
          >
            <option value="2002">2002</option>
            <option value="2003">2003</option>
            <option value="2004">2004</option>
            <option value="2005">2005</option>
            <option value="2006">2006</option>
            <option value="2007">2007</option>
            <option value="2008">2008</option>
            <option value="2009">2009</option>
            <option value="2010">2010</option>
            <option value="2011">2011</option>
            <option value="2012">2012</option>
            <option value="2013">2013</option>
            <option value="2014">2014</option>
            <option value="2015">2015</option>
            <option value="2016">2016</option>
            <option value="2017">2017</option>
            <option value="2018">2018</option>
            <option value="2019">2019</option>
            <option selected="selected" value="2020">
              2020
            </option>
          </select>

          <button
            type="submit"
            onClick={() => {
              this.search()
            }}
          >
            Search
          </button>
        </div>

        <br />

        <div id="myTable" className="center">
          <div className="wrapper0">
            <div className="wrapper1">
              <div className="wrapper2">
                <div className="wrapper3">
                  <select
                    id="card"
                    className="filter"
                    onChange={() => {
                      this.applyFilter('card')
                    }}
                  >
                    <option selected="selected" value={null}>
                      All Cards
                    </option>
                    <option value="Monster">Monsters</option>
                    <option value="Spell">Spells</option>
                    <option value="Trap">Traps</option>
                  </select>
                </div>

                <div className="wrapper4">
                  <input
                    id="description"
                    className="filter"
                    placeholder="Search Card Text"
                    style={{fontSize: '14pt', size: '27pt', type: 'text'}}
                    onChange={() => {
                      this.applyFilter('description')
                    }}
                  />
                  <input
                    id="name"
                    className="filter"
                    placeholder="Search Card Name"
                    style={{fontSize: '14pt', size: '24pt', type: 'text'}}
                    onChange={() => {
                      this.applyFilter('name')
                    }}
                  />
                </div>
              </div>

              <div className="wrapper2">
                <div className="wrapper3">
                  <select
                    id="category"
                    className="filter"
                    onChange={() => {
                      this.applyFilter('category')
                    }}
                  >
                    <option selected="selected" value="">
                      Category
                    </option>
                    <option value="Continuous">Continuous</option>
                    <option value="Counter">Counter</option>
                    <option value="Effect">Effect</option>
                    <option value="Equip">Equip</option>
                    <option value="Field">Field</option>
                    <option value="Fusion">Fusion</option>
                    <option value="Link">Link</option>
                    <option value="Normal">Normal</option>
                    <option value="Pendulum">Pendulum</option>
                    <option value="Quick-Play">Quick-Play</option>
                    <option value="Ritual">Ritual</option>
                    <option value="Xyz">Xyz</option>
                  </select>

                  <select
                    id="attribute"
                    className="filter"
                    onChange={() => {
                      this.applyFilter('attribute')
                    }}
                  >
                    <option selected="selected" value="">
                      Attribute
                    </option>
                    <option value="Dark">Dark</option>
                    <option value="Divine">Divine</option>
                    <option value="Earth">Earth</option>
                    <option value="Fire">Fire</option>
                    <option value="Light">Light</option>
                    <option value="Water">Water</option>
                    <option value="Wind">Wind</option>
                  </select>
                </div>

                <div className="wrapper4">
                  <input
                    id="maxLevel"
                    className="filter"
                    placeholder="Level Max."
                    style={{fontSize: '14pt', size: '13pt', type: 'text'}}
                    onChange={() => {
                      this.applyFilter('maxLevel')
                    }}
                  />
                  <input
                    id="maxAtk"
                    className="filter"
                    placeholder="ATK Max."
                    style={{fontSize: '14pt', size: '13pt', type: 'text'}}
                    onChange={() => {
                      this.applyFilter('maxAtk')
                    }}
                  />
                  <input
                    id="maxDef"
                    className="filter"
                    placeholder="DEF Max."
                    style={{fontSize: '14pt', size: '13pt', type: 'text'}}
                    onChange={() => {
                      this.applyFilter('maxDef')
                    }}
                  />
                </div>
              </div>

              <div className="wrapper2">
                <div className="wrapper3">
                  <select
                    id="class"
                    className="filter"
                    onChange={() => {
                      this.applyFilter('class')
                    }}
                  >
                    <option selected="selected" value="">
                      Class
                    </option>
                    <option value="Effect">Effect</option>
                    <option value="Flip">Flip</option>
                    <option value="Gemini">Gemini</option>
                    <option value="Normal">Normal</option>
                    <option value="Tuner">Tuner</option>
                    <option value="Union">Union</option>
                  </select>

                  <select
                    id="subclass"
                    className="filter"
                    onChange={() => {
                      this.applyFilter('subclass')
                    }}
                  >
                    <option selected="selected" value="">
                      Sub-Class
                    </option>
                    <option value="Effect">Effect</option>
                    <option value="Flip">Flip</option>
                    <option value="Gemini">Gemini</option>
                    <option value="Normal">Normal</option>
                    <option value="Spirit">Spirit</option>
                    <option value="Toon">Toon</option>
                    <option value="Tuner">Tuner</option>
                    <option value="Union">Union</option>
                  </select>

                  <select
                    id="type"
                    className="filter"
                    onChange={() => {
                      this.applyFilter('type')
                    }}
                  >
                    <option selected="selected" value="">
                      Type
                    </option>
                    <option value="Aqua">Aqua</option>
                    <option value="Beast">Beast</option>
                    <option value="Beast-Warrior">Beast-Warrior</option>
                    <option value="Cyberse">Cyberse</option>
                    <option value="Dinosaur">Dinosaur</option>
                    <option value="Dragon">Dragon</option>
                    <option value="Fairy">Fairy</option>
                    <option value="Fiend">Fiend</option>
                    <option value="Fish">Fish</option>
                    <option value="Insect">Insect</option>
                    <option value="Machine">Machine</option>
                    <option value="Plant">Plant</option>
                    <option value="Pyro">Pyro</option>
                    <option value="Reptile">Reptile</option>
                    <option value="Rock">Rock</option>
                    <option value="Sea Serpent">Sea Serpent</option>
                    <option value="Spellcaster">Spellcaster</option>
                    <option value="Thunder">Thunder</option>
                    <option value="Warrior">Warrior</option>
                    <option value="Winged Beast">Winged Beast</option>
                    <option value="Zombie">Zombie</option>
                  </select>
                </div>

                <div className="wrapper4">
                  <input
                    id="minLevel"
                    className="filter"
                    placeholder="Level Min."
                    style={{fontSize: '14pt', size: '13', type: 'text'}}
                    onChange={() => {
                      this.applyFilter('minLevel')
                    }}
                  />
                  <input
                    id="minAtk"
                    className="filter"
                    placeholder="ATK Min."
                    style={{fontSize: '14pt', size: '13', type: 'text'}}
                    onChange={() => {
                      this.applyFilter('minAtk')
                    }}
                  />
                  <input
                    id="minDef"
                    className="filter"
                    placeholder="DEF Min."
                    style={{fontSize: '14pt', size: '13', type: 'text'}}
                    onChange={() => {
                      this.applyFilter('minDef')
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          <table id="cards">
            <tbody>
              {cardsArray.length ? (
                cardsArray.map((card, index) => {
                  return <Card key={card.id} index={index} card={card} />
                })
              ) : (
                <p />
              )}
            </tbody>
          </table>

          <button
            type="submit"
            onClick={() => {
              this.previousPage()
            }}
          >{`<<`}</button>
          {this.state.page > 3 ? (
            this.state.page >
            Math.ceil(this.props.cards.length / this.state.cardsPerPage) - 2 ? (
              <button
                type="submit"
                onClick={() => {
                  this.goToPage(
                    Math.ceil(
                      this.props.cards.length / this.state.cardsPerPage
                    ) - 4
                  )
                }}
              >
                {' '}
                {Math.ceil(this.props.cards.length / this.state.cardsPerPage) -
                  4}{' '}
              </button>
            ) : (
              <button
                type="submit"
                onClick={() => {
                  this.goToPage(this.state.page - 2)
                }}
              >
                {' '}
                {this.state.page - 2}{' '}
              </button>
            )
          ) : this.state.page === 1 ? (
            <button
              type="submit"
              style={{backgroundColor: 'black', color: 'white'}}
            >
              {' '}
              1{' '}
            </button>
          ) : (
            <button
              type="submit"
              onClick={() => {
                this.goToPage(1)
              }}
            >
              {' '}
              1{' '}
            </button>
          )}
          {this.state.page > 3 ? (
            this.state.page >
            Math.ceil(this.props.cards.length / this.state.cardsPerPage) - 2 ? (
              <button
                type="submit"
                onClick={() => {
                  this.goToPage(
                    Math.ceil(
                      this.props.cards.length / this.state.cardsPerPage
                    ) - 3
                  )
                }}
              >
                {' '}
                {Math.ceil(this.props.cards.length / this.state.cardsPerPage) -
                  3}{' '}
              </button>
            ) : (
              <button
                type="submit"
                onClick={() => {
                  this.goToPage(this.state.page - 1)
                }}
              >
                {' '}
                {this.state.page - 1}{' '}
              </button>
            )
          ) : this.state.page === 2 ? (
            <button
              type="submit"
              style={{backgroundColor: 'black', color: 'white'}}
            >
              {' '}
              2{' '}
            </button>
          ) : (
            <button
              type="submit"
              onClick={() => {
                this.goToPage(2)
              }}
            >
              {' '}
              2{' '}
            </button>
          )}
          {this.state.page > 3 ? (
            this.state.page >
            Math.ceil(this.props.cards.length / this.state.cardsPerPage) - 2 ? (
              <button
                type="submit"
                onClick={() => {
                  this.goToPage(
                    Math.ceil(
                      this.props.cards.length / this.state.cardsPerPage
                    ) - 2
                  )
                }}
              >
                {' '}
                {Math.ceil(this.props.cards.length / this.state.cardsPerPage) -
                  2}{' '}
              </button>
            ) : (
              <button
                type="submit"
                style={{backgroundColor: 'black', color: 'white'}}
              >
                {' '}
                {this.state.page}{' '}
              </button>
            )
          ) : this.state.page === 3 ? (
            <button
              type="submit"
              style={{backgroundColor: 'black', color: 'white'}}
            >
              {' '}
              3{' '}
            </button>
          ) : (
            <button
              type="submit"
              onClick={() => {
                this.goToPage(3)
              }}
            >
              {' '}
              3{' '}
            </button>
          )}
          {this.state.page > 3 ? (
            this.state.page >
            Math.ceil(this.props.cards.length / this.state.cardsPerPage) - 2 ? (
              this.state.page ===
              Math.ceil(this.props.cards.length / this.state.cardsPerPage) -
                1 ? (
                <button
                  type="submit"
                  style={{backgroundColor: 'black', color: 'white'}}
                >
                  {' '}
                  {Math.ceil(
                    this.props.cards.length / this.state.cardsPerPage
                  ) - 1}{' '}
                </button>
              ) : (
                <button
                  type="submit"
                  onClick={() => {
                    this.goToPage(
                      Math.ceil(
                        this.props.cards.length / this.state.cardsPerPage
                      ) - 1
                    )
                  }}
                >
                  {' '}
                  {Math.ceil(
                    this.props.cards.length / this.state.cardsPerPage
                  ) - 1}{' '}
                </button>
              )
            ) : (
              <button
                type="submit"
                onClick={() => {
                  this.goToPage(this.state.page + 1)
                }}
              >
                {' '}
                {this.state.page + 1}{' '}
              </button>
            )
          ) : (
            <button
              type="submit"
              onClick={() => {
                this.goToPage(4)
              }}
            >
              {' '}
              4{' '}
            </button>
          )}
          {this.state.page > 3 ? (
            this.state.page >
            Math.ceil(this.props.cards.length / this.state.cardsPerPage) - 2 ? (
              this.state.page ===
              Math.ceil(this.props.cards.length / this.state.cardsPerPage) ? (
                <button
                  type="submit"
                  style={{backgroundColor: 'black', color: 'white'}}
                >
                  {' '}
                  {Math.ceil(
                    this.props.cards.length / this.state.cardsPerPage
                  )}{' '}
                </button>
              ) : (
                <button
                  type="submit"
                  onClick={() => {
                    this.goToPage(
                      Math.ceil(
                        this.props.cards.length / this.state.cardsPerPage
                      )
                    )
                  }}
                >
                  {' '}
                  {Math.ceil(
                    this.props.cards.length / this.state.cardsPerPage
                  )}{' '}
                </button>
              )
            ) : (
              <button
                type="submit"
                onClick={() => {
                  this.goToPage(this.state.page + 2)
                }}
              >
                {' '}
                {this.state.page + 2}{' '}
              </button>
            )
          ) : (
            <button
              type="submit"
              onClick={() => {
                this.goToPage(5)
              }}
            >
              {' '}
              5{' '}
            </button>
          )}

          <button
            type="submit"
            onClick={() => {
              this.nextPage()
            }}
          >{`>>`}</button>
        </div>
      </div>
    )
  }
}

const mapState = state => {
  return {
    cards: state.cards
  }
}

const mapDispatch = dispatch => ({
  fetchAllCards: () => dispatch(fetchAllCards()),
  fetchSomeCards: filters => dispatch(fetchSomeCards(filters)),
  fetchFirstXCards: x => dispatch(fetchFirstXCards(x))
})

export default connect(mapState, mapDispatch)(CardTable)
