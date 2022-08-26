'use strict';
import _Sequelize from 'sequelize';
import userListModel from '@/models/userlist';
import configList from '@/config/config.json';

const env = process.env.NODE_ENV || 'development';
const config = configList[env];

let _sequelize;
if (config.use_env_variable) {
  _sequelize = new _Sequelize(process.env[config.use_env_variable], config);
} else {
  _sequelize = new _Sequelize(
    config.database,
    config.username,
    config.password,
    config
  );
}

export const userList = userListModel(_sequelize, _Sequelize.DataTypes);

const db = {
  userList,
};
Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = _sequelize;
db.Sequelize = _Sequelize;

export const sequelize = _sequelize;
export const Sequelize = _Sequelize;

export default db;
