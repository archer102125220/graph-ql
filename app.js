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
import { UserListMutation, UserListQuery } from '@/schema/UserList';


class App extends Express {
  constructor(props) {
    super(props);
    this.setMiddleware();
    this.setRoutes();
    this.graphqlSetting('/graphql');
  }
  graphqlQueryList = {
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
  graphqlMutationList = {
    ...MessageMutation,
    ...UserListMutation,
  };
  middlewareList = [
    (req, res, next) => {
      console.log('ip:', req.ip);
      next();
    }
  ];
  routeList = [];

  graphqlSetting = (graphqlPath = '/graphql', graphiql = true) => {
    // https://graphql.cn/graphql-js/graphql-clients/
    const queryType = new GraphQLObjectType({
      name: 'Query',
      fields: {
        ...this.graphqlQueryList
      },
    });

    const mutationType = new GraphQLObjectType({
      name: 'Mutation',
      fields: {
        ...this.graphqlMutationList
      },
    });
    const schema = new GraphQLSchema({
      query: queryType,
      mutation: mutationType,
    });

    this.use(graphqlPath, graphqlHTTP({
      schema,
      graphiql,
    }));
  };

  setMiddleware = () => {
    this.middlewareList.forEach((middleware) => {
      if (Array.isArray(middleware)) {
        this.use(...middleware);
      } else {
        this.use(middleware);
      }
    });
  };

  setRoutes = () => {
    this.routeList.forEach((route) => {
      if (Array.isArray(route) && route.length === 2) {
        this.use(route[0], route[1]);
      } else if (Array.isArray(route)) {
        this.use(...route);
      } else {
        this.use(route);
      }
    });
  };
}

export default App;
