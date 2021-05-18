import React, { useState, useEffect } from 'react'
import RouteGraph from '../components/routeGraph'
import StationInfo from '../components/stationInfo'
import axios from 'axios'
import '../styles/App.css'

const API_ROOT = 'http://localhost:4000/api'
const instance = axios.create({
  baseURL: API_ROOT,
  withCredentials: true
})

function App() {
  // sample structure of data
  // data: {
  //   R: [],
  //   G: []
  // }
  const [data, setData] = useState({}) // all MRT station data
  const [current_station_id, setCurrentStationId] = useState('None') // station clicked by cursor
  const [start_station, setStartStation] = useState('') // station selected as the starting one
  const [end_station, setEndStation] = useState('') // station selected as the ending one
  const [distance, setDistance] = useState(-2) // distance shown on the screen

  const station_type = current_station_id[0] // R10, station_type = R
  const station_order = current_station_id.slice(1, current_station_id.length) // R10, station_order = 10
  const station_info = current_station_id[0] !== 'N' ? data[station_type][parseInt(station_order) - 1] : null // get certain station information

  const getStations = async () => {
    // fetch data from database via backend
    // coding here ...
    const temp_data = await instance.get('/getStations');
    if (Object.keys(temp_data.data.data).length) {
        setData(temp_data.data.data);
    }
  }

  const calculateDistance = async () => {
    // send start and end stations to backend and get distance
    // coding here ...
    const res = await instance.get(`/calculateDistance?start=${start_station}&end=${end_station}`)
    setDistance(res.data.distance)
  }

  const handleClick = (e) => {
      console.log(e.target.id.split('-')[1]);
      const station_id = e.target.id.split('-')[1];
      setCurrentStationId(station_id);
  }


  // fetch data here after 1st render
  // coding here ...
  useEffect(() => {
      getStations()
  }, []);

  if (!Object.keys(data).length) {
    return (
      <div className="wrapper">
          <div className="welcome-title"><h1>Welcome to MRT Distance Calculator !</h1></div>
      </div>
    )
} else {
    let route_graph = Object.keys(data).map(e => <RouteGraph route_data={data[e]} />)
}
    let distance_class = "";
    let distance_display;
    if (distance === -2) {
        distance_display = ""
    } else if (distance === -1) {
        distance_class = 'invalid'
        distance_display = "INVALID"
    } else {
        distance_display = distance;
    }
  return (
    <div className="wrapper">
        <div className="welcome-title"><h1>Welcome to MRT Distance Calculator !</h1></div>
        <div className="calculator-container">
            <div className="mode-selector">

                <span id="start-station-span">起始站</span>
                <select id="start-select" className="start-station" onChange={e => setStartStation(e.target.value)}> {/* you should add both onChange and value to attributes */}
                    <option></option>
                    {
                        // generate options of all stations within option group
                        // coding here ...
                        Object.keys(data).map(e => <optgroup label={e} key={`opts-${e}`}>{data[e].map( ee => <option id={`start-group-${ee.station_id}`} key={`sg-${ee.station_id}`} value={ee.station_id}>{ee.station_name}</option> )}</optgroup>)
                    }
                </select>

                <span id="end-station-span">終點站</span>
                <select id="end-select" className="end-station" onChange={e => setEndStation(e.target.value)}> {/* you should add both onChange and value to attributes */}
                    <option></option>
                    {
                        // generate options of all stations within option group
                        // coding here ...
                        Object.keys(data).map(e => <optgroup label={e} key={`opte-${e}`}>{data[e].map( ee => <option id={`end-group-${ee.station_id}`} key={`eg-${ee.station_id}`} value={ee.station_id}>{ee.station_name}</option> )}</optgroup>)
                    }
                </select>

                <button onClick={calculateDistance} id="search-btn">查詢距離</button>
                <span id="answer" className={distance_class}> {/* you should add className to attributes */}
                    {distance_display}
                </span>
                <span id="answer-postfix">KM</span>
            </div>

            <div className="route-graph-info-container">
                {Object.keys(data).map(e => <RouteGraph route_data={data[e]} handleClick={handleClick} key={e}/>)}
                {/* <RouteGraph route_data={data.R} /> {/* you should pass data to child component with your own customized parameters */}
                {/* <RouteGraph route_data={data.G} /> {/* you should pass data to child component with your own customized parameters */}
                <StationInfo station_info={station_info}/> {/* you should pass data to child component with your own customized parameters */}
            </div>

        </div>
    </div>
  )
}

export default App
