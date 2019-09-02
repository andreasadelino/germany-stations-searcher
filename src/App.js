import { ApolloProvider } from '@apollo/react-hooks';
import React from 'react';
import './App.css';
import Routes from './routes';
import client from './services/apolloClient';
import { Provider } from "react-redux";

import store from "./store/index"

function App() {
    return (
        <Provider store={store}>
            <ApolloProvider client={client}>
                <Routes />
            </ApolloProvider>
        </Provider>
    );
}

export default App;
