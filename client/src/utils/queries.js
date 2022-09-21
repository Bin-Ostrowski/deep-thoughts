import { gql } from "@apollo/client";

//wrapped the entire query code in a tagged template literal using the imported gql
//function. saved it as QUERY_THOUGHTS and exported it using the ES6 module export syntax.
//can import query by name and use it anywhere throughout front end of application
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

//query for single thought
export const QUERY_THOUGHT = gql`
  query thought($id: ID!) {
    thought(_id: $id) {
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

// query for user
export const QUERY_USER = gql`
 query user($username: String!) {
  user(username: $username) {
    _id
    username
    email
    friendCount
    friends {
      _id
      username
    }
    thoughts {
      _id
      thoughtText
      createdAt
      reactionCount
    }
  }
 }
`;
