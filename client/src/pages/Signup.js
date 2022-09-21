import React, { useState } from "react";

// import necessary Hook and mutation
import { useMutation } from "@apollo/client";
import { ADD_USER } from "../utils/mutations";

import Auth from "../utils/auth";

const Signup = () => {
  const [formState, setFormState] = useState({
    username: "",
    email: "",
    password: "",
  });

  // useMutation() Hook creates and prepares a JavaScript function that wraps around
  // mutation code and returns it. it returns in the form of addUser function
  // that's returned. can also check for errors.
  const [addUser, { error }] = useMutation(ADD_USER);

  // update state based on form input changes
  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormState({
      ...formState,
      [name]: value,
    });
  };

  // submit form (see async)
  const handleFormSubmit = async (event) => {
    event.preventDefault();

    // pass data from form state as variables for addUser mutation function.
    // Upon success, we destructure the data object from the response of our mutation and simply log it to see if we're getting our token
    // use the try...catch block, since it's useful with asynchronous code liek Promises.
    // can use async/await instead of .then() and .catch() method-chaining
    // while still being able to handle any errors that may occur.
    try {
      // execute addUser mutation and pass in variable data from form
      const { data } = await addUser({
        variables: { ...formState },
      });
      //take the token and set it to localStorage.
      Auth.login(data.addUser.token);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <main className="flex-row justify-center mb-4">
      <div className="col-12 col-md-6">
        <div className="card">
          <h4 className="card-header">Sign Up</h4>
          <div className="card-body">
            <form onSubmit={handleFormSubmit}>
              <input
                className="form-input"
                placeholder="Your username"
                name="username"
                type="username"
                id="username"
                value={formState.username}
                onChange={handleChange}
              />
              <input
                className="form-input"
                placeholder="Your email"
                name="email"
                type="email"
                id="email"
                value={formState.email}
                onChange={handleChange}
              />
              <input
                className="form-input"
                placeholder="******"
                name="password"
                type="password"
                id="password"
                value={formState.password}
                onChange={handleChange}
              />
              <button className="btn d-block w-100" type="submit">
                Submit
              </button>
            </form>
            {/* //add error handleing */}
            {error && <div>Sign up Failed</div>}
          </div>
        </div>
      </div>
    </main>
  );
};

export default Signup;
