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

//define query to return an array, as noted by []
//around the returning data, Thought
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

  type Query {
    thoughts(username: String): [Thought]
  }
`;

//export typeDefs
module.exports = typeDefs;
