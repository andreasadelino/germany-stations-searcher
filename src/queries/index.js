import gql from 'graphql-tag';

export const GET_STATIONS = gql`
        query stationSearch($searchTerm: String) {
            search(searchTerm: $searchTerm) {
                     stations {
                        name
                        primaryEvaId
                        stationNumber
                        federalState
                        mailingAddress {
                            city
                            zipcode
                            street
                        }
                        regionalArea {
                            name
                            shortName
                        }                        
                }
            }
        }
    `;

export const STATION_DETAIL = gql`
        query stationById($evaId: Int!) {
            stationWithEvaId(evaId: $evaId) {
                primaryEvaId
                name
                stationNumber
                hasParking
                hasBicycleParking
                hasLocalPublicTransport
                hasWiFi
                hasCarRental
                picture {
                    url
                }
                location {
                    latitude
                    longitude
                }
                mailingAddress {
                    city
                    zipcode
                    street
                }
                regionalArea {
                    name
                    shortName
                }
            }
        }
    `;