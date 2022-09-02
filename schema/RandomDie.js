import {
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLInt,
  GraphQLList,
} from 'graphql';

export class RandomDie {
  constructor(numSides) {
    this.numSides = numSides;
  }

  rollOnce() {
    return 1 + Math.floor(Math.random() * this.numSides);
  }

  roll({ numRolls }) {
    const output = [];
    for (let i = 0; i < numRolls; i++) {
      output.push(this.rollOnce());
    }
    return output;
  }
}

// export const RandomDieSchemaTypeName = 'RandomDie';
// export const RandomDieSchema = `
//   type ${RandomDieSchemaTypeName} {
//     numSides: Int!
//     rollOnce: Int!
//     roll(numRolls: Int!): [Int]
//   }`;

export const RandomDieSchema = new GraphQLObjectType({
  name: 'RandomDie',
  fields: {
    numSides: { type: new GraphQLNonNull(GraphQLInt) },
    rollOnce: { type: new GraphQLNonNull(GraphQLInt) },
    roll: {
      type: new GraphQLList(GraphQLInt),
      args: {
        numRolls: { type: new GraphQLNonNull(GraphQLInt) },
      },
      // resolve: (RandomDieSchema, payload) => {
      //   return RandomDieSchema.roll(payload);
      // },
    },
  },
});

export const RandomDieQuery = {
  rollDice: {
    type: new GraphQLList(GraphQLInt),
    args: {
      numDice: { type: new GraphQLNonNull(GraphQLInt) },
      numSides: { type: GraphQLInt },
    },
    resolve: ({ numDice, numSides }) => {
      const output = [];
      for (let i = 0; i < numDice; i++) {
        output.push(1 + Math.floor(Math.random() * (numSides || 6)));
      }
      return output;
    },
  },
  rollThreeDice: {
    type: new GraphQLList(GraphQLInt),
    resolve: () => {
      return [1, 2, 3].map(() => 1 + Math.floor(Math.random() * 6));
    },
  },
  // https://graphql.cn/graphql-js/object-types/
  getDie: {
    type: RandomDieSchema,
    args: {
      numSides: { type: GraphQLInt },
    },
    resolve: (_, { numSides }) => {
      return new RandomDie(numSides || 6);
    },
  },
};

export default RandomDie;
