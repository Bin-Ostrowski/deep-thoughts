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

//import react-router-dom, renamed BrowserRouter to Router to make it easier to work with.
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

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
