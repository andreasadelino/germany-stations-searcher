import { MenuItem, Paper } from '@material-ui/core';
import { emphasize, makeStyles } from '@material-ui/core/styles';
import match from 'autosuggest-highlight/match';
import parse from 'autosuggest-highlight/parse';
import React, { useState, useEffect } from 'react';
import Autosuggest from 'react-autosuggest';
import "./StationSearch.css";
import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';


export default function StationSearch() {
    const [value, setValue] = useState("");
    const [suggestions, setSuggestions] = useState([]);

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

    const { data, loading, error, fetchMore } = useQuery(GET_STATIONS);

    useEffect(() => {
        fetchMore({
            variables: { searchTerm: value },
            updateQuery: (prev, { fetchMoreResult }) => {
                if (!fetchMoreResult) return prev;
                const result = {
                    fetchMoreResult,
                    stations: [
                        ...prev.search.stations,
                        ...fetchMoreResult.search.stations,
                    ],
                }
                // console.log(fetchMoreResult.search.stations);
                setSuggestions(fetchMoreResult.search.stations);
                return result;
            }
        });

    }, [value])

    const stations = [];

    // Teach Autosuggest how to calculate suggestions for any given input value.
    async function getSuggestions(value) {
        const inputValue = value.trim().toLowerCase();
        const inputLength = inputValue.length;

        // DAR UM SETSTATE AQUI E VER O QUE DÁ.VER COMO O COMPONENTE SE COMPORTA
        // USANDO UM METODO VOID AQUI
        return inputLength === 0
            ? []
            : stations.filter(station =>
                station.name.toLowerCase().slice(0, inputLength) === inputValue
            );
    };

    // When suggestion is clicked, Autosuggest needs to populate the input
    // based on the clicked suggestion. Teach Autosuggest how to calculate the
    // input value for every given suggestion.
    const getSuggestionValue = suggestion => {
        return suggestion.name;
    };

    // Use your imagination to render suggestions.
    function renderSuggestion(suggestion, { query, isHighlighted }) {
        const matches = match(suggestion.name, query);
        const parts = parse(suggestion.name, matches);

        return (
            <MenuItem selected={isHighlighted} component="div">
                <div>
                    {parts.map(part => (
                        <span key={part.text} style={{ fontWeight: part.highlight ? 700 : 400 }}>
                            {part.text}
                        </span>
                    ))}
                </div>
            </MenuItem>
        );
    }

    function onChange(event, { newValue, method }) {
        setValue(newValue);
    }

    // Autosuggest will call this function every time you need to update suggestions.
    // You already implemented this logic above, so just use it.
    function onSuggestionsFetchRequested({ value }) {
        // getSuggestions(value);
        // console.log(value)
    }

    // Autosuggest will call this function every time you need to clear suggestions.
    function onSuggestionsClearRequested() {
        setSuggestions([]);
    }

    const useStyles = makeStyles(theme => ({
        root: {
            height: 250,
            flexGrow: 1,
        },
        container: {
            position: 'relative',
        },
        suggestionsContainerOpen: {
            position: 'absolute',
            zIndex: 1,
            marginTop: theme.spacing(0),
            left: 0,
            right: 0,
        },
        suggestion: {
            display: 'block',
        },
        suggestionsList: {
            margin: 0,
            padding: 0,
            listStyleType: 'none',
        },
        divider: {
            height: theme.spacing(2),
        },
    }));

    const classes = useStyles();

    const inputProps = {
        classes,
        id: 'station-autosuggest',
        label: 'Station',
        placeholder: 'Search a station',
        value,
        onChange,
    }

    const autosuggestProps = {
        suggestions: suggestions,
        onSuggestionsFetchRequested: onSuggestionsFetchRequested,
        onSuggestionsClearRequested: onSuggestionsClearRequested,
        getSuggestionValue: getSuggestionValue,
        renderSuggestion: renderSuggestion,
    }

    return (
        <div className="search-container">
            <span className="info">Germany Station Search</span>
            <div className="input-suggestion">
                <Autosuggest
                    {...autosuggestProps}
                    inputProps={inputProps}
                    theme={{
                        container: classes.container,
                        suggestionsContainerOpen: classes.suggestionsContainerOpen,
                        suggestionsList: classes.suggestionsList,
                        suggestion: classes.suggestion,
                    }}
                    renderSuggestionsContainer={options => (
                        <Paper {...options.containerProps} square>
                            {options.children}
                        </Paper>
                    )}
                />
            </div>
            {loading && <span className="info">Carregando...</span>}
        </div>
    )
}
