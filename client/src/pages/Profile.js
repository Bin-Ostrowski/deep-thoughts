import React from "react";
import ThoughtList from "../components/ThoughtList";
import FriendList from "../components/FriendList";
import Auth from "../utils/auth";
import ThoughtForm from '../components/ThoughtForm';

import { Navigate, useParams } from "react-router-dom";
import { useQuery, useMutation } from "@apollo/client";
import { QUERY_USER, QUERY_ME } from "../utils/queries";
import { ADD_FRIEND } from "../utils/mutations";

const Profile = () => {
  // get username from URL params
  const { username: userParam } = useParams();

  // destructure mutaion function from ADD_FRIEND so can use it in a click function
  const [addFriend] = useMutation(ADD_FRIEND);

  // useQuery() Hook if a value in userParam that we got from the URL bar,
  // use value to run QUERY_USER query. If no value in userParam, like if visit
  // /profile as a logged-in user, we'll execute the QUERY_ME query instead
  const { loading, data } = useQuery(userParam ? QUERY_USER : QUERY_ME, {
    // pass URL params to useQuery Hook
    variables: { username: userParam },
  });

  // user object created afterwards is used to populate the JSX
  // when we run QUERY_ME, response will return our data in the me property;
  // but QUERY_USER instead, the response will return with our data in the user property
  const user = data?.me || data?.user || {};

  // navigate to personal profile page if username is logged-in user's
  if (Auth.loggedIn() && Auth.getProfile().data.username === userParam) {
    return <Navigate to="/profile" />;
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  //error code if logged out and try to view /profile
  if (!user?.username) {
    return (
      <h4>
        You need to be logged in to see this page. Use the navigation links
        above to sign up or log in!
      </h4>
    );
  }

  // add friend handler
  const handleClick = async () => {
    try {
      await addFriend({
        variables: { id: user._id },
      });
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div>
      <div className="flex-row mb-3">
        <h2 className="bg-dark text-secondary p-3 display-inline-block">
          Viewing {userParam ? `${user.username}'s` : "your"} profile.
        </h2>
        {/* conditionally render button to show when its not your own profile
          serParam variable is only defined when oute includes a username (e.g., /profile/Marisa86). 
          Thus, the button won't display when the route is simply /profile. */}
        {userParam && (
          <button className="btn ml-auto" onClick={handleClick}>
            Add Friend
          </button>
        )}
      </div>

      <div className="flex-row justify-space-between mb-3">
        <div className="col-12 mb-3 col-lg-8">
          <ThoughtList
            thoughts={user.thoughts}
            title={`${user.username}'s thoughts...`}
          />
        </div>

        <div className="col-12 col-lg-3 mb-3">
          <FriendList
            username={user.username}
            friendCount={user.friendCount}
            friends={user.friends}
          />
        </div>
      </div>
      {/*use the userParam to make form only displays on user's own Profile page,
       not on other users' pages */}
      <div className="mb-3">{!userParam && <ThoughtForm />}</div>
    </div>
  );
};

export default Profile;
