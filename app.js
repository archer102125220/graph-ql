import Express from 'express';
import { graphqlHTTP } from 'express-graphql';
import { buildSchema } from 'graphql';
import crypto from 'crypto';
import { RandomDie, RandomDieSchema, RandomDieSchemaTypeName } from '@/schema/RandomDie';
import { Message, MessageSchemaTypeName, MessageSchema, MessageInputSchemaName, MessageInputSchema } from '@/schema/Message';

const loggingMiddleware = (req, res, next) => {
  console.log('ip:', req.ip);
  next();
}

class App extends Express {
  constructor(props) {
    super(props);
    this.fakeDatabase = {};
    this.graphqlSetting();
    this.route = {
      '/graphql': graphqlHTTP({
        schema: this.schema,
        rootValue: this.graphqlRoot,
        graphiql: true,
      })
    };
  }

  graphqlSetting = () => {
    this.schema = buildSchema(`
      ${RandomDieSchema}

      ${MessageInputSchema}
      
      ${MessageSchema}

      type Mutation {
        createMessage(input: ${MessageInputSchemaName}): ${MessageSchemaTypeName}
        updateMessage(id: ID!, input: ${MessageInputSchemaName}): ${MessageSchemaTypeName}
      }

      type Query {
        hello: String,
        rollDice(numDice: Int!, numSides: Int): [Int],
        quoteOfTheDay: String,
        random: Float,
        rollThreeDice: [Int],
        getDie(numSides: Int): ${RandomDieSchemaTypeName},
        getMessage(id: ID!): ${MessageSchemaTypeName}
      }
    `);
    this.graphqlRoot = {
      hello: () => {
        return 'Hello world!';
      },
      quoteOfTheDay: () => {
        return Math.random() < 0.5 ? 'Take it easy' : 'Salvation lies within';
      },
      random: () => {
        return Math.random();
      },
      rollThreeDice: () => {
        return [1, 2, 3].map(() => 1 + Math.floor(Math.random() * 6));
      },
      rollDice: ({ numDice, numSides }) => {
        const output = [];
        for (let i = 0; i < numDice; i++) {
          output.push(1 + Math.floor(Math.random() * (numSides || 6)));
        }
        return output;
      },
      // https://graphql.cn/graphql-js/object-types/
      getDie: ({ numSides }) => {
        return new RandomDie(numSides || 6);
      },
      getMessage: ({ id }) => {
        if (!this.fakeDatabase[id]) {
          throw new Error('no message exists with id ' + id);
        }
        return new Message(id, this.fakeDatabase[id]);
      },
      createMessage: ({ input }) => {
        // Create a random id for our "database".
        const id = crypto.randomBytes(10).toString('hex');

        this.fakeDatabase[id] = input;
        return new Message(id, input);
      },
      updateMessage: ({ id, input }) => {
        if (!this.fakeDatabase[id]) {
          throw new Error('no message exists with id ' + id);
        }
        // This replaces all old data, but some apps might want partial update.
        this.fakeDatabase[id] = input;
        return new Message(id, input);
      },
    };
  }

  listenStart = (port = 80) => {
    Object.keys(this.route).forEach((path) => {
      this.use(path, this.route[path]);
    });
    this.use(loggingMiddleware);
    this.listen(port);
  }
};

export default App;