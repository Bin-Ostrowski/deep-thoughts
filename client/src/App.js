import React from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Login from "./pages/Login";
import NoMatch from "./pages/NoMatch";
import SingleThought from "./pages/SingleThought";
import Profile from "./pages/Profile";
import Signup from "./pages/Signup";
import {
  // type of React component that provideS data to all components
  ApolloProvider,
  // constructor function initialize connection to GraphQL API server.
  ApolloClient,
  // enables the Apollo Client instance to cache API response data TO
  // perform requests more efficiently
  InMemoryCache,
  // control how the Apollo Client makes a request.
  // middleware for the outbound network requests
  createHttpLink,
} from "@apollo/client";

// setContext, to create middleware to retrieve token  from localStorage and combine
// it with the existing httpLink
import { setContext } from "@apollo/client/link/context";

//import react-router-dom, renamed BrowserRouter to Router to make it easier to work with.
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

//establish a new link to GraphQL server at /graphql endpoint with createHttpLink()
const httpLink = createHttpLink({
  // URI stands for "Uniform Resource Identifier."
  uri: "/graphql",
});

// authLink, use the setContext() to retrieve token from localStorage and set the HTTP
// request headers of every request to include token, whether the request needs it or not. 
//This is fine, because if the request doesn't need the token, our server-side resolver 
//function won't check for it.
//Because not using the first parameter, use an underscore _ to serve as a placeholder
const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('id_token');
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

// ApolloClient() constructor to instantiate Apollo Client instance

// combine the authLink and httpLink objects so that every request retrieves 
// the token and sets the request headers before making the request to the API. 
// create the connection to the API endpoint.

// instantiate a new cache object using new InMemoryCache()
const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

function App() {
  return (
    // wrap all in ApolloProvider to capp client variable prop,
    <ApolloProvider client={client}>
      <Router>
        <div className="flex-column justify-flex-start min-100-vh">
          <Header />
          <div className="container">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/profile">
                <Route path=":username" element={<Profile />} />
                <Route path="" element={<Profile />} />
              </Route>
              <Route path="/thought/:id" element={<SingleThought />} />
              <Route path="*" element={<NoMatch />} />
            </Routes>
          </div>
          <Footer />
        </div>
      </Router>
    </ApolloProvider>
  );
}

export default App;
