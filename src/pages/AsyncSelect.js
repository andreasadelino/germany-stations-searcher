import React, { useState, useEffect } from 'react';
import AsyncSelect from 'react-select/async';
import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';



const doces = [
    { value: 'chocolate', label: 'Chocolate' },
    { value: 'strawberry', label: 'Strawberry' },
    { value: 'vanilla', label: 'Vanilla' }
]

export default function SelectAsync() {

    const [options, setOptions] = useState("");
    const [value, setValue] = useState("");

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
                setOptions(fetchMoreResult.search.stations);
                return options;
            }
        });

    }, [value])

    function filterDoces(inputValue) {
        return doces.filter(doce => doce.label.toLowerCase().includes(inputValue.toLowerCase()));
    }

    function fetchData(inputValue) {
        console.log("input", inputValue);

        return new Promise(resolve => {
            setTimeout(() => {
                resolve(filterDoces(inputValue));
            }, 500);
        });
    }

    return <AsyncSelect
        cacheOptions
        isClearable
        placeholder="Type a station..."
        noOptionsMessage={() => "No station finded..."}
        loadOptions={fetchData}
        openMenuOnClick={false}
    />
}