import gql from 'graphql-tag';

export const STATION_DATA = gql`
    fragment StationTile on Station {
        name
        stationNumber
    }`
;