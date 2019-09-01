import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import debounce from "lodash/debounce";
import React, { useState } from 'react';
import AsyncSelect from 'react-select/async';
import "./StationSearch.css";
import { emphasize, makeStyles, useTheme } from '@material-ui/core/styles';
import { Container, Typography, Box, Card, CardContent, CardActions, Button, Link } from '@material-ui/core';


export default function StationSearch({ history }) {

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
                    callback(data.search.stations);
                } else {
                    callback([]);
                }
            }, ({ message }) => {
                console.log("Server Error:", message)
            });
        }, 250);
    }

    const debouncedLoadOptions = debounce(fetchData, 250);

    function onSelect(inputValue) {
        console.log(inputValue);
        setStation(inputValue);
    }

    function goToDetail() {
        // alert(station.name);
        history.push(`station/${station.primaryEvaId}`);
    }

    return (
        <Container maxWidth="sm" className="search-container">
            <Typography variant="h5" component="h1">Germany Station Search</Typography>
            {/* <span className="info">Germany Station Search</span> */}
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
                    loadOptions={debouncedLoadOptions}
                    openMenuOnClick={false}
                    components={
                        {
                            DropdownIndicator: () => null,
                            IndicatorSeparator: () => null
                        }
                    }
                />
            </Box>

            {/* Card */}
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
                        <Button size="small" color="primary" onClick={goToDetail}>More details</Button>
                    </CardActions>
                </Card>
            }
        </Container>
    );
}
