import crypto from 'crypto';
import {
  GraphQLInputObjectType,
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLID,
  GraphQLString,
} from 'graphql';
import UserService from '@/services/userService';

export class UserList {
  constructor({ account, email, password }) {
    this.account_id = null;
    this.account = account;
    this.email = email;
    this.password = password;
  }

  create = async () => {
    const userInfo = await UserService.createUser({
      account: this.account,
      email: this.email,
      password: this.password,
    });
    const {
      account_Id: account_id,
      account,
      email,
      password,
    } = userInfo;

    this.account_id = account_id;
    this.account = account;
    this.email = email;
    this.password = password;

    return userInfo;
  };

  find = async () => {
    const userInfo = await UserService.findUser({
      account: this.account,
      password: this.password,
    });
    const {
      account_Id: account_id,
      account,
      email,
      password,
    } = userInfo;
    this.account_id = account_id;
    this.account = account;
    this.email = email;
    this.password = password;

    return userInfo;
  };
}

export const UserListSchema = new GraphQLObjectType({
  name: 'UserList',
  fields: {
    account_id: { type: new GraphQLNonNull(GraphQLID) },
    account: { type: GraphQLString },
    password: { type: GraphQLString },
    email: { type: GraphQLString },
  },
});

export const UserListInputSchema = new GraphQLInputObjectType({
  name: 'UserListInput',
  fields: {
    account: { type: GraphQLString },
    password: { type: GraphQLString },
    email: { type: GraphQLString },
  },
});

export const UserListMutation = {
  createUser: {
    type: UserListSchema,
    args: {
      userInfo: { type: UserListInputSchema },
    },
    resolve: async (_, { userInfo }) => {
      const { account, email, password } = userInfo;
      console.log({ account, email, password });
      const user = new UserList({
        account,
        email,
        password: crypto.createHash('sha1').update(password).digest('hex'),
      });
      await user.create();

      return user;
    },
  },
};

export const UserListQuery = {
  getUserList: {
    type: UserListSchema,
    args: {
      account: { type: GraphQLString },
      password: { type: GraphQLString },
    },
    resolve: async (_, { account, password }) => {
      const userInfo = new UserList({
        account,
        password: crypto.createHash('sha1').update(password).digest('hex'),
      });

      await userInfo.create();

      if (!userInfo.account_id) {
        throw new Error('no message exists with user :', { account, password });
      }
      return userInfo;
    },
  },
};
