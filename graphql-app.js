import { graphqlHTTP } from 'express-graphql';
import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLFloat,
  GraphQLSchema,
} from 'graphql';
import { RandomDieQuery } from '@/schema/RandomDie';
import { MessageMutation, MessageQuery } from '@/schema/Message';
import { UserListMutation, UserListQuery } from '@/schema/UserList';

const queryList = {
  hello: {
    type: GraphQLString,
    resolve: () => {
      return 'Hello world!';
    },
  },
  quoteOfTheDay: {
    type: GraphQLString,
    resolve: () => {
      return Math.random() < 0.5
        ? 'Take it easy'
        : 'Salvation lies within';
    },
  },
  random: {
    type: GraphQLFloat,
    resolve: () => {
      return Math.random();
    },
  },
  ...RandomDieQuery,
  ...MessageQuery,
  ...UserListQuery
};

const mutationList = {
  ...MessageMutation,
  ...UserListMutation
};

export default function GraphQL(graphiql) {
  // https://graphql.cn/graphql-js/graphql-clients/
  const query = new GraphQLObjectType({
    name: 'Query',
    fields: {
      ...queryList
    }
  });
  const mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
      ...mutationList
    }
  });
  const schema = new GraphQLSchema({
    query,
    mutation,
  });

  return graphqlHTTP({
    schema,
    graphiql,
  });

}