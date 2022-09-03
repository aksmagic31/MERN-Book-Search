const { AuthenticationError } = require("apollo-server-errors");
const { User } = require("../models");
const { signToken } = require("../utils/auth");

const resolvers = {
  Query: {
    me: async (parent, args, context) => {
      if (context.data) {
          return User.findOne({ _id: context.data._id }).populate('savedBooks');
      }
      throw new AuthenticationError("Please Log In");
    },
    // user: async(parent,args,context) => {
    //     const userData = User.findOne({_id:  context.user._id}).populate('username');
    // }
  },
  Mutation: {
    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email });

      if (!user) {
        throw new AuthenticationError("Not User found");
      }

      const correctPassword = await user.isCorrectPassword(password);
      if (!correctPassword) {
        throw new AuthenticationError("Invalid Password");
      }
      const token = signToken(user);

      return { token, user };
    },
    addUser: async (parent, { username, email, password }, context) => {
  
      const user = await User.create({ username, email, password });

      if (!user) {
          return res.status(400).json({ message: 'Something is wrong!' });
      }
      const token = signToken(user);

      return { token, user }
  },
    saveBook: async (parent, { input }, context) => {
      if (context.user) {
        const updatedUser = await User.findOneAndUpdate(
          { _id: context.user._id },
          { $addToSet: { savedBooks: input } },
          { new: true, runValidators: true }
        );
        return updatedUser;
      }
      throw new AuthenticationError("You need to be logged in!");
    },
    removeBook: async (parent, { bookId }, context) => {
      if (context.user) {
        const updatedUser = await User.findOneAndUpdate(
          { _id: context.user._id },
          { $pull: { savedBooks: { bookId: bookId } } },
          { new: true }
        );
        return updatedUser;
      }
      throw new AuthenticationError("You need to be logged in!");
    },
  },
};

module.exports = resolvers;