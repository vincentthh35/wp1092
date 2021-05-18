import React from 'react'

function Station(props) {
    const handleClick = props.handleClick
    const station_id = props.station_data.station_id;
    const station_name = props.station_data.station_name;
    const station_type = props.station_data.station_type;
    const color_dict = {
        R: 'red',
        G: 'green',
        O: 'orange',
        B: 'blue',
    }
    const color = color_dict[station_type];
    const start = (props.station_data.station_order === 1)
        ? "end"
        : "";
    const end = (props.station_data.distance_to_next === -1)
        ? "end"
        : "";
    const line = (end === "")
        ? <div className={`line ${color}`} id={`l-${station_id}`}></div>
        : "";


  return (
    <div className="station-line-container">
        <div className="station-and-name" id={`s-${station_id}`} onClick={handleClick}> {/* you should add both id and onClick to attributes */}
            <div className={`station-rectangle ${color} ${start} ${end}`} id={`id-${station_id}`}>{station_id}</div>
            <div className="station-name" id={`name-${station_id}`}>{station_name}</div>
        </div>
        { line }
    </div>
  )
}

export default Station
