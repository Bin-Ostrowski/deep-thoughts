import { gql } from '@apollo/client';

export const QUERY_THOUGHTS = gql`
  query thoughts($username: String) {
    thoughts(username: $username) {
      _id
      thoughtText
      createdAt
      username
      reactionCount
      reactions {
        _id
        createdAt
        username
        reactionBody
      }
    }
  }
`;
//wrapped the entire query code in a tagged template literal using the imported gql 
//function. saved it as QUERY_THOUGHTS and exported it using the ES6 module export syntax.
//can import query by name and use it anywhere throughout front end of application