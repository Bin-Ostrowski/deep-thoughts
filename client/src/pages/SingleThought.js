import React from 'react';
import ReactionList from '../components/ReactionList';

//used to grap parameter from URL
import { useParams } from 'react-router-dom';

//import query from Utils
import { useQuery } from '@apollo/client';
import { QUERY_THOUGHT } from '../utils/queries';

const SingleThought = props => {

  //grab id from params in URL
  const {id: thoughtId } = useParams();

  //deconstruct variables loading and data from the useQuery Hook.
  const { loading, data } = useQuery(QUERY_THOUGHT, {
    // useQuery Hook was given a second argument in the form of an object. 
    // This is how to pass variables to queries that need them. 
    // id property on variables object will become the $id parameter in GraphQL query.
    variables: { id: thoughtId }
  });

  //data variable is used to populate a thought object.
  const thought = data?.thought || {};

  //loading variable used to briefly show a loading <div> element
  if(loading) {
    return <div>Loading...</div>;
  };

  return (
    <div>
      <div className="card mb-3">
        <p className="card-header">
          <span style={{ fontWeight: 700 }} className="text-light">
            {thought.username}
          </span>{' '}
          thought on {thought.createdAt}
        </p>
        <div className="card-body">
          <p>{thought.thoughtText}</p>
        </div>
      </div>
      {thought.reactionCount > 0 && <ReactionList reactions={thought.reactions} />}
    </div>
  );
};

export default SingleThought;
