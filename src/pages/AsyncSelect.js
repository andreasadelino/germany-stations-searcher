import React, { useState, useEffect } from 'react';
import AsyncSelect from 'react-select/async';
import gql from 'graphql-tag';
import { useQuery, useLazyQuery } from '@apollo/react-hooks';



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

    // const { data, loading, error, fetchMore } = useQuery(GET_STATIONS);
    const [getStations, { data, loading, error }] = useLazyQuery(GET_STATIONS);

    useEffect(() => {
        getStations({ variables: { searchTerm: value } });

    }, [value])

    function filterDoces(inputValue) {
        return doces.filter(doce => doce.label.toLowerCase().includes(inputValue.toLowerCase()));
    }

    function fetchData(inputValue) {
        // console.log("input", inputValue);

        return new Promise(resolve => {
            setTimeout(() => {
                resolve(filterDoces(inputValue));
            }, 500);
        });
    }

    return (
        <div>
            {loading && <span className="info-loading">Carregando...</span>}
            <div className="teste">
                Inputvalue: {value}
            </div>
            <AsyncSelect
                cacheOptions
                isClearable
                getOptionLabel={(option) => option.label}
                // onInputChange={setValue}
                placeholder="Type a station..."
                noOptionsMessage={() => "No station finded..."}
                loadOptions={options}
                openMenuOnClick={false}
            />
        </div>
    );
}