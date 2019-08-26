import { ApolloProvider } from '@apollo/react-hooks';
import React from 'react';
import './App.css';
import Routes from './routes';
import client from './services/apolloClient';

function App() {
    return (
        <ApolloProvider client={client}>
            <Routes />
        </ApolloProvider>
    );
}

export default App;
