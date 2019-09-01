import React from 'react'
import gql from 'graphql-tag';
import { Container, Box, Link, Typography } from '@material-ui/core';
import { useQuery } from '@apollo/react-hooks';

import "./StationDetail.css"

export default function StationDetail({ match }) {

    const STATION_DETAIL = gql`
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

    const { data, loading } = useQuery(STATION_DETAIL, { variables: { evaId: match.params.stationNumber } });

    if (loading) {
        return (
            <Box width="md">
                <strong>Loading data...</strong>
            </Box>
        );
    }

    const station = data.stationWithEvaId;

    return (
        <Container maxWidth="md">
            <Box width="md">
                <span>Name: </span> {station.name}
                <br />
                {station.picture &&
                    <img src={station.picture.url} alt="Station Pic" />}

                <p> Parking: {station.hasParking.toString()} </p>
                <p> Bicycle Parking: {station.hasBicycleParking.toString()} </p>
                <p> Local Public Transport: {station.hasLocalPublicTransport.toString()} </p>
                <p> Wifi: {station.hasWiFi.toString()} </p>
                <p> Car Rental: {station.hasCarRental.toString()} </p>

            </Box>
            <Box>
                <Typography>
                    <Link href="/"> Voltar </Link>
                </Typography>
            </Box>
        </Container>
    )
}
