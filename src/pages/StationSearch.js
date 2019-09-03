import { useQuery } from '@apollo/react-hooks';
import {
    Box,
    Button,
    Card,
    CardActions,
    CardContent,
    List,
    ListItem,
    ListItemText,
    MenuItem,
    Paper,
    TextField,
    Typography
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import React, { useState } from 'react';
import { connect } from "react-redux";
import AsyncSelect from 'react-select/async';
import { GET_STATIONS } from '../queries';

const useStyles = makeStyles(theme => ({
    card: {
        minWidth: 400,
        margin: "30px 0"
    },
    title: {
        fontSize: 14,
    },
    stationName: {
        fontSize: 18
    },
    goToDetail: {
        cursor: "pointer"
    },
    container: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
    },
    resultBox: {
        display: "flex",
        width: 968,
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#fff",
    },
    searchBox: {
        marginTop: 50,
        borderRadius: 4,
        maxWidth: 400,
        width: "100%",
        padding: 20,
    },
    infoBox: {
        display: "flex",
        flexDirection: "row",
        padding: 20
    },
    input: {
        display: 'flex',
        height: 'auto',
        padding: 0,
    },
    placeholder: {
        position: 'absolute',
        color: "#999",
        left: 12,
        bottom: 10,
        fontSize: 16,
    },
    valueContainer: {
        display: 'flex',
        flexWrap: 'wrap',
        flex: 1,
        alignItems: 'center',
        overflow: 'hidden',
        marginLeft: 8,
        marginBottom: 10,
        fontSize: 16
    },
    singleValue: {
        fontSize: 16,
        marginLeft: 3,
        margin: 0,
        padding: 0
    },
    paper: {
        position: 'absolute',
        zIndex: 1,
        marginTop: theme.spacing(1),
        left: 0,
        right: 0,
    },
}));

function StationSearch({ history, stations, dispatch }) {

    let timer = null;
    const [station, setStation] = useState(null);
    const classes = useStyles();
    const { refetch, loading } = useQuery(GET_STATIONS, { skip: true });

    function Menu(props) {
        return (
            <Paper square className={classes.paper} {...props.innerProps}>
                {props.children}
            </Paper>
        );
    }

    function SingleValue(props) {
        return (
            <Typography className={classes.singleValue} {...props.innerProps}>
                {props.children}
            </Typography>
        );
    }

    function ValueContainer(props) {
        return <div className={classes.valueContainer}>{props.children}</div>;
    }

    function Placeholder(props) {
        const { selectProps, innerProps = {}, children } = props;
        return (
            <Typography color="textSecondary" className={classes.placeholder} {...innerProps}>
                {children}
            </Typography>
        );
    }

    function Option(props) {
        return (
            <MenuItem
                ref={props.innerRef}
                selected={props.isFocused}
                component="div"
                style={{
                    fontWeight: props.isSelected ? 500 : 400,
                }}
                {...props.innerProps}
            >
                {props.children}
            </MenuItem>
        );
    }

    function inputComponent({ inputRef, ...props }) {
        return <div ref={inputRef} {...props} />;
    }

    function Control(props) {
        const {
            children,
            innerProps,
            innerRef,
            selectProps: { TextFieldProps }
        } = props;

        return (
            <TextField
                fullWidth
                InputProps={{
                    inputComponent,
                    inputProps: {
                        className: classes.input,
                        ref: innerRef,
                        children,
                        ...innerProps,
                    },
                }}
                {...TextFieldProps}
            />
        );
    }

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
            dispatch(addStation(inputValue));
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

    const components = {
        DropdownIndicator: () => null,
        IndicatorSeparator: () => null,
        Option,
        Control,
        Placeholder,
        ValueContainer,
        SingleValue,
        Menu
    };

    return (
        <Box className={classes.container}>
            <Box display="flex" justifyContent="center" >
                <Typography
                    variant="h5"
                    component="h1">German Station Search
                    </Typography>
            </Box>
            <Box className={classes.resultBox}>
                <Box className={classes.searchBox}>
                    <AsyncSelect
                        styles={{
                            clearIndicator: defaults => ({
                                ...defaults,
                                cursor: "pointer"
                            })
                        }}
                        TextFieldProps={{
                            label: 'Station',
                            InputLabelProps: {
                                htmlFor: 'react-select-single',
                                shrink: true,
                            },
                        }}
                        cacheOptions
                        isClearable
                        loadingMessage={() => "Fetching results. Please wait..."}
                        noOptionsMessage={() => "No station finded..."}
                        getOptionLabel={(option) => option.name}
                        getOptionValue={(option) => option.primaryEvaId}
                        onChange={onSelect}
                        placeholder="Type a station..."
                        loadOptions={fetchData}
                        openMenuOnClick={false}
                        components={components}
                    />
                </Box>
                <Box className={classes.infoBox}>
                    {station &&
                        <Box>
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
                        </Box>
                    }

                    {stations.length > 0 &&
                        <Box>
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
                </Box>
            </Box>
        </Box>
    );
}

export default connect(state => ({ stations: state }))(StationSearch);