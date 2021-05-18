import React from 'react'

function StationInfo(props) {
    const station_info = props.station_info
  const labels = [
    { label: '車站名稱', value: 'station_name' },
    { label: '車站位址', value: 'address' },
    { label: '詢問處位置', value: 'service_counter' },
    { label: '自行車進出', value: 'enable_bicycle' }
  ]
  let info = "";

  if (station_info) {
      info = labels.map( (e) => <tr key={`tr-${e.value}`}><td id={`table-${e.value}-label`}>{ e.label }</td><td id={`table-${e.value}-value`}>{ station_info[e.value] }</td></tr> )
  }

  return (
    <div className="station-info-container">
        <table className="station-info-table">
            <thead>
                <tr>
                    <th colSpan="2">車站資訊</th>
                </tr>
            </thead>
            <tbody>
                { info }
            </tbody>
        </table>
    </div>
  )
}

export default StationInfo
