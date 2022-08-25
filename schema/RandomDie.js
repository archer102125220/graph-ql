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

export const RandomDieSchemaTypeName = 'RandomDie';
export const RandomDieSchema = `
  type ${RandomDieSchemaTypeName} {
    numSides: Int!
    rollOnce: Int!
    roll(numRolls: Int!): [Int]
  }`;

export default RandomDie;