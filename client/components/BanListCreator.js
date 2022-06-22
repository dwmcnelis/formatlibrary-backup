
import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { capitalize } from '../../functions/utility'

const BanListCreator = () => {
    const [month, setMonth] = useState(null)
    const [year, setYear] = useState(null)
    const [previous, setPrevious] = useState(null)
    const [changes, setChanges] = useState([])
    const [banlists, setBanlists] = useState([])
    const [card, setCard] = useState(null)
    const [prevStatus, setPrevStatus] = useState(null)
    const [newStatus, setNewStatus] = useState(null)
    const [cards, setCards] = useState([])

    // RESET
    const reset = async () => {
        setMonth(null)  
        setYear(null)  
        setPrevious(null)  
        setChanges([])  
        setCard(null)  
        setPrevStatus(null)  
        setNewStatus(null) 
        setCards([])   

        document.getElementById('card').value = null
        document.getElementById('new-status').value = null
    }

    // CREATE
    const create = async () => {
        if (!date) return alert('Please select a Date.')
        
        try {
            const { data } = await axios.post('/api/banlists/create', {
                month: month,
                year: year,
                changes: changes,
                previous: previous
            })

            alert(`Success! Added ${data} Cards to the ${month}${year} Ban List`)
            return reset()
        } catch (err) {
            console.log(err)
        }
    }

    // FIND CARDS
    const findCards = async (query) => {
        const {data} = await axios.get(`/api/cards/query/${query}`) 
        setCards(data)
        if (data[0]) {  
            setCard(data[0].name)
            getStatus(data[0].name)
        }
    }

    // GET STATUS
    const getStatus = async (name) => {
        const {data} = await axios.get(`/api/statuses/query`, {
            headers: {
                name: name,
                banlist: previous
            }
        })

        if (data) setPrevStatus(data.restriction)
    }

    // ADD CHANGE
    const addChange = async () => {
        const change = {
            name: card,
            prevStatus: prevStatus,
            newStatus: newStatus
        }

        setChanges([...changes, change])
        document.getElementById('card').value = null
        document.getElementById('new-status').value = null
        setCard(null)
        setCards([])
        setPrevStatus(null)
        setNewStatus(null)
    }

    // DELETE CHANGE
    const deleteChange = async (index) => {
        changes.splice(index, 1)
        setChanges([...changes])
    }

    // USE EFFECT
    useEffect(() => {
        const fetchBanlists = async () => {
            const {data} = await axios.get(`/api/banlists/all`)
            setBanlists(data)
        }
        
        fetchBanlists()
    }, [])

    return (
        <div className="admin-portal">

            <label>Month:
                <select
                    id="month"
                    className="login"
                    onChange={(e) => setMonth(e.target.value)}
                >
                    <option value={null}></option>
                    <option value="jan">January</option>
                    <option value="feb">February</option>
                    <option value="mar">March</option>
                    <option value="apr">April</option>
                    <option value="may">May</option>
                    <option value="jun">June</option>
                    <option value="jul">July</option>
                    <option value="aug">August</option>
                    <option value="sep">September</option>
                    <option value="oct">October</option>
                    <option value="nov">November</option>
                    <option value="dec">December</option>
                </select>
            </label>

            <label>Year:
                <select
                    id="year"
                    className="login"
                    onChange={(e) => setYear(e.target.value)}
                >
                    <option value={null}></option>
                    <option value="22">2022</option>
                    <option value="21">2021</option>
                    <option value="20">2020</option>
                    <option value="19">2019</option>
                    <option value="18">2018</option>
                    <option value="17">2017</option>
                    <option value="16">2016</option>
                    <option value="15">2015</option>
                    <option value="14">2014</option>
                    <option value="13">2013</option>
                    <option value="12">2012</option>
                    <option value="11">2011</option>
                    <option value="10">2010</option>
                    <option value="09">2009</option>
                    <option value="08">2008</option>
                    <option value="07">2007</option>
                    <option value="06">2006</option>
                    <option value="05">2005</option>
                    <option value="04">2004</option>
                    <option value="03">2003</option>
                    <option value="02">2002</option>
                </select>
            </label>

            <label>Previous List:
                <select
                    id="previous"
                    className="login"
                    onChange={(e) => setPrevious(e.target.value)}
                >
                <option value={null}></option>
                {
                    banlists.map((e) => <option value={e}>{e}</option>)
                }
                </select>
            </label>

            <table>
                <thead>
                    <tr>
                        <th>Card</th>
                        <th>Old Status</th>
                        <th>New Status</th>
                    </tr>
                </thead>
                <tbody>
                {
                    changes.map((c, index) => (
                        <tr>
                            <td>{c.name}</td>
                            <td>{prevStatus ? capitalize(c.prevStatus) : 'N/A'}</td>
                            <td>{capitalize(c.newStatus)}</td>
                            <td><div onClick={() => deleteChange(index)}>Delete</div></td>
                        </tr>
                    ))
                }
                    <tr>
                        <td>
                            <input
                                id="card"
                                className="login"
                                defaultValue={null}
                                type="search"
                                onKeyDown={(e) => { if (e.key === 'Enter') findCards(e.target.value, null)}}
                            />

                            <select
                                className="login"
                                onChange={(e) => {
                                    setCard(e.target.value)
                                    getStatus(e.target.value)}
                                }
                            >
                            {
                                cards.map((e) => <option value={e.name}>{e.name}</option>)
                            }
                            </select>
                        </td>
                        
                        <td className="align-top">{prevStatus ? capitalize(prevStatus) : 'N/A'}</td>
                        
                        <td>
                            <select
                                id="new-status"
                                defaultValue={null}
                                className="login"
                                onChange={(e) => setNewStatus(e.target.value)}
                            >
                                <option value={null}></option>
                                <option value="forbidden">Forbidden</option>
                                <option value="limited">Limited</option>
                                <option value="semi-limited">Semi-Limited</option>
                                <option value="unlimited">Unlimited</option>
                            </select>
                        </td>
                        <td onClick={() => addChange()}>Add</td>
                    </tr>
                </tbody>
            </table>

            <a
                className="admin-button"
                type="submit"
                onClick={() => create()}
            >
                Submit
            </a>
        </div>
    )
}

export default BanListCreator