'use strict';
import crypto from 'crypto';
import { v4 as uuid } from 'uuid';
const sha = crypto.createHash('sha1');

export default {
  // eslint-disable-next-line no-unused-vars
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */
    await queryInterface.bulkInsert('userLists', [
      {
        account: 'admin',
        password: sha.update('123').digest('hex'),
        email: 'example@example.com',
        account_Id: uuid(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  // eslint-disable-next-line no-unused-vars
  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  },
};
