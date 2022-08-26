'use strict';
import { v4 as uuid } from 'uuid';
import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class userList extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    // eslint-disable-next-line no-unused-vars
    static associate(models) {
      // define association here
    }
  }
  userList.init(
    {
      account: DataTypes.STRING,
      password: DataTypes.STRING,
      email: DataTypes.STRING,
      avater: { type: DataTypes.STRING, defaultValue: '' },
      account_Id: {
        type: DataTypes.UUID,
        defaultValue: uuid,
      },
    },
    {
      sequelize,
      modelName: 'userList',
    }
  );
  return userList;
};
