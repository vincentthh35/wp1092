import React from 'react';
import ReactDOM from 'react-dom';

import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

import {
    ApolloClient,
    InMemoryCache,
    ApolloProvider,
    HttpLink,
} from '@apollo/client';
import { split } from 'apollo-link';
import { WebSocketLink } from 'apollo-link-ws';
import { getMainDefinition } from 'apollo-utilities';

// create http link
const httpLink = new HttpLink({
    uri: 'http://localhost:5000/',
});

// create socket
const wsLink = new WebSocketLink({
    uri: 'ws://localhost:5000/',
});

// reference: https://github.com/ian13456/modern-graphql-tutorial/blob/master/frontend/src/index.js
// using the ability to split links, you can send data to each link
// depending on what kind of operation is being sent
const link = split(
  // split based on operation type
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  wsLink,
  httpLink,
);

// const cache = new InMemoryCache({
//     typePolicies: {
//         Query: {
//             fields: {
//                 user: {
//                     merge(existing, incoming) {
//                         return incoming;
//                     },
//                 },
//             },
//         },
//     },
// });

const client = new ApolloClient({
  link,
  // cache,
  cache: new InMemoryCache().restore({}),
});

ReactDOM.render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>,
  document.getElementById('root'),
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
