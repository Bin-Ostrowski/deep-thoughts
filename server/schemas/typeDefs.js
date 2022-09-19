//import the gql tagged template function
//Tagged templates are an advanced use of template literals,
//typically from a library that provides explicit details
// on how it's used in that situation
const { gql } = require("apollo-server-express");

// create our typeDefs (tagged template function)
//custom Thought data type
//include a nested array of reactions.

//create reaction custom type

//defined thoughts query to "could" receive a parameter if we wanted.
//the parameter would be identified as username and would be a String data type

//define User

//define query to return an array, as noted by []
//around the returning data, Thought

//create queries to retrieve a single thought by 
//_id value, all users, and single user by username
const typeDefs = gql`
  type Thought {
    _id: ID
    thoughtText: String
    createdAt: String
    username: String
    reactionCount: Int
    reactions: [Reaction]
  }

  type Reaction {
    _id: ID
    reactionBody: String
    createdAt: String
    username: String
  }

  type User {
    _id: ID
    username: String
    email: String
    friendCount: Int
    thoughts: [Thought]
    friends: [User]
  }

  type Query {
    users: [User]
    user(username: String!): User
    thoughts(username: String): [Thought]
    thought(_id: ID!): Thought
  }
`;

//export typeDefs
module.exports = typeDefs;
