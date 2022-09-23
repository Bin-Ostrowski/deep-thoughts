const { AuthenticationError } = require("apollo-server-express");
const { User, Thought } = require("../models");
const { signToken } = require("../utils/auth");

const resolvers = {
  Query: {
    //JWT read the request headers
    me: async (parent, args, context) => {
      // check for the existence of context.user. If no context.user property exists, then
      // we know that the user isn't authenticated and we can throw an AuthenticationError
      if (context.user) {
        const userData = await User.findOne({ _id: context.user._id })
          .select("-__v -password")
          .populate("thoughts")
          .populate("friends");

        return userData;
      }

      throw new AuthenticationError("Not logged in");
    },
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

    addThought: async (parent, args, context) => {
      if (context.user) {
        const thought = await Thought.create({
          ...args,
          username: context.user.username,
        });

        await User.findByIdAndUpdate(
          { _id: context.user._id },
          { $push: { thoughts: thought._id } },
          // without the { new: true } flag Mongo would return the original 
          //document instead of the updated document.
          { new: true }
        );

        return thought;
      }

      throw new AuthenticationError("You need to be logged in!");
    },

    addReaction: async (parent, { thoughtId, reactionBody }, context) => {
      if (context.user) {
        const updatedThought = await Thought.findOneAndUpdate(
          { _id: thoughtId },
          //Reactions are stored as arrays on the Thought model, 
          //so use the Mongo $push operator.
          { $push: { reactions: { reactionBody, username: context.user.username } } },
          { new: true, runValidators: true }
        );

        return updatedThought;
      }

      throw new AuthenticationError('You need to be logged in!');
    },

    // look for an incoming friendId and add that to the current user's friends array
    addFriend: async (parent, { friendId }, context) => {
      if (context.user) {
        const updatedUser = await User.findOneAndUpdate(
          { _id: context.user._id },
          // A user can't be friends with the same person twice, hence using 
          // $addToSet operator instead of $push to prevent duplicate entries.
          { $addToSet: { friends: friendId } },
          { new: true }
        ).populate('friends');

        return updatedUser;
      }

      throw new AuthenticationError('You need to be logged in!');
    }
  },
};

module.exports = resolvers;
