import React from 'react'

export default function StationDetail({ match }) {
    return (
        <div>
            Station Detail - {match.params.stationNumber}
        </div>
    )
}
