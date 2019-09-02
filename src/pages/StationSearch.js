import { useQuery } from '@apollo/react-hooks';
import { Box, Button, Card, CardActions, CardContent, Container, Typography, Link, List, ListItem, ListItemText } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import gql from 'graphql-tag';
import React, { useState } from 'react';
import { connect } from "react-redux";
import AsyncSelect from 'react-select/async';
import "./StationSearch.css";


function StationSearch({ history, stations, dispatch }) {

    let timer = null;
    const [station, setStation] = useState(null);
    const useStyles = makeStyles({
        card: {
            minWidth: 400,
            margin: "30px 0"
        },
        bullet: {
            display: 'inline-block',
            margin: '0 2px',
            transform: 'scale(0.8)',
        },
        title: {
            fontSize: 14,
        },
        stationName: {
            fontSize: 18
        },
        pos: {
            marginBottom: 12,
        },
        goToDetail: {
            cursor: "pointer"
        }
    });

    const classes = useStyles();

    const GET_STATIONS = gql`
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

    const { refetch, loading } = useQuery(GET_STATIONS, { skip: true });

    function fetchData(inputValue, callback) {
        clearTimeout(timer);

        timer = setTimeout(() => {
            const response = refetch({ searchTerm: inputValue });

            response.then(({ data }) => {
                if (data) {
                    callback(_sortStations(data.search.stations));
                } else {
                    callback([]);
                }
            }, ({ message }) => {
                console.log("Server Error:", message)
            });
        }, 250);
    }

    function _sortStations(stations) {
        return stations.sort((a, b) => a.name.localeCompare(b.name));
    }

    function onSelect(inputValue, action) {
        if (action.action === "select-option") {
            setStation(inputValue);
        } else {
            setStation(null);
        }
    }

    function goToDetail(station) {
        dispatch(addStation(station));
        history.push(`station/${station.primaryEvaId}`);
    }

    function addStation(station) {
        return {
            type: "SAVE_STATION_SEARCH",
            station
        };
    }

    return (
        <Container maxWidth="sm" className="search-container">
            <Typography variant="h5" component="h1">German Station Search</Typography>
            <Box className="select-async">
                <AsyncSelect
                    cacheOptions
                    isClearable
                    loadingMessage={() => "Fetching stations. Please wait..."}
                    noOptionsMessage={() => "No station finded..."}
                    getOptionLabel={(option) => option.name}
                    getOptionValue={(option) => option.primaryEvaId}
                    onChange={onSelect}
                    placeholder="Type a station..."
                    loadOptions={fetchData}
                    openMenuOnClick={false}
                    components={
                        {
                            DropdownIndicator: () => null,
                            IndicatorSeparator: () => null
                        }
                    }
                />
            </Box>

            {station &&
                <Card className={classes.card}>
                    <CardContent>
                        <Typography className={classes.title} color="textSecondary" gutterBottom>
                            Station name
                        </Typography>
                        {/* <Typography variant="h5" component="h2"></Typography> */}
                        <Typography className={classes.stationName} color="textPrimary" gutterBottom>
                            {station.name}
                        </Typography>

                        <Typography className={classes.title} color="textSecondary" gutterBottom>
                            Location
                        </Typography>

                        <Typography variant="body2" component="p" gutterBottom>
                            {`${station.mailingAddress.city}, ${station.mailingAddress.street}`}
                        </Typography>
                        <Typography variant="body2" component="p" gutterBottom>
                            {station.regionalArea.name}
                        </Typography>
                    </CardContent>
                    <CardActions>
                        <Button size="small" color="primary" onClick={() => goToDetail(station)}>More details</Button>
                    </CardActions>
                </Card>
            }

            {stations.length > 0 &&
                <Box>
                    Previous :
                    <List>
                        {stations.map(previousSearchedStation => (
                            <ListItem
                                key={previousSearchedStation.primaryEvaId}
                                alignItems="flex-start">
                                <ListItemText
                                    onClick={() => goToDetail(previousSearchedStation)} >
                                    {previousSearchedStation.name}
                                </ListItemText>
                            </ListItem>
                        ))}
                    </List>
                </Box>}
        </Container>
    );
}

export default connect(state => ({ stations: state }))(StationSearch);