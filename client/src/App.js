import React from "react";
import {
  //type of React component that provideS data to all components
  ApolloProvider,
  //constructor function initialize connection to GraphQL API server.
  ApolloClient,
  //enables the Apollo Client instance to cache API response data TO
  // perform requests more efficiently
  InMemoryCache,
  //control how the Apollo Client makes a request.
  //middleware for the outbound network requests
  createHttpLink,
} from "@apollo/client";

import Header from "./components/Header";
import Footer from "./components/Footer";

import Home from "./pages/Home";

//establish a new link to GraphQL server at /graphql endpoint with createHttpLink()
const httpLink = createHttpLink({
  //URI stands for "Uniform Resource Identifier."
  uri: "/graphql",
});

// ApolloClient() constructor to instantiate Apollo Client instance
// create the connection to the API endpoint.
// instantiate a new cache object using new InMemoryCache()
const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
});

function App() {
  return (
    //wrap all in ApolloProvider to capp client variable prop,
    <ApolloProvider client={client}>
      <div className="flex-column justify-flex-start min-100-vh">
        <Header />
        <div className="container">
          <Home />
        </div>
        <Footer />
      </div>
    </ApolloProvider>
  );
}

export default App;
