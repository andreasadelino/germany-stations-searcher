import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import debounce from "lodash/debounce";
import React from 'react';
import AsyncSelect from 'react-select/async';
import "./StationSearch.css";
import { emphasize, makeStyles, useTheme } from '@material-ui/core/styles';

export default function SelectAsync() {
    let timer = null;
    const theme = useTheme();

    const useStyles = makeStyles(theme => ({
        root: {
            flexGrow: 1,
            height: 250,
            minWidth: 290,
        },
        input: {
            display: 'flex',
            padding: 0,
            height: 'auto',
        },
        valueContainer: {
            display: 'flex',
            flexWrap: 'wrap',
            flex: 1,
            alignItems: 'center',
            overflow: 'hidden',
        },
        chip: {
            margin: theme.spacing(0.5, 0.25),
        },
        chipFocused: {
            backgroundColor: emphasize(
                theme.palette.type === 'light' ? theme.palette.grey[300] : theme.palette.grey[700],
                0.08,
            ),
        },
        noOptionsMessage: {
            padding: theme.spacing(1, 2),
        },
        singleValue: {
            fontSize: 16,
        },
        placeholder: {
            position: 'absolute',
            left: 2,
            bottom: 6,
            fontSize: 16,
        },
        paper: {
            position: 'absolute',
            zIndex: 1,
            marginTop: theme.spacing(1),
            left: 0,
            right: 0,
        },
        divider: {
            height: theme.spacing(2),
        },
    }));

    const classes = useStyles();

    const GET_STATIONS = gql`
        query stationSearch($searchTerm: String) {
            search(searchTerm: $searchTerm) {
                     stations {
                        name
                        primaryEvaId
                        stationNumber
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
                callback(data.search.stations);
            }, ({ message }) => {
                console.log("Server Error:", message)
            });
        }, 250);
    }

    const debouncedLoadOptions = debounce(fetchData, 250);

    function onSelect(inputValue) {
        console.log(inputValue);
    }

    const selectStyles = {
        input: base => ({
            ...base,
            color: theme.palette.text.primary,
            '& input': {
                font: 'inherit',
            },
        }),
    };

    return (
        <div className="search-container">
            <span className="info">Germany Station Search</span>
            <div className="select-async">
                <AsyncSelect
                    classes={classes}
                    cacheOptions
                    isClearable
                    loadingMessage={() => "Fetching stations. Please wait..."}
                    noOptionsMessage={() => "No station finded..."}
                    getOptionLabel={(option) => option.name}
                    onChange={onSelect}
                    placeholder="Type a station..."
                    loadOptions={debouncedLoadOptions}
                    openMenuOnClick={false}
                    styles={selectStyles}
                    components={
                        {
                            DropdownIndicator: () => null,
                            IndicatorSeparator: () => null
                        }
                    }
                />
            </div>
        </div >
    );
}