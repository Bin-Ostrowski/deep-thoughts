import React from 'react';
//import  useQuery Hook from Apollo Client. allow to make requests to the GraphQL server
// we connected to and made available to application using the <ApolloProvider> 
//component in App.js
import { useQuery } from '@apollo/client';
import { QUERY_THOUGHTS } from '../utils/queries';

import ThoughtList from '../components/ThoughtList';

const Home = () => {
  // use useQuery hoot to make query request
  const { loading, data } = useQuery(QUERY_THOUGHTS);

  const thoughts = data?.thoughts || [];
  //This is called optional chaining,
  //if data exists, store it in the thoughts constant we just created. 
  //If data is undefined, then save an empty array to the thoughts component.
  console.log(thoughts)

  return (
    <main>
      <div className='flex-row justify-space-between'>
        <div className='col-12 mb-3'>{loading? (
          <div>Loading...</div>
        ) : (
          <ThoughtList thoughts={thoughts} title="Some Feed for Thought(s)..." />
        )}
        </div>
      </div>
    </main>
  );
};

export default Home;
