import { MenuItem, Paper } from '@material-ui/core';
import { emphasize, makeStyles } from '@material-ui/core/styles';
import match from 'autosuggest-highlight/match';
import parse from 'autosuggest-highlight/parse';
import React, { useState } from 'react';
import Autosuggest from 'react-autosuggest';
import "./StationSearch.css";


export default function StationSearch() {
    const [value, setValue] = useState("");
    const [suggestions, setSuggestions] = useState([]);

    const stations = [
        {
            "name": "Alte Veste",
            "stationNumber": 77,
            "facilities": []
        },
        {
            "name": "Alte Wöhr",
            "stationNumber": 78,
            "facilities": [
                {
                    "description": "zu Gleis 1/2 (S-Bahn)",
                    "type": "ELEVATOR"
                }
            ]
        },
        {
            "name": "Altefähr",
            "stationNumber": 79,
            "facilities": []
        },
        {
            "name": "Altena (Westf)",
            "stationNumber": 80,
            "facilities": [
                {
                    "description": "zu Gleis 1/2",
                    "type": "ELEVATOR"
                },
                {
                    "description": "von EG zu Tunnel",
                    "type": "ELEVATOR"
                }
            ]
        },
        {
            "name": "Altenahr",
            "stationNumber": 81,
            "facilities": []
        },
        {
            "name": "Altenau (Bay)",
            "stationNumber": 82,
            "facilities": []
        },
        {
            "name": "Altenbach",
            "stationNumber": 83,
            "facilities": []
        },
        {
            "name": "Altenbamberg",
            "stationNumber": 84,
            "facilities": []
        },
        {
            "name": "Altenbeken",
            "stationNumber": 85,
            "facilities": [
                {
                    "description": "zu Gleis 1/21",
                    "type": "ELEVATOR"
                },
                {
                    "description": "zu Gleis 22/23",
                    "type": "ELEVATOR"
                }
            ]
        },
        {
            "name": "Kurort Altenberg (Erzgeb)",
            "stationNumber": 86,
            "facilities": []
        },
        {
            "name": "Altenberge",
            "stationNumber": 87,
            "facilities": []
        },
        {
            "name": "Felsberg-Altenbrunslar",
            "stationNumber": 88,
            "facilities": []
        },
        {
            "name": "Altenburg",
            "stationNumber": 89,
            "facilities": [
                {
                    "description": "zu Gleis 2/3",
                    "type": "ELEVATOR"
                }
            ]
        },
        {
            "name": "Altenerding",
            "stationNumber": 94,
            "facilities": []
        },
        {
            "name": "Altenfeld (Rhön)",
            "stationNumber": 95,
            "facilities": []
        },
        {
            "name": "Altenglan",
            "stationNumber": 96,
            "facilities": []
        },
        {
            "name": "Altengörs",
            "stationNumber": 97,
            "facilities": []
        },
        {
            "name": "Lennestadt-Altenhundem",
            "stationNumber": 104,
            "facilities": [
                {
                    "description": "zu Gleis 1/2",
                    "type": "ELEVATOR"
                },
                {
                    "description": "von EG zu Tunnel",
                    "type": "ELEVATOR"
                },
                {
                    "description": "zu Gleis 3",
                    "type": "ELEVATOR"
                }
            ]
        },
        {
            "name": "Altenkirchen (Westerw)",
            "stationNumber": 105,
            "facilities": []
        },
        {
            "name": "Altenseelbach",
            "stationNumber": 108,
            "facilities": []
        },
        {
            "name": "Altenstadt (Hess)",
            "stationNumber": 109,
            "facilities": []
        },
        {
            "name": "Altenstadt (Iller)",
            "stationNumber": 110,
            "facilities": []
        },
        {
            "name": "Altentreptow",
            "stationNumber": 111,
            "facilities": []
        },
        {
            "name": "Altenwillershagen",
            "stationNumber": 113,
            "facilities": []
        },
        {
            "name": "Altersbach",
            "stationNumber": 114,
            "facilities": []
        },
        {
            "name": "Baltersweiler",
            "stationNumber": 391,
            "facilities": []
        },
        {
            "name": "Berlin Anhalter Bahnhof",
            "stationNumber": 525,
            "facilities": []
        },
        {
            "name": "Breitscheidt (Kr Altenkirchen)",
            "stationNumber": 853,
            "facilities": []
        },
        {
            "name": "Dessau-Alten",
            "stationNumber": 1176,
            "facilities": []
        },
        {
            "name": "Essen-Altenessen",
            "stationNumber": 1694,
            "facilities": [
                {
                    "description": "zu Gleis 1/2",
                    "type": "ELEVATOR"
                }
            ]
        },
        {
            "name": "Haltern am See",
            "stationNumber": 2510,
            "facilities": []
        },
        {
            "name": "Altenstadt-Höchst",
            "stationNumber": 2806,
            "facilities": []
        },
        {
            "name": "Altes Lager",
            "stationNumber": 3072,
            "facilities": []
        },
        {
            "name": "Langenhagen - Kaltenweide",
            "stationNumber": 3093,
            "facilities": []
        },
        {
            "name": "Lehndorf (Kr Altenburg)",
            "stationNumber": 3615,
            "facilities": []
        },
        {
            "name": "Altenstadt-Lindheim",
            "stationNumber": 3735,
            "facilities": []
        },
        {
            "name": "Riegel-Malterdingen",
            "stationNumber": 5273,
            "facilities": []
        },
        {
            "name": "Sulzbach (Saar) Altenwald",
            "stationNumber": 6113,
            "facilities": []
        },
        {
            "name": "Waltershausen",
            "stationNumber": 6522,
            "facilities": []
        },
        {
            "name": "Waltershausen-Schnepfenthal",
            "stationNumber": 6523,
            "facilities": []
        },
        {
            "name": "Altenstadt (Waldnaab)",
            "stationNumber": 8152,
            "facilities": []
        },
        {
            "name": "Rheinzabern Alte Römerstraße",
            "stationNumber": 8204,
            "facilities": []
        }
    ]

    // Teach Autosuggest how to calculate suggestions for any given input value.
    const getSuggestions = value => {
        const inputValue = value.trim().toLowerCase();
        const inputLength = inputValue.length;

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
        setSuggestions(getSuggestions(value));
    }

    // Autosuggest will call this function every time you need to clear suggestions.
    function onSuggestionsClearRequested() {
        setSuggestions([]);
    }

    // // Autosuggest will pass through all these props to the input.
    // const inputProps = {
    //     placeholder: 'Type a station',
    //     value,
    //     type: "procure",
    //     onChange
    // };

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
            marginTop: theme.spacing(1),
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
        </div>
    )
}
