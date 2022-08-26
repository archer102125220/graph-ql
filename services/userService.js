import crypto from 'crypto';
import { userList, Sequelize } from '@/models';
const { Op } = Sequelize;

export class userService {
  allUsers = async () => {
    try {
      return JSON.parse(
        JSON.stringify(
          await userList.findAll({
            attributes: {
              exclude: ['password'],
            },
          })
        )
      );
    } catch (error) {
      console.log(error);
    }
  };
  findUser = async (payload = {}) => {
    try {
      return JSON.parse(
        JSON.stringify(
          await userList.findAll({
            where: payload,
            attributes: {
              exclude: ['password'],
            },
          })
        )
      );
    } catch (error) {
      console.log(error);
    }
  };
  createUser = async (payload = {}) => {
    try {
      const { account, password, email } = payload;

      return JSON.parse(
        JSON.stringify(
          await userList.findOrCreate({
            where: {
              [Op.or]: [
                { account: { [Op.eq]: account } },
                { email: { [Op.eq]: email } },
              ],
            },
            defaults: {
              account,
              email,
              password: crypto
                .createHash('sha1')
                .update(password)
                .digest('hex'),
            },
          })
        )
      )[0];
    } catch (error) {
      console.log(error);
    }
  };
}

export default new userService();
