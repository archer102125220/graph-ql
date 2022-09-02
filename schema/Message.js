import crypto from 'crypto';
import {
  GraphQLInputObjectType,
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLID,
  GraphQLString,
} from 'graphql';
const fakeDatabase = {};

export class Message {
  constructor(id, { content, author }) {
    this.id = id;
    this.content = content;
    this.author = author;
  }
}

export const MessageInputSchema = new GraphQLInputObjectType({
  name: 'MessageInput',
  fields: {
    content: { type: GraphQLString },
    author: { type: GraphQLString },
  },
});

export const MessageSchema = new GraphQLObjectType({
  name: 'Message',
  fields: {
    id: { type: new GraphQLNonNull(GraphQLID) },
    content: { type: GraphQLString },
    author: { type: GraphQLString },
  },
});

export const MessageMutation = {
  createMessage: {
    type: MessageSchema,
    args: {
      input: { type: MessageInputSchema },
    },
    resolve: (_, { input }) => {
      // Create a random id for our "database".
      const id = crypto.randomBytes(10).toString('hex');

      fakeDatabase[id] = input;
      return new Message(id, input);
    },
  },
  updateMessage: {
    type: MessageSchema,
    args: {
      id: { type: new GraphQLNonNull(GraphQLID) },
      input: { type: MessageInputSchema },
    },
    resolve: (_, { id, input }) => {
      if (!fakeDatabase[id]) {
        throw new Error('no message exists with id ' + id);
      }
      // This replaces all old data, but some apps might want partial update.
      fakeDatabase[id] = input;
      return new Message(id, input);
    },
  },
};

export const MessageQuery = {
  getMessage: {
    type: MessageSchema,
    args: {
      id: { type: new GraphQLNonNull(GraphQLID) },
    },
    resolve: (_, { id }) => {
      if (!fakeDatabase[id]) {
        throw new Error('no message exists with id ' + id);
      }
      return new Message(id, fakeDatabase[id]);
    },
  },
};

export default Message;
