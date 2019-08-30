import React, { useState, useEffect } from 'react';
import AsyncSelect from 'react-select/async';
import gql from 'graphql-tag';
import { useQuery, useLazyQuery } from '@apollo/react-hooks';

export default function SelectAsync() {
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

    function fetchData(inputValue) {
        const response = refetch({ searchTerm: inputValue });
        return response.then(({ data }) => data.search.stations, err => { console.log(err) });
    }

    function onSelect(inputValue) {
        console.log(inputValue);
    }

    return (
        <div>
            {loading && <span className="info-loading">Carregando...</span>}
            <AsyncSelect
                cacheOptions
                isClearable
                loadingMessage={() => "Fetching stations. Please wait..."}
                noOptionsMessage={() => "No station finded..."}
                getOptionLabel={(option) => option.name}
                onChange={onSelect}
                placeholder="Type a station..."
                loadOptions={fetchData}
                openMenuOnClick={false}
            />
        </div>
    );
}