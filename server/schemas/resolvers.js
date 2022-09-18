const { User, Thought } = require('../models');

const resolvers = {
    Query: {
         //methods get the same name of the query or 
         //mutation they are resolvers for

         //pass parent as placeholder parameter. It won't be used, but we need 
         //something in that first parameter's spot so we can access the 
         //username argument from the second parameter
         thoughts: async (parent, { username }) => {
       
        //use a ternary operator to check if username exists. If it does,
        //set params to an object with a username key set to that value.
        // If it doesn't, return an empty object.
        const params = username ? { username } : {};
        //pass params object, with or without any data in it, to our .find() 
        //perform .find() on query thoughts and return data in descending 
        //order using .sort()
        return Thought.find(params).sort({ createdAt: -1 });
      },
    }
  };
  
  module.exports = resolvers;