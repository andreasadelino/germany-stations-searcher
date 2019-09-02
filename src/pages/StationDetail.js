import React from 'react'
import gql from 'graphql-tag';
import { Container, Box, Link, Typography, SvgIcon, Button } from '@material-ui/core';
import { useQuery } from '@apollo/react-hooks';
import { makeStyles } from '@material-ui/core/styles';

import WifiIcon from '@material-ui/icons/Wifi';
import DirectionsBikeIcon from '@material-ui/icons/DirectionsBike';
import DirectionsBusIcon from '@material-ui/icons/DirectionsBus';
import LocalParkingIcon from '@material-ui/icons/LocalParking';
import DirectionsCarIcon from '@material-ui/icons/DirectionsCar';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';

import "./StationDetail.css"
import { classes } from 'istanbul-lib-coverage';

export default function StationDetail({ match, history }) {

    const useStyles = makeStyles(theme => ({
        backButton: {
            fontSize: 18,
            fontWeight: "bold",
            margin: "20px 0"
        }
    }));

    const classes = useStyles();

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

    const { data, loading } = useQuery(STATION_DETAIL, {
        variables: {
            evaId: match.params.stationNumber
        }
    });

    if (loading) {
        return (
            <Box width="md">
                <strong>Loading data...</strong>
            </Box>
        );
    }

    const station = data.stationWithEvaId;


    function goToHome() {
        history.push("/");
    }

    return (
        <Container maxWidth="md">
            <Box width="md">
                <span>Name: </span> {station.name}
                <br />
                {station.picture &&
                    <img src={station.picture.url} alt="Station Pic" />}
            </Box>
            <Box width="md">

                {station.hasWifi && <WifiIcon></WifiIcon>}
                {station.hasBicycleParking && <DirectionsBikeIcon></DirectionsBikeIcon>}
                {station.hasLocalPublicTransport && <DirectionsBusIcon></DirectionsBusIcon>}
                {station.hasParking && <LocalParkingIcon></LocalParkingIcon>}
                {station.hasCarRental && <DirectionsCarIcon></DirectionsCarIcon>}
            </Box>

            <Box>
                <Button
                    variant="contained"
                    color="default"
                    className={classes.backButton}
                    onClick={goToHome}>
                    <ArrowBackIcon />
                    Back
                </Button>
            </Box>
        </Container>
    )
}
