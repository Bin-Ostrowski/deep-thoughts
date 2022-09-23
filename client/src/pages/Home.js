import React from "react";
//import  useQuery Hook from Apollo Client. allow to make requests to the GraphQL server
// we connected to and made available to application using the <ApolloProvider>
//component in App.js
import { useQuery } from "@apollo/client";
import { QUERY_THOUGHTS, QUERY_ME_BASIC } from "../utils/queries";

import Auth from "../utils/auth";
import ThoughtList from "../components/ThoughtList";
import FriendList from "../components/FriendList";
import ThoughtForm from '../components/ThoughtForm';

const Home = () => {
  // use useQuery hoot to make query request
  const { loading, data } = useQuery(QUERY_THOUGHTS);

  // destruture `data` from the `userQuery` Hook's response
  // rename it `userData`
  const { data: userData } = useQuery(QUERY_ME_BASIC);

  const thoughts = data?.thoughts || [];
  //This is called optional chaining,
  //if data exists, store it in the thoughts constant we just created.
  //If data is undefined, then save an empty array to the thoughts component.
  console.log(thoughts);

  // If logged in, the loggedIn variable will be true; otherwise, it will be false.
  const loggedIn = Auth.loggedIn();

  return (
    <main>
      <div className="flex-row justify-space-between">
        {/* conditionally render thought form if logged in */}
        {loggedIn && (
          <div className="col-12 mb-3">
            <ThoughtForm />
            </div>
        )}
        <div className={`col-12 mb-3 ${loggedIn && "col-lg-8"}`}>
          {loading ? (
            <div>Loading...</div>
          ) : (
            <ThoughtList
              thoughts={thoughts}
              title="Some Feed for Thought(s)..."
            />
          )}
        </div>
        {loggedIn && userData ? (
          <div className="col-12 col-lg-3 mb-3">
            <FriendList
              username={userData.me.username}
              friendCount={userData.me.friendCount}
              friends={userData.me.friends}
            />
          </div>
        ) : null}
      </div>
    </main>
  );
};

export default Home;
