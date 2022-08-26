import Express from 'express';
import { graphqlHTTP } from 'express-graphql';
import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLFloat,
  GraphQLSchema,
} from 'graphql';
import { RandomDieQuery } from '@/schema/RandomDie';
import { MessageMutation, MessageQuery } from '@/schema/Message';

const loggingMiddleware = (req, res, next) => {
  console.log('ip:', req.ip);
  next();
};

class App extends Express {
  constructor(props) {
    super(props);
    this.fakeDatabase = {};
    this.graphqlSetting();
    this.route = {
      '/graphql': graphqlHTTP({
        schema: this.schema,
        graphiql: true,
      }),
    };
    this.use(loggingMiddleware);
    this.setRoutes();
  }

  graphqlSetting = () => {
    // https://graphql.cn/graphql-js/graphql-clients/
    const queryType = new GraphQLObjectType({
      name: 'Query',
      fields: {
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
        ...MessageQuery(this.fakeDatabase),
      },
    });

    const mutationType = new GraphQLObjectType({
      name: 'Mutation',
      fields: {
        ...MessageMutation(this.fakeDatabase),
      },
    });
    this.schema = new GraphQLSchema({
      query: queryType,
      mutation: mutationType,
    });
  };

  setRoutes = () => {
    Object.keys(this.route).forEach((path) => {
      this.use(path, this.route[path]);
    });
  };
}

export default App;
