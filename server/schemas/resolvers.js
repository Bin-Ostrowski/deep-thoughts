const { AuthenticationError } = require("apollo-server-express");
const { User, Thought } = require("../models");
const { signToken } = require("../utils/auth");

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

    //finding a single thought - destructure the _id argument value
    //place into .findOne() to look up a single thought by its _id
    thought: async (parent, { _id }) => {
      return Thought.findOne({ _id });
    },

    // get all users
    users: async () => {
      return User.find()
        .select("-__v -password")
        .populate("friends")
        .populate("thoughts");
    },

    // get a user by username
    user: async (parent, { username }) => {
      return User.findOne({ username })
        .select("-__v -password")
        .populate("friends")
        .populate("thoughts");
    },
  },

  // add mutation for creating, updating and deleteing
  Mutation: {
    // Mongoose User model creates a new user in the
    //database with whatever is passed in as the args
    addUser: async (parent, args) => {
      const user = await User.create(args);
      // sign a token
      const token = signToken(user);

      //return an object that combines the token with the user's data
      return { token, user };
    },
    login: async (parent, { email, password }) => {
      //validate email
      const user = await User.findOne({ email });

      if (!user) {
        //dont specify which is incorrect to shield from malicious hackers
        throw new AuthenticationError("Incorrect credentials");
      }

      //validate user password
      const correctPw = await user.isCorrectPassword(password);

      if (!correctPw) {
        throw new AuthenticationError("Incorrect credentials");
      }

      //sign a token 
      const token = signToken(user);
      //return an object that combines the token with the user's data
      return { token, user };
    },
  },
};

module.exports = resolvers;
