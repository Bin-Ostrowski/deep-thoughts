import React, { useState } from "react";

import { useMutation } from "@apollo/client";
import { ADD_THOUGHT } from "../../utils/mutations";
import { QUERY_THOUGHTS, QUERY_ME } from "../../utils/queries";

const ThoughtForm = () => {
  //set state for thoughtText and Character count
  const [thoughtText, setText] = useState("");
  const [characterCount, setCharacterCount] = useState(0);

  // declare addThought() and error variable for mutation
  // manually inserting the new thought object into the cached array.
  // The useMutation Hook can include an update function that updates the cache
  // of any related queries
  const [addThought, { error }] = useMutation(ADD_THOUGHT, {
    // new thought just created
    update(cache, { data: { addThought } }) {
      //could potentially not exist yet, so wrap in try/catch
      try {
        // update me array's cashe
        const { me } = cache.readQuery({ query: QUERY_ME });
        cache.writeQuery({
          query: QUERY_ME,
          data: { me: { ...me, thoughts: [...me.thoughts, addThought] } },
        });
      } catch (e) {
        console.warn("First thought insertion by user!");
      }
      //update Thought array's cache
      // read what's currently in the cache
      const { thoughts } = cache.readQuery({ query: QUERY_THOUGHTS });

      // prepend the newest thought to the front of the array
      cache.writeQuery({
        query: QUERY_THOUGHTS,
        data: { thoughts: [addThought, ...thoughts] },
      });
    },
  });

  // textarea onChange hangler limit input to 280 char
  const handleChange = (event) => {
    if (event.target.value.length <= 280) {
      setText(event.target.value);
      setCharacterCount(event.target.value.length);
    }
  };

  // form Submit handler - will call a mutation so set to async
  const handleFormSubmit = async (event) => {
    event.preventDefault();

    //addThought mutation
    try {
      // add thought to database
      await addThought({
        variables: { thoughtText },
      });

      // clear form value
      setText("");
      setCharacterCount(0);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div>
      {/* conditionaly render char count or error */}
      <p
        className={`m-0 ${characterCount === 280 || error ? "text-error" : ""}`}
      >
        Character Count: {characterCount}/280
        {error && <span className="ml-2">Something went wrong...</span>}
      </p>
      <form
        className="flex-row justify-center justify-space-between-md align-stretch"
        onSubmit={handleFormSubmit}
      >
        <textarea
          placeholder="Here's a new thought..."
          value={thoughtText}
          className="form-input col-12 col-md-9"
          onChange={handleChange}
        ></textarea>
        <button className="btn col-12 col-md-3" type="submit">
          Submit
        </button>
      </form>
    </div>
  );
};

export default ThoughtForm;
